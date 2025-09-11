# Script para iniciar el proyecto ICA Bienes Raíces
Write-Host "Iniciando proyecto ICA Bienes Raíces..." -ForegroundColor Green

# Verificar si Python está instalado
try {
    $pythonVersion = python --version
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Python no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Iniciar el backend Django
Write-Host "Iniciando backend Django..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path "venv") {
    Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
    & "venv\Scripts\Activate.ps1"
} else {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    python -m venv venv
    & "venv\Scripts\Activate.ps1"
    Write-Host "Instalando dependencias del backend..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Ejecutar migraciones
Write-Host "Ejecutando migraciones..." -ForegroundColor Yellow
python manage.py migrate

# Inicializar datos básicos
Write-Host "Inicializando datos básicos..." -ForegroundColor Yellow
python manage.py init_data

# Iniciar servidor Django en segundo plano
Write-Host "Iniciando servidor Django en puerto 8000..." -ForegroundColor Yellow
Start-Process -FilePath "python" -ArgumentList "manage.py", "runserver" -WindowStyle Minimized

# Esperar un momento para que Django se inicie
Start-Sleep -Seconds 3

# Iniciar el frontend Next.js
Write-Host "Iniciando frontend Next.js..." -ForegroundColor Yellow
Set-Location ..\frontend

# Instalar dependencias si es necesario
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias del frontend..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor Next.js
Write-Host "Iniciando servidor Next.js en puerto 3000..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal

Write-Host "¡Proyecto iniciado correctamente!" -ForegroundColor Green
Write-Host "Backend Django: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend Next.js: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API: http://localhost:8000/api" -ForegroundColor Cyan
