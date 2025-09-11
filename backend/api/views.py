from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q

from .models import (
	Estado, Ciudad, Municipio, Rol, Usuario, TipoInmueble, Caracteristica,
	Inmueble, InmuebleCaracteristica, Operacion, Cita, Conversacion, Mensaje
)
from .serializers import (
	EstadoSerializer, CiudadSerializer, MunicipioSerializer, RolSerializer, UsuarioSerializer,
	TipoInmuebleSerializer, CaracteristicaSerializer, InmuebleSerializer, InmuebleCaracteristicaSerializer,
	OperacionSerializer, CitaSerializer, ConversacionSerializer, MensajeSerializer
)


class ReadOnlyOrIsOwner(permissions.BasePermission):
	"""Permiso: lectura para todos, escritura sólo para usuarios autenticados (puede adaptarse)."""

	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		return request.user and request.user.is_authenticated


class EstadoViewSet(viewsets.ModelViewSet):
	queryset = Estado.objects.all().order_by('nombre_estado')
	serializer_class = EstadoSerializer
	permission_classes = [permissions.AllowAny]


class CiudadViewSet(viewsets.ModelViewSet):
	queryset = Ciudad.objects.select_related('estado').all()
	serializer_class = CiudadSerializer
	permission_classes = [permissions.AllowAny]


class MunicipioViewSet(viewsets.ModelViewSet):
	queryset = Municipio.objects.select_related('ciudad').all()
	serializer_class = MunicipioSerializer
	permission_classes = [permissions.AllowAny]


class RolViewSet(viewsets.ModelViewSet):
	queryset = Rol.objects.all()
	serializer_class = RolSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UsuarioViewSet(viewsets.ModelViewSet):
	queryset = Usuario.objects.all()
	serializer_class = UsuarioSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TipoInmuebleViewSet(viewsets.ModelViewSet):
	queryset = TipoInmueble.objects.all()
	serializer_class = TipoInmuebleSerializer
	permission_classes = [permissions.AllowAny]


class CaracteristicaViewSet(viewsets.ModelViewSet):
	queryset = Caracteristica.objects.all()
	serializer_class = CaracteristicaSerializer
	permission_classes = [permissions.AllowAny]


class InmuebleViewSet(viewsets.ModelViewSet):
	queryset = Inmueble.objects.select_related('tipo_inmueble', 'municipio__ciudad').all().order_by('-fecha_publicacion')
	serializer_class = InmuebleSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['titulo_publicacion', 'descripcion_publica', 'codigo_referencia', 'municipio__nombre_municipio', 'municipio__ciudad__nombre_ciudad']
	ordering_fields = ['precio', 'fecha_publicacion']

	# Custom route to return a simplified list compatible with frontend /api/casas
	@action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
	def casas(self, request):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		serializer = self.get_serializer(page or queryset, many=True)
		# Transform to the lightweight shape the frontend expects
		def to_front(item):
			return {
				'id': str(item.get('id')),
				'title': item.get('titulo_publicacion'),
				'description': item.get('descripcion_publica') or item.get('titulo_publicacion'),
				'price': float(item.get('precio') or 0),
				'location': f"{item.get('municipio', {}).get('ciudad', {}).get('nombre_ciudad', 'N/A')}, {item.get('municipio', {}).get('nombre_municipio', 'N/A')}",
				'bedrooms': item.get('habitaciones', 0),
				'bathrooms': item.get('banos', 0),
				'size': float(item.get('superficie_construccion') or 0),
				'image': '/placeholder.svg?height=400&width=600&text=Casa',
				'features': [char.get('caracteristica', {}).get('nombre_caracteristica', '') for char in item.get('caracteristicas', [])],
				'yearBuilt': item.get('ano_construccion'),
				'energyRating': 'A',  # Default value
			}

		data = [to_front(i) for i in serializer.data]
		return self.get_paginated_response(data) if page is not None else Response(data)

	@action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
	def search(self, request):
		"""Búsqueda avanzada de inmuebles"""
		queryset = self.get_queryset()
		
		# Filtros
		tipo_inmueble = request.query_params.get('tipo_inmueble')
		ciudad = request.query_params.get('ciudad')
		precio_min = request.query_params.get('precio_min')
		precio_max = request.query_params.get('precio_max')
		habitaciones = request.query_params.get('habitaciones')
		banos = request.query_params.get('banos')
		
		if tipo_inmueble:
			queryset = queryset.filter(tipo_inmueble__id=tipo_inmueble)
		if ciudad:
			queryset = queryset.filter(municipio__ciudad__nombre_ciudad__icontains=ciudad)
		if precio_min:
			queryset = queryset.filter(precio__gte=precio_min)
		if precio_max:
			queryset = queryset.filter(precio__lte=precio_max)
		if habitaciones:
			queryset = queryset.filter(habitaciones__gte=habitaciones)
		if banos:
			queryset = queryset.filter(banos__gte=banos)
		
		page = self.paginate_queryset(queryset)
		serializer = self.get_serializer(page or queryset, many=True)
		return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

	@action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
	def schedule_visit(self, request, pk=None):
		"""Programar una visita a un inmueble"""
		inmueble = self.get_object()
		data = request.data
		
		cita = Cita.objects.create(
			inmueble=inmueble,
			usuario_interesado_id=request.user.id,
			usuario_propietario=inmueble.propietario,
			fecha_hora_cita=data.get('fecha_hora_cita'),
			observaciones=data.get('observaciones', '')
		)
		
		return Response({
			'message': 'Visita programada exitosamente',
			'cita': CitaSerializer(cita).data
		}, status=status.HTTP_201_CREATED)


