from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'estados', views.EstadoViewSet)
router.register(r'ciudades', views.CiudadViewSet)
router.register(r'municipios', views.MunicipioViewSet)
router.register(r'roles', views.RolViewSet)
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'tipos-inmueble', views.TipoInmuebleViewSet)
router.register(r'caracteristicas', views.CaracteristicaViewSet)
router.register(r'inmuebles', views.InmuebleViewSet, basename='inmueble')
router.register(r'inmueble-caracteristicas', views.InmuebleCaracteristicaViewSet)
router.register(r'operaciones', views.OperacionViewSet)
router.register(r'citas', views.CitaViewSet)
router.register(r'conversaciones', views.ConversacionViewSet)
router.register(r'mensajes', views.MensajeViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # expose a friendly path /casas for the frontend to consume
    path('casas/', views.InmuebleViewSet.as_view({'get': 'casas'}), name='casas-list'),
]
