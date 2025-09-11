# ICA Bienes Raíces - Sistema de Gestión Inmobiliaria

Sistema completo de gestión inmobiliaria desarrollado con Django REST Framework (backend) y Next.js (frontend), con integración de inteligencia artificial para asistencia en la búsqueda de propiedades.

## 🚀 Características

- **Backend Django REST Framework**: API robusta con autenticación JWT
- **Frontend Next.js**: Interfaz moderna y responsive
- **Base de datos MySQL**: Almacenamiento de datos inmobiliarios
- **Autenticación completa**: Registro, login y gestión de usuarios
- **Búsqueda avanzada**: Filtros por ubicación, precio, características
- **Asistente IA**: Ayuda inteligente para encontrar propiedades
- **Gestión de citas**: Programación de visitas a propiedades
- **Sistema de roles**: Cliente, Agente, Administrador

## 📋 Requisitos Previos

- Python 3.8+
- Node.js 16+
- MySQL 8.0+
- Git

## 🛠️ Instalación

### Opción 1: Script Automático (Windows)

```powershell
# Ejecutar el script de inicio
.\start_project.ps1
```

### Opción 2: Instalación Manual

#### Backend (Django)

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env con:
DB_NAME=ica_bienes_raices
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_HOST=localhost
DB_PORT=3306
SECRET_KEY=tu-secret-key-aqui
DEBUG=True

# Ejecutar migraciones
python manage.py migrate

# Inicializar datos básicos
python manage.py init_data

# Iniciar servidor
python manage.py runserver
```

#### Frontend (Next.js)

```bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Iniciar servidor de desarrollo
npm run dev
```

## 🗄️ Estructura de la Base de Datos

### Modelos Principales

- **Usuario**: Gestión de usuarios con roles
- **Inmueble**: Propiedades inmobiliarias
- **Estado/Ciudad/Municipio**: Ubicaciones geográficas
- **TipoInmueble**: Tipos de propiedades (casa, apartamento, etc.)
- **Caracteristica**: Características de las propiedades
- **Cita**: Programación de visitas
- **Operacion**: Transacciones inmobiliarias
- **Conversacion/Mensaje**: Sistema de mensajería

## 🔗 Endpoints de la API

### Autenticación
- `POST /api/auth/register/` - Registro de usuarios
- `POST /api/auth/login/` - Inicio de sesión
- `POST /api/auth/token/` - Obtener token JWT
- `POST /api/auth/token/refresh/` - Renovar token

### Propiedades
- `GET /api/casas/` - Lista de propiedades (formato simplificado)
- `GET /api/inmuebles/` - Lista completa de inmuebles
- `GET /api/inmuebles/search/` - Búsqueda avanzada
- `POST /api/inmuebles/{id}/schedule-visit/` - Programar visita

### Datos de Referencia
- `GET /api/estados/` - Lista de estados
- `GET /api/ciudades/` - Lista de ciudades
- `GET /api/municipios/` - Lista de municipios
- `GET /api/tipos-inmueble/` - Tipos de inmuebles
- `GET /api/caracteristicas/` - Características disponibles

## 🎯 Uso del Sistema

### Usuario Administrador
- **Email**: admin@ica.com
- **Contraseña**: admin123

### Funcionalidades Principales

1. **Búsqueda de Propiedades**: Filtra por ubicación, precio, habitaciones, etc.
2. **Registro de Usuarios**: Sistema completo de registro y autenticación
3. **Programación de Visitas**: Los usuarios pueden programar citas
4. **Gestión de Propiedades**: CRUD completo de inmuebles
5. **Sistema de Roles**: Diferentes permisos según el tipo de usuario

## 🧪 Testing

```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm run test
```

## 📦 Despliegue

### Backend (Producción)

```bash
# Instalar dependencias de producción
pip install gunicorn

# Configurar variables de entorno de producción
# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic

# Iniciar con Gunicorn
gunicorn config.wsgi:application
```

### Frontend (Producción)

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o consultas, contacta a:
- Email: soporte@ica.com
- Teléfono: +58 241-1234567

## 🏗️ Arquitectura

```
├── backend/                 # API Django REST Framework
│   ├── api/                # Aplicación principal
│   │   ├── models.py       # Modelos de datos
│   │   ├── views.py        # Vistas de la API
│   │   ├── serializers.py  # Serializadores
│   │   └── urls.py         # Rutas de la API
│   ├── config/             # Configuración Django
│   └── manage.py           # Script de gestión
├── frontend/               # Aplicación Next.js
│   ├── app/                # Páginas y rutas
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y servicios
│   └── public/             # Archivos estáticos
└── README.md              # Este archivo
```

## 🔄 Flujo de Trabajo

1. **Usuario se registra** → Se crea cuenta en el sistema
2. **Usuario busca propiedades** → API filtra según criterios
3. **Usuario programa visita** → Se crea cita en el sistema
4. **Agente gestiona propiedades** → CRUD de inmuebles
5. **Administrador supervisa** → Gestión completa del sistema

---

**Desarrollado con ❤️ para ICA Bienes Raíces**
