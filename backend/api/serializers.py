from rest_framework import serializers
from .models import (
    Estado, Ciudad, Municipio, Rol, Usuario, TipoInmueble,
    Caracteristica, Inmueble, InmuebleCaracteristica,
    Operacion, Cita, Conversacion, Mensaje
)
from django.contrib.auth.hashers import make_password

# Geographical serializers
class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class CiudadSerializer(serializers.ModelSerializer):
    estado = EstadoSerializer(read_only=True)
    estado_id = serializers.PrimaryKeyRelatedField(
        queryset=Estado.objects.all(),
        source='estado',
        write_only=True
    )

    class Meta:
        model = Ciudad
        fields = ['id', 'nombre_ciudad', 'estado', 'estado_id']

class MunicipioSerializer(serializers.ModelSerializer):
    ciudad = CiudadSerializer(read_only=True)
    ciudad_id = serializers.PrimaryKeyRelatedField(
        queryset=Ciudad.objects.all(),
        source='ciudad',
        write_only=True
    )

    class Meta:
        model = Municipio
        fields = ['id', 'nombre_municipio', 'ciudad', 'ciudad_id']

# User and authentication serializers
class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(read_only=True)
    rol_id = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(),
        source='rol',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Usuario
        fields = ['id', 'nombres', 'apellidos', 'email', 'password_hash', 'telefono', 'cedula', 'rol', 'rol_id', 'fecha_registro', 'activo']
        read_only_fields = ['fecha_registro']
        extra_kwargs = {
            'password_hash': {'write_only': True}
        }
    
    # Hash password before saving
    def create(self, validated_data):
        if 'password_hash' in validated_data:
            validated_data['password_hash'] = make_password(validated_data.get('password_hash'))
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password_hash' in validated_data:
            validated_data['password_hash'] = make_password(validated_data.get('password_hash'))
        return super().update(instance, validated_data)

# Property related serializers
class TipoInmuebleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoInmueble
        fields = '__all__'

class CaracteristicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caracteristica
        fields = '__all__'

class InmuebleCaracteristicaSerializer(serializers.ModelSerializer):
    caracteristica = CaracteristicaSerializer(read_only=True)
    class Meta:
        model = InmuebleCaracteristica
        fields = ['caracteristica', 'valor']

class InmuebleSerializer(serializers.ModelSerializer):
    # Nested serializers to show related data
    tipo_inmueble = TipoInmuebleSerializer(read_only=True)
    municipio = MunicipioSerializer(read_only=True)
    propietario = UsuarioSerializer(read_only=True)
    moderador = UsuarioSerializer(read_only=True)

    # Writable fields for creating/updating
    tipo_inmueble_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoInmueble.objects.all(),
        source='tipo_inmueble',
        write_only=True
    )
    municipio_id = serializers.PrimaryKeyRelatedField(
        queryset=Municipio.objects.all(),
        source='municipio',
        write_only=True
    )
    propietario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        source='propietario',
        write_only=True
    )
    
    # Para manejar las características en el mismo endpoint
    caracteristicas = InmuebleCaracteristicaSerializer(source='inmueblecaracteristica_set', many=True, read_only=True)

    class Meta:
        model = Inmueble
        fields = [
            'id', 'codigo_referencia', 'titulo_publicacion', 'descripcion_publica',
            'tipo_inmueble', 'tipo_inmueble_id', 'municipio', 'municipio_id',
            'direccion_exacta', 'precio', 'superficie_terreno',
            'superficie_construccion', 'habitaciones', 'banos',
            'puestos_estacionamiento', 'ano_construccion', 'estatus_venta',
            'estatus_moderacion', 'moderador', 'fecha_moderacion', 'motivo_rechazo',
            'propietario', 'propietario_id', 'fecha_publicacion', 'caracteristicas'
        ]
        read_only_fields = ['estatus_moderacion', 'moderador', 'fecha_moderacion', 'motivo_rechazo']


# Transactional and communication serializers
class OperacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Operacion
        fields = '__all__'

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = '__all__'

class ConversacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversacion
        fields = '__all__'

class MensajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mensaje
        fields = '__all__'
