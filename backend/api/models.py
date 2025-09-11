from django.db import models
from django.utils import timezone


# Geographical models
class Estado(models.Model):
	nombre_estado = models.CharField(max_length=100, unique=True)

	def __str__(self):
		return self.nombre_estado


class Ciudad(models.Model):
	nombre_ciudad = models.CharField(max_length=100)
	estado = models.ForeignKey(Estado, null=True, blank=True, on_delete=models.SET_NULL, related_name='ciudades')

	class Meta:
		unique_together = (('nombre_ciudad', 'estado'),)

	def __str__(self):
		return f"{self.nombre_ciudad} - {self.estado}"


class Municipio(models.Model):
	nombre_municipio = models.CharField(max_length=150)
	ciudad = models.ForeignKey(Ciudad, null=True, blank=True, on_delete=models.SET_NULL, related_name='municipios')

	class Meta:
		unique_together = (('nombre_municipio', 'ciudad'),)

	def __str__(self):
		return f"{self.nombre_municipio} - {self.ciudad}"


# Roles and Users
class Rol(models.Model):
	nombre_rol = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return self.nombre_rol


class Usuario(models.Model):
	nombres = models.CharField(max_length=100)
	apellidos = models.CharField(max_length=100)
	email = models.EmailField(max_length=100, unique=True)
	password_hash = models.CharField(max_length=255)
	telefono = models.CharField(max_length=20, null=True, blank=True)
	cedula = models.CharField(max_length=20, unique=True, null=True, blank=True)
	rol = models.ForeignKey(Rol, null=True, blank=True, on_delete=models.SET_NULL, related_name='usuarios')
	fecha_registro = models.DateTimeField(default=timezone.now)
	activo = models.BooleanField(default=True)

	def __str__(self):
		return f"{self.nombres} {self.apellidos} <{self.email}>"


# Property related models
class TipoInmueble(models.Model):
	nombre_tipo = models.CharField(max_length=100, unique=True)
	descripcion = models.TextField(blank=True, null=True)

	def __str__(self):
		return self.nombre_tipo


class Caracteristica(models.Model):
	nombre_caracteristica = models.CharField(max_length=150, unique=True)

	def __str__(self):
		return self.nombre_caracteristica


class Inmueble(models.Model):
	MONEDA_CHOICES = (
		('USD', 'USD'),
		('EUR', 'EUR'),
		('BS', 'BS'),
	)

	ESTATUS_VENTA_CHOICES = (
		('Disponible', 'Disponible'),
		('Vendido', 'Vendido'),
		('Alquilado', 'Alquilado'),
		('Reservado', 'Reservado'),
	)

	ESTATUS_MODERACION_CHOICES = (
		('Pendiente', 'Pendiente'),
		('Aprobado', 'Aprobado'),
		('Rechazado', 'Rechazado'),
	)

	codigo_referencia = models.CharField(max_length=50, unique=True)
	titulo_publicacion = models.CharField(max_length=255)
	descripcion_publica = models.TextField(blank=True, null=True)
	tipo_inmueble = models.ForeignKey(TipoInmueble, null=True, blank=True, on_delete=models.SET_NULL, related_name='inmuebles')
	municipio = models.ForeignKey(Municipio, null=True, blank=True, on_delete=models.SET_NULL, related_name='inmuebles')
	direccion_exacta = models.CharField(max_length=255)
	precio = models.DecimalField(max_digits=18, decimal_places=2)
	superficie_terreno = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
	superficie_construccion = models.DecimalField(max_digits=10, decimal_places=2)
	habitaciones = models.IntegerField(default=0)
	banos = models.IntegerField(default=0)
	puestos_estacionamiento = models.IntegerField(default=0)
	ano_construccion = models.PositiveSmallIntegerField(null=True, blank=True)
	estatus_venta = models.CharField(max_length=10, choices=ESTATUS_VENTA_CHOICES, default='Disponible')

	# Moderation fields
	estatus_moderacion = models.CharField(max_length=10, choices=ESTATUS_MODERACION_CHOICES, default='Pendiente')
	moderador = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, related_name='moderated_inmuebles')
	fecha_moderacion = models.DateTimeField(null=True, blank=True)
	motivo_rechazo = models.TextField(blank=True, null=True)

	propietario = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.CASCADE, related_name='inmuebles')
	fecha_publicacion = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.codigo_referencia} - {self.titulo_publicacion}"


