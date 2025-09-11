import os
from django.core.management.base import BaseCommand
from api.models import Estado, Ciudad, Municipio, TipoInmueble, Caracteristica, Rol, Usuario
from django.contrib.auth.hashers import make_password
from django.utils import timezone

class Command(BaseCommand):
    help = 'Inicializa datos de Venezuela: estados, ciudades, municipios, tipos de inmuebles y características'

    def handle(self, *args, **options):
        # Datos de estados de Venezuela
        estados_data = [
            'Amazonas', 'Anzoátegui', 'Apure', 'Aragua', 'Barinas', 'Bolívar',
            'Carabobo', 'Cojedes', 'Delta Amacuro', 'Falcón', 'Guárico', 'Lara',
            'Mérida', 'Miranda', 'Monagas', 'Nueva Esparta', 'Portuguesa', 'Sucre',
            'Táchira', 'Trujillo', 'Vargas', 'Yaracuy', 'Zulia', 'Distrito Capital'
        ]

        # Crear estados
        for estado_nombre in estados_data:
            estado, created = Estado.objects.get_or_create(nombre_estado=estado_nombre)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Estado {estado_nombre} creado'))

        # Datos de ciudades principales por estado
        ciudades_data = {
            'Carabobo': ['Valencia', 'Naguanagua', 'San Diego', 'Guacara', 'Puerto Cabello', 'Los Guayos', 'Libertador', 'Diego Ibarra', 'San Joaquín'],
            'Distrito Capital': ['Caracas'],
            'Miranda': ['Los Teques', 'Guatire', 'Guarenas', 'Santa Teresa del Tuy', 'Cúa', 'Ocumare del Tuy'],
            'Zulia': ['Maracaibo', 'Cabimas', 'Ciudad Ojeda', 'San Francisco', 'La Concepción'],
            'Lara': ['Barquisimeto', 'Cabudare', 'Duaca', 'El Tocuyo', 'Quíbor'],
            'Aragua': ['Maracay', 'Turmero', 'La Victoria', 'Villa de Cura', 'Cagua'],
            'Anzoátegui': ['Barcelona', 'Puerto La Cruz', 'Lechería', 'El Tigre', 'Anaco'],
            'Bolívar': ['Ciudad Guayana', 'Ciudad Bolívar', 'Upata', 'El Callao', 'Tumeremo'],
            'Táchira': ['San Cristóbal', 'Táriba', 'Rubio', 'La Fría', 'Colón'],
            'Mérida': ['Mérida', 'El Vigía', 'Tovar', 'Ejido', 'Mucuchíes'],
            'Monagas': ['Maturín', 'Punta de Mata', 'Caripito', 'Temblador', 'Aragua de Maturín'],
            'Sucre': ['Cumaná', 'Carúpano', 'Güiria', 'Cariaco', 'Tunapuy'],
            'Falcón': ['Coro', 'Punto Fijo', 'La Vela de Coro', 'Dabajuro', 'Churuguara'],
            'Lara': ['Barquisimeto', 'Cabudare', 'Duaca', 'El Tocuyo', 'Quíbor'],
            'Portuguesa': ['Guanare', 'Acarigua', 'Araure', 'Turen', 'Guanarito'],
            'Yaracuy': ['San Felipe', 'Yaritagua', 'Chivacoa', 'Nirgua', 'Aroa'],
            'Cojedes': ['San Carlos', 'Tinaquillo', 'El Baúl', 'El Pao', 'Tinaco'],
            'Guárico': ['San Juan de los Morros', 'Valle de la Pascua', 'Calabozo', 'Zaraza', 'El Sombrero'],
            'Barinas': ['Barinas', 'Socopó', 'Santa Bárbara', 'Sabaneta', 'Barinitas'],
            'Apure': ['San Fernando de Apure', 'Guasdualito', 'Achaguas', 'Biruaca', 'Elorza'],
            'Amazonas': ['Puerto Ayacucho', 'San Carlos de Río Negro', 'Maroa', 'San Juan de Manapiare'],
            'Delta Amacuro': ['Tucupita', 'Pedernales', 'Curiapo', 'Sierra Imataca'],
            'Nueva Esparta': ['La Asunción', 'Porlamar', 'Pampatar', 'Juan Griego', 'Santa Ana'],
            'Vargas': ['La Guaira', 'Catia La Mar', 'Macuto', 'Caraballeda', 'Naiguatá'],
            'Trujillo': ['Trujillo', 'Valera', 'Boconó', 'La Puerta', 'Betijoque']
        }

        # Crear ciudades
        for estado_nombre, ciudades in ciudades_data.items():
            try:
                estado = Estado.objects.get(nombre_estado=estado_nombre)
                for ciudad_nombre in ciudades:
                    ciudad, created = Ciudad.objects.get_or_create(
                        nombre_ciudad=ciudad_nombre,
                        estado=estado
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'✓ Ciudad {ciudad_nombre} creada en {estado_nombre}'))
            except Estado.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Estado {estado_nombre} no encontrado'))

        # Datos de municipios principales (ejemplos para Carabobo)
        municipios_carabobo = {
            'Valencia': ['Valencia', 'Prebo', 'La Viña', 'El Trigal', 'Los Colorados'],
            'Naguanagua': ['Naguanagua', 'La Granja', 'Valle de Camoruco', 'La Entrada'],
            'San Diego': ['San Diego', 'El Remanso', 'La Cumaca', 'El Trigal'],
            'Guacara': ['Guacara', 'Centro', 'Yagua', 'Los Guayos'],
            'Puerto Cabello': ['Puerto Cabello', 'El Palito', 'Morón', 'Borburata'],
            'Los Guayos': ['Los Guayos', 'Paraparal', 'El Pilar'],
            'Libertador': ['Tocuyito', 'El Trigal', 'La Entrada'],
            'Diego Ibarra': ['Mariara', 'El Rincón', 'La Cumaca'],
            'San Joaquín': ['San Joaquín', 'El Bosque', 'La Cumaca']
        }

        # Crear municipios para Carabobo
        try:
            estado_carabobo = Estado.objects.get(nombre_estado='Carabobo')
            for ciudad_nombre, municipios in municipios_carabobo.items():
                try:
                    ciudad = Ciudad.objects.get(nombre_ciudad=ciudad_nombre, estado=estado_carabobo)
                    for municipio_nombre in municipios:
                        municipio, created = Municipio.objects.get_or_create(
                            nombre_municipio=municipio_nombre,
                            ciudad=ciudad
                        )
                        if created:
                            self.stdout.write(self.style.SUCCESS(f'✓ Municipio {municipio_nombre} creado en {ciudad_nombre}'))
                except Ciudad.DoesNotExist:
                    self.stdout.write(self.style.WARNING(f'Ciudad {ciudad_nombre} no encontrada en Carabobo'))
        except Estado.DoesNotExist:
            self.stdout.write(self.style.WARNING('Estado Carabobo no encontrado'))

        # Tipos de inmuebles
        tipos_inmueble = [
            'Casa', 'Apartamento', 'Townhouse', 'Penthouse', 'Duplex', 'Quinta',
            'Local Comercial', 'Oficina', 'Bodega', 'Terreno', 'Finca', 'Edificio'
        ]

        for tipo in tipos_inmueble:
            tipo_obj, created = TipoInmueble.objects.get_or_create(nombre_tipo=tipo)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Tipo de inmueble {tipo} creado'))

        # Características de inmuebles
        caracteristicas = [
            'Piscina', 'Jardín', 'Garaje', 'Seguridad 24/7', 'Ascensor', 'Terraza',
            'Balcón', 'Vista al mar', 'Vista a la montaña', 'Aire acondicionado',
            'Calefacción', 'Cocina integral', 'Closets empotrados', 'Pisos de mármol',
            'Pisos de cerámica', 'Pisos de madera', 'Vigilancia privada', 'Portería',
            'Área de juegos', 'Gimnasio', 'Salón de eventos', 'Churrasquera',
            'Área de lavandería', 'Estacionamiento visitantes', 'Cisterna',
            'Tanque de agua', 'Sistema de seguridad', 'Cámaras de seguridad',
            'Internet incluido', 'Cable incluido', 'Agua caliente', 'Gas natural',
            'Gas directo', 'Electricidad 220V', 'Telefonía', 'Antena parabólica'
        ]

        for caracteristica in caracteristicas:
            carac_obj, created = Caracteristica.objects.get_or_create(nombre_caracteristica=caracteristica)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Característica {caracteristica} creada'))

        # Crear roles
        roles = ['Administrador', 'Moderador', 'Propietario', 'Cliente', 'Agente']
        for rol_nombre in roles:
            rol, created = Rol.objects.get_or_create(nombre_rol=rol_nombre)
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Rol {rol_nombre} creado'))

        # Crear usuario administrador si no existe
        admin_rol, _ = Rol.objects.get_or_create(nombre_rol='Administrador')
        if not Usuario.objects.filter(email='admin@ica.com').exists():
            admin_user = Usuario.objects.create(
                nombres='Administrador',
                apellidos='ICA',
                email='admin@ica.com',
                password_hash=make_password('admin123'),
                telefono='+58 412 000 0000',
                cedula='V-00000000',
                rol=admin_rol,
                activo=True
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Usuario administrador creado: {admin_user.email}'))

        self.stdout.write(self.style.SUCCESS('¡Datos de Venezuela inicializados exitosamente!'))
