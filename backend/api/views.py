from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response

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
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CiudadViewSet(viewsets.ModelViewSet):
	queryset = Ciudad.objects.select_related('estado').all()
	serializer_class = CiudadSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class MunicipioViewSet(viewsets.ModelViewSet):
	queryset = Municipio.objects.select_related('ciudad').all()
	serializer_class = MunicipioSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


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
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CaracteristicaViewSet(viewsets.ModelViewSet):
	queryset = Caracteristica.objects.all()
	serializer_class = CaracteristicaSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class InmuebleViewSet(viewsets.ModelViewSet):
	queryset = Inmueble.objects.select_related('tipo_inmueble', 'municipio__ciudad').all().order_by('-fecha_publicacion')
	serializer_class = InmuebleSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['titulo_publicacion', 'descripcion_publica', 'codigo_referencia', 'municipio__nombre_municipio', 'municipio__ciudad__nombre_ciudad']
	ordering_fields = ['precio_referencial', 'fecha_publicacion']

	# Custom route to return a simplified list compatible with frontend /api/casas
	@action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
	def casas(self, request):
		queryset = self.filter_queryset(self.get_queryset())
		page = self.paginate_queryset(queryset)
		serializer = self.get_serializer(page or queryset, many=True)
		# Transform to the lightweight shape the frontend expects
		def to_front(item):
			return {
				'id': item.get('id'),
				'tipo': item.get('tipo'),
				'ciudad': item.get('ciudad'),
				'zona': item.get('zona'),
				'direccion': item.get('direccion'),
				'descripcion': item.get('descripcion_publica') or item.get('titulo_publicacion'),
				'precio': float(item.get('precio_referencial') or 0),
				'moneda': item.get('moneda'),
				'habitaciones': item.get('habitaciones'),
				'banos': item.get('banos'),
				'metros_cuadrados': item.get('metros_cuadrados'),
				'foto': item.get('foto'),
			}

		data = [to_front(i) for i in serializer.data]
		return self.get_paginated_response(data) if page is not None else Response(data)


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