class InmuebleCaracteristicaViewSet(viewsets.ModelViewSet):
	queryset = InmuebleCaracteristica.objects.select_related('inmueble', 'caracteristica').all()
	serializer_class = InmuebleCaracteristicaSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class OperacionViewSet(viewsets.ModelViewSet):
	queryset = Operacion.objects.select_related('inmueble').all()
	serializer_class = OperacionSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CitaViewSet(viewsets.ModelViewSet):
	queryset = Cita.objects.select_related('inmueble').all()
	serializer_class = CitaSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ConversacionViewSet(viewsets.ModelViewSet):
	queryset = Conversacion.objects.select_related('inmueble').all()
	serializer_class = ConversacionSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MensajeViewSet(viewsets.ModelViewSet):
	queryset = Mensaje.objects.select_related('conversacion', 'usuario_emisor').all()
	serializer_class = MensajeSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# Public property listing endpoint
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def casas_publicas(request):
	"""Endpoint público para listar casas sin autenticación"""
	try:
		queryset = Inmueble.objects.select_related('tipo_inmueble', 'municipio__ciudad').filter(
			estatus_moderacion='Aprobado'
		).order_by('-fecha_publicacion')
		
		# Transform to the lightweight shape the frontend expects
		def to_front(item):
			# Mapear imágenes basado en el código de referencia
			image_map = {
				'ICA-001-VAL': '/Imagenes/20241203200818056423000000-o.jpg',
				'ICA-002-NAG': '/Imagenes/casa_en_venta_en_naguanagua_carabobo_243_m2_3_hab_5900001739233253971.jpg',
				'ICA-003-SAN': '/Imagenes/IMG-20230322-WA0294.jpg',
				'ICA-004-GUA': '/Imagenes/MIL20241116120235.jpg',
				'ICA-005-PUE': '/Imagenes/las-casas-coloniales-del-casco-historico-de-puerto-cabello-parecen-contar-leyendas-ancestralesjpg-4768.jpg',
				'ICA-006-LOS': '/Imagenes/ApartamentolosGuayos.png',
				'ICA-007-LIB': '/Imagenes/TocuyitoTownhouse.png',
				'ICA-008-DIE': '/Imagenes/CasaMariara.png',
				'ICA-009-VAL': '/Imagenes/ApartamentoValencia.png',
				'ICA-010-GUA': '/Imagenes/ApartamentoGuacara.png',
				'ICA-011-SAN': '/Imagenes/CasaSanJoaquin.png',
				'ICA-012-NAG': '/Imagenes/ApartamentoNaguanagua.png',
				'ICA-013-PUE': '/Imagenes/CasaPuertoCabello.png',
				'ICA-014-LOS': '/Imagenes/ApartamentolosGuayos2.png',
				'ICA-015-LIB': '/Imagenes/TownhouseTocuyito.png',
			}
			
			return {
				'id': str(item.id),
				'title': item.titulo_publicacion,
				'description': item.descripcion_publica or item.titulo_publicacion,
				'price': float(item.precio or 0),
				'location': f"{item.municipio.ciudad.nombre_ciudad if item.municipio and item.municipio.ciudad else 'N/A'}, {item.municipio.nombre_municipio if item.municipio else 'N/A'}",
				'bedrooms': item.habitaciones or 0,
				'bathrooms': item.banos or 0,
				'size': float(item.superficie_construccion or 0),
				'image': image_map.get(item.codigo_referencia, '/placeholder.svg?height=400&width=600&text=Casa'),
				'features': [],
				'yearBuilt': item.ano_construccion,
				'energyRating': 'A',
			}
		
		data = [to_front(item) for item in queryset]
		return Response(data)
		
	except Exception as e:
		return Response(
			{'error': str(e)}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)