class InmuebleCaracteristica(models.Model):
	inmueble = models.ForeignKey(Inmueble, on_delete=models.CASCADE)
	caracteristica = models.ForeignKey(Caracteristica, on_delete=models.CASCADE)
	valor = models.CharField(max_length=255, blank=True, null=True)

	class Meta:
		unique_together = (('inmueble', 'caracteristica'),)

	def __str__(self):
		return f"{self.inmueble} - {self.caracteristica}: {self.valor}"


# Transactional and communication models
class Operacion(models.Model):
	TIPO_CHOICES = (
		('Venta', 'Venta'),
		('Alquiler', 'Alquiler'),
	)

	MONEDA_CHOICES = Inmueble.MONEDA_CHOICES

	inmueble = models.ForeignKey(Inmueble, null=True, blank=True, on_delete=models.SET_NULL, related_name='operaciones')
	usuario_vendedor = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, related_name='ventas')
	usuario_comprador = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, related_name='compras')
	tipo_operacion = models.CharField(max_length=10, choices=TIPO_CHOICES)
	fecha_operacion = models.DateField()
	monto_final = models.DecimalField(max_digits=18, decimal_places=2)
	moneda_cierre = models.CharField(max_length=3, choices=MONEDA_CHOICES, default='USD')
	notas = models.TextField(blank=True, null=True)

	def __str__(self):
		return f"Operacion {self.id} - {self.tipo_operacion} - {self.monto_final} {self.moneda_cierre}"


class Cita(models.Model):
	ESTATUS_CITA_CHOICES = (
		('Programada', 'Programada'),
		('Completada', 'Completada'),
		('Cancelada', 'Cancelada'),
	)

	inmueble = models.ForeignKey(Inmueble, null=True, blank=True, on_delete=models.SET_NULL, related_name='citas')
	usuario_interesado = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, related_name='citas_interesado')
	usuario_propietario = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL, related_name='citas_propietario')
	fecha_hora_cita = models.DateTimeField()
	estatus_cita = models.CharField(max_length=10, choices=ESTATUS_CITA_CHOICES, default='Programada')
	observaciones = models.TextField(blank=True, null=True)

	def __str__(self):
		return f"Cita {self.id} - {self.inmueble} - {self.fecha_hora_cita}"


class Conversacion(models.Model):
	inmueble = models.ForeignKey(Inmueble, on_delete=models.CASCADE, related_name='conversaciones')
	usuario_interesado = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='conversaciones_interesado')
	usuario_vendedor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='conversaciones_vendedor')
	fecha_creacion = models.DateTimeField(auto_now_add=True)

	class Meta:
		constraints = [
			models.UniqueConstraint(fields=['inmueble', 'usuario_interesado', 'usuario_vendedor'], name='unique_conversacion_por_inmueble_y_usuarios')
		]

	def __str__(self):
		return f"Conv {self.id} - {self.inmueble} ({self.usuario_interesado} <> {self.usuario_vendedor})"


class Mensaje(models.Model):
	conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='mensajes')
	usuario_emisor = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='mensajes_enviados')
	contenido_mensaje = models.TextField()
	fecha_envio = models.DateTimeField(auto_now_add=True)
	leido = models.BooleanField(default=False)

	def __str__(self):
		return f"Mensaje {self.id} - {self.usuario_emisor} - {self.fecha_envio}"

