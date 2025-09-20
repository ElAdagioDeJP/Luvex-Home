Guía rápida: recibir inicio con Google y crear/actualizar usuario en Django

Objetivo

Permitir que el frontend (NextAuth) use Google Sign-In y que el backend Django valide el token de Google y cree/sincronice un usuario.

Flujo recomendado

1. El usuario hace sign-in en el frontend con NextAuth (Google Provider).
2. NextAuth crea una sesión y puede devolver un id_token o access_token (según configuración).
3. El frontend envía el id_token al backend Django en /api/auth/google/ (POST) para validar y crear usuario.

Ejemplo de vista en Django (views.py)

```python
# backend/api/views.py
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from google.oauth2 import id_token
from google.auth.transport import requests

User = get_user_model()

@csrf_exempt
def google_auth(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    data = json.loads(request.body)
    token = data.get('id_token') or data.get('token')
    if not token:
        return JsonResponse({'error': 'No token provided'}, status=400)

    try:
        # Verifica token de Google
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), audience=None)
        # idinfo contiene 'sub', 'email', 'name', 'picture', etc.
        email = idinfo.get('email')
        name = idinfo.get('name', '')
        sub = idinfo.get('sub')

        user, created = User.objects.get_or_create(email=email, defaults={
            'username': email.split('@')[0],
            'first_name': name.split(' ')[0] if name else '',
            'last_name': ' '.join(name.split(' ')[1:]) if name else '',
        })

        # Aquí podrías guardar `sub` en un campo de perfil para linkear cuentas

        return JsonResponse({'ok': True, 'email': email, 'created': created})
    except ValueError:
        return JsonResponse({'error': 'Invalid token'}, status=400)
```

Dependencias Python recomendadas

pip install google-auth

Notas

- Si usas NextAuth y quieres delegar todo al backend, puedes configurar callbacks en NextAuth para llamar a tu endpoint Django cuando un usuario inicia sesión.
- Asegúrate de que las URIs de redirección en Google Cloud Console incluyan: http://localhost:3000/api/auth/callback/google
- Protege tus endpoints y maneja la creación/actualización de perfiles con cuidado (no sobrescribas datos sensibles sin confirmación).