# Authentication views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
	"""Registrar un nuevo usuario"""
	try:
		data = request.data
		
		# Validar datos requeridos
		required_fields = ['nombres', 'apellidos', 'email', 'password']
		for field in required_fields:
			if field not in data:
				return Response(
					{'error': f'El campo {field} es requerido'}, 
					status=status.HTTP_400_BAD_REQUEST
				)
		
		# Verificar si el email ya existe
		if Usuario.objects.filter(email=data['email']).exists():
			return Response(
				{'error': 'Ya existe un usuario con este email'}, 
				status=status.HTTP_400_BAD_REQUEST
			)
		
		# Crear el usuario
		usuario = Usuario.objects.create(
			nombres=data['nombres'],
			apellidos=data['apellidos'],
			email=data['email'],
			password_hash=data['password'],
			telefono=data.get('telefono', ''),
			cedula=data.get('cedula', ''),
			rol_id=data.get('rol_id')
		)
		
		# Generar tokens JWT
		refresh = RefreshToken.for_user(usuario)
		
		return Response({
			'message': 'Usuario registrado exitosamente',
			'user': UsuarioSerializer(usuario).data,
			'tokens': {
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			}
		}, status=status.HTTP_201_CREATED)
		
	except Exception as e:
		return Response(
			{'error': str(e)}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
	"""Iniciar sesión de usuario"""
	try:
		email = request.data.get('email')
		password = request.data.get('password')
		
		if not email or not password:
			return Response(
				{'error': 'Email y contraseña son requeridos'}, 
				status=status.HTTP_400_BAD_REQUEST
			)
		
		# Buscar usuario por email
		try:
			usuario = Usuario.objects.get(email=email)
		except Usuario.DoesNotExist:
			return Response(
				{'error': 'Credenciales inválidas'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		
		# Verificar contraseña (simplificado - en producción usar check_password)
		if usuario.password_hash != password:
			return Response(
				{'error': 'Credenciales inválidas'}, 
				status=status.HTTP_401_UNAUTHORIZED
			)
		
		# Generar tokens JWT
		refresh = RefreshToken.for_user(usuario)
		
		return Response({
			'message': 'Inicio de sesión exitoso',
			'user': UsuarioSerializer(usuario).data,
			'tokens': {
				'refresh': str(refresh),
				'access': str(refresh.access_token),
			}
		}, status=status.HTTP_200_OK)
		
	except Exception as e:
		return Response(
			{'error': str(e)}, 
			status=status.HTTP_500_INTERNAL_SERVER_ERROR
		)

