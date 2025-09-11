from django.core.management.base import BaseCommand
from django.db import transaction
import json
import os
from api.models import (
    Estado, Ciudad, Municipio, TipoInmueble, Inmueble, Usuario, Rol
)

class Command(BaseCommand):
    help = 'Importa datos de casas desde casas.json'

    def handle(self, *args, **options):
        # Ruta al archivo casas.json
        json_file_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            '..', 'frontend', 'casas.json'
        )
        
        try:
            with open(json_file_path, 'r', encoding='utf-8') as file:
                casas_data = json.load(file)
            
            # Filtrar solo los objetos válidos (ignorar comentarios)
            casas_validas = [casa for casa in casas_data if isinstance(casa, dict) and 'id' in casa]
            
            self.stdout.write(f'Procesando {len(casas_validas)} propiedades...')
            
            with transaction.atomic():
                # Obtener o crear el estado Carabobo
                estado, created = Estado.objects.get_or_create(
                    nombre_estado='Carabobo'
                )
                if created:
                    self.stdout.write('✓ Estado Carabobo creado')
                
                # Obtener o crear roles
                rol_propietario, created = Rol.objects.get_or_create(
                    nombre_rol='Propietario'
                )
                if created:
                    self.stdout.write('✓ Rol Propietario creado')
                
                # Obtener o crear tipos de inmueble
                tipos_inmueble = {}
                for casa in casas_validas:
                    tipo_nombre = casa.get('tipo', 'Casa')
                    if tipo_nombre not in tipos_inmueble:
                        tipo_obj, created = TipoInmueble.objects.get_or_create(
                            nombre_tipo=tipo_nombre,
                            defaults={'descripcion': f'Inmueble tipo {tipo_nombre}'}
                        )
                        tipos_inmueble[tipo_nombre] = tipo_obj
                        if created:
                            self.stdout.write(f'✓ Tipo de inmueble {tipo_nombre} creado')
                
                # Obtener o crear ciudades y municipios
                ubicaciones = {}
                for casa in casas_validas:
                    municipio_nombre = casa.get('municipio', 'Valencia')
                    zona = casa.get('zona', 'Centro')
                    
                    if municipio_nombre not in ubicaciones:
                        # Crear ciudad si no existe
                        ciudad_nombre = municipio_nombre  # Asumimos que municipio = ciudad
                        ciudad, created = Ciudad.objects.get_or_create(
                            nombre_ciudad=ciudad_nombre,
                            estado=estado
                        )
                        if created:
                            self.stdout.write(f'✓ Ciudad {ciudad_nombre} creada')
                        
                        # Crear municipio
                        municipio, created = Municipio.objects.get_or_create(
                            nombre_municipio=municipio_nombre,
                            ciudad=ciudad
                        )
                        if created:
                            self.stdout.write(f'✓ Municipio {municipio_nombre} creado')
                        
                        ubicaciones[municipio_nombre] = municipio
                
                # Crear usuario propietario por defecto
                propietario_default, created = Usuario.objects.get_or_create(
                    email='propietario@ica.com',
                    defaults={
                        'nombres': 'Propietario',
                        'apellidos': 'Default',
                        'password_hash': 'default_password',
                        'telefono': '0000-0000000',
                        'cedula': 'V-00000000',
                        'rol': rol_propietario,
                        'activo': True
                    }
                )
                if created:
                    self.stdout.write('✓ Usuario propietario por defecto creado')
                
                # Crear inmuebles
                inmuebles_creados = 0
                for casa in casas_validas:
                    # Generar código de referencia único
                    codigo_ref = f"ICA-{casa['id']:03d}-{casa.get('municipio', 'VAL').upper()[:3]}"
                    
                    # Verificar si ya existe
                    if Inmueble.objects.filter(codigo_referencia=codigo_ref).exists():
                        self.stdout.write(f'⚠ Inmueble {codigo_ref} ya existe, saltando...')
                        continue
                    
                    # Obtener datos
                    municipio_nombre = casa.get('municipio', 'Valencia')
                    tipo_nombre = casa.get('tipo', 'Casa')
                    
                    inmueble = Inmueble.objects.create(
                        codigo_referencia=codigo_ref,
                        titulo_publicacion=casa.get('descripcion', f'Propiedad en {municipio_nombre}'),
                        descripcion_publica=casa.get('descripcion', ''),
                        tipo_inmueble=tipos_inmueble.get(tipo_nombre),
                        municipio=ubicaciones.get(municipio_nombre),
                        direccion_exacta=casa.get('direccion', 'Dirección no especificada'),
                        precio=float(casa.get('precio', 0)),
                        superficie_terreno=float(casa.get('metros_cuadrados', 0)) * 1.2,  # Estimación
                        superficie_construccion=float(casa.get('metros_cuadrados', 0)),
                        habitaciones=casa.get('habitaciones', 0),
                        banos=casa.get('banos', 0),
                        puestos_estacionamiento=1,  # Valor por defecto
                        ano_construccion=2020,  # Valor por defecto
                        estatus_venta='Disponible',
                        estatus_moderacion='Aprobado',
                        propietario=propietario_default
                    )
                    
                    inmuebles_creados += 1
                    self.stdout.write(f'✓ Inmueble {codigo_ref} creado')
                
                self.stdout.write(
                    self.style.SUCCESS(
                        f'¡Importación completada! {inmuebles_creados} inmuebles creados exitosamente.'
                    )
                )
                
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR('No se encontró el archivo casas.json')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error durante la importación: {str(e)}')
            )
