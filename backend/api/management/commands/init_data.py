from django.core.management.base import BaseCommand
from api.models import Estado, Ciudad, Municipio, Rol, TipoInmueble, Caracteristica, Usuario, Inmueble
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Inicializa datos básicos para la aplicación'

    def handle(self, *args, **options):
        self.stdout.write('Inicializando datos básicos...')
        
        # Crear estados
        estados_data = [
            {'nombre_estado': 'Carabobo'},
            {'nombre_estado': 'Distrito Capital'},
            {'nombre_estado': 'Miranda'},
            {'nombre_estado': 'Zulia'},
        ]
        
        for estado_data in estados_data:
            estado, created = Estado.objects.get_or_create(
                nombre_estado=estado_data['nombre_estado']
            )
            if created:
                self.stdout.write(f'Creado estado: {estado.nombre_estado}')
        
        # Crear ciudades
        carabobo = Estado.objects.get(nombre_estado='Carabobo')
        dc = Estado.objects.get(nombre_estado='Distrito Capital')
        
        ciudades_data = [
            {'nombre_ciudad': 'Valencia', 'estado': carabobo},
            {'nombre_ciudad': 'Puerto Cabello', 'estado': carabobo},
            {'nombre_ciudad': 'Mariara', 'estado': carabobo},
            {'nombre_ciudad': 'Caracas', 'estado': dc},
        ]
        
        for ciudad_data in ciudades_data:
            ciudad, created = Ciudad.objects.get_or_create(
                nombre_ciudad=ciudad_data['nombre_ciudad'],
                estado=ciudad_data['estado']
            )
            if created:
                self.stdout.write(f'Creada ciudad: {ciudad.nombre_ciudad}')
        
        # Crear municipios
        valencia = Ciudad.objects.get(nombre_ciudad='Valencia')
        puerto_cabello = Ciudad.objects.get(nombre_ciudad='Puerto Cabello')
        mariara = Ciudad.objects.get(nombre_ciudad='Mariara')
        caracas = Ciudad.objects.get(nombre_ciudad='Caracas')
        
        municipios_data = [
            {'nombre_municipio': 'Naguanagua', 'ciudad': valencia},
            {'nombre_municipio': 'Los Guayos', 'ciudad': valencia},
            {'nombre_municipio': 'San Joaquín', 'ciudad': valencia},
            {'nombre_municipio': 'Puerto Cabello', 'ciudad': puerto_cabello},
            {'nombre_municipio': 'Mariara', 'ciudad': mariara},
            {'nombre_municipio': 'Chacao', 'ciudad': caracas},
            {'nombre_municipio': 'Baruta', 'ciudad': caracas},
        ]
        
        for municipio_data in municipios_data:
            municipio, created = Municipio.objects.get_or_create(
                nombre_municipio=municipio_data['nombre_municipio'],
                ciudad=municipio_data['ciudad']
            )
            if created:
                self.stdout.write(f'Creado municipio: {municipio.nombre_municipio}')
        
        # Crear roles
        roles_data = [
            {'nombre_rol': 'Cliente'},
            {'nombre_rol': 'Agente'},
            {'nombre_rol': 'Administrador'},
        ]
        
        for rol_data in roles_data:
            rol, created = Rol.objects.get_or_create(
                nombre_rol=rol_data['nombre_rol']
            )
            if created:
                self.stdout.write(f'Creado rol: {rol.nombre_rol}')
        
        # Crear tipos de inmueble
        tipos_data = [
            {'nombre_tipo': 'Casa', 'descripcion': 'Vivienda unifamiliar'},
            {'nombre_tipo': 'Apartamento', 'descripcion': 'Vivienda en edificio'},
            {'nombre_tipo': 'Townhouse', 'descripcion': 'Casa adosada'},
            {'nombre_tipo': 'Penthouse', 'descripcion': 'Ático de lujo'},
        ]
        
        for tipo_data in tipos_data:
            tipo, created = TipoInmueble.objects.get_or_create(
                nombre_tipo=tipo_data['nombre_tipo']
            )
            if created:
                self.stdout.write(f'Creado tipo de inmueble: {tipo.nombre_tipo}')
        
        # Crear características
        caracteristicas_data = [
            {'nombre_caracteristica': 'Piscina'},
            {'nombre_caracteristica': 'Jardín'},
            {'nombre_caracteristica': 'Garaje'},
            {'nombre_caracteristica': 'Seguridad 24h'},
            {'nombre_caracteristica': 'Domótica'},
            {'nombre_caracteristica': 'Terraza'},
            {'nombre_caracteristica': 'Balcón'},
            {'nombre_caracteristica': 'Ascensor'},
        ]
        
        for caracteristica_data in caracteristicas_data:
            caracteristica, created = Caracteristica.objects.get_or_create(
                nombre_caracteristica=caracteristica_data['nombre_caracteristica']
            )
            if created:
                self.stdout.write(f'Creada característica: {caracteristica.nombre_caracteristica}')
        
        # Crear usuario administrador
        admin_rol = Rol.objects.get(nombre_rol='Administrador')
        admin, created = Usuario.objects.get_or_create(
            email='admin@ica.com',
            defaults={
                'nombres': 'Administrador',
                'apellidos': 'Sistema',
                'password_hash': make_password('admin123'),
                'rol': admin_rol,
                'activo': True
            }
        )
        if created:
            self.stdout.write('Creado usuario administrador: admin@ica.com / admin123')
        
        # Crear algunas propiedades de ejemplo
        casa_tipo = TipoInmueble.objects.get(nombre_tipo='Casa')
        apartamento_tipo = TipoInmueble.objects.get(nombre_tipo='Apartamento')
        naguanagua = Municipio.objects.get(nombre_municipio='Naguanagua')
        los_guayos = Municipio.objects.get(nombre_municipio='Los Guayos')
        
        inmuebles_data = [
            {
                'codigo_referencia': 'CASA-001',
                'titulo_publicacion': 'Casa Moderna en Naguanagua',
                'descripcion_publica': 'Hermosa casa moderna con 3 habitaciones, 2 baños, jardín y garaje para 2 vehículos.',
                'tipo_inmueble': casa_tipo,
                'municipio': naguanagua,
                'direccion_exacta': 'Av. Universidad, Naguanagua',
                'precio': 150000.00,
                'superficie_terreno': 200.00,
                'superficie_construccion': 120.00,
                'habitaciones': 3,
                'banos': 2,
                'puestos_estacionamiento': 2,
                'ano_construccion': 2020,
                'estatus_venta': 'Disponible',
                'estatus_moderacion': 'Aprobado',
                'propietario': admin,
            },
            {
                'codigo_referencia': 'APT-002',
                'titulo_publicacion': 'Apartamento de Lujo en Los Guayos',
                'descripcion_publica': 'Espectacular apartamento con vista al mar, 2 habitaciones, 2 baños, balcón y todas las comodidades.',
                'tipo_inmueble': apartamento_tipo,
                'municipio': los_guayos,
                'direccion_exacta': 'Torre Marina, Los Guayos',
                'precio': 120000.00,
                'superficie_terreno': 0.00,
                'superficie_construccion': 85.00,
                'habitaciones': 2,
                'banos': 2,
                'puestos_estacionamiento': 1,
                'ano_construccion': 2021,
                'estatus_venta': 'Disponible',
                'estatus_moderacion': 'Aprobado',
                'propietario': admin,
            },
        ]
        
        for inmueble_data in inmuebles_data:
            inmueble, created = Inmueble.objects.get_or_create(
                codigo_referencia=inmueble_data['codigo_referencia'],
                defaults=inmueble_data
            )
            if created:
                self.stdout.write(f'Creado inmueble: {inmueble.codigo_referencia}')
        
        self.stdout.write(
            self.style.SUCCESS('¡Datos inicializados correctamente!')
        )
