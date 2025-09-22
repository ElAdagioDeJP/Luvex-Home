from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
    # Authentication endpoints
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/google/', views.google_auth, name='google-auth'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Property endpoints
    path('casas/', views.casas_publicas, name='casas-list'),
    path('inmuebles/search/', views.InmuebleViewSet.as_view({'get': 'search'}), name='inmuebles-search'),
    path('inmuebles/<int:pk>/schedule-visit/', views.InmuebleViewSet.as_view({'post': 'schedule_visit'}), name='schedule-visit'),
]
