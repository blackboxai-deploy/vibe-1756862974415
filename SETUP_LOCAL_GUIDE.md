# 🚀 Guía para Ejecutar LS WEB en Visual Studio Code Local

## 📋 **Requisitos Previos**

### **1. Software Necesario:**
```bash
# Instalar Node.js (v18 o superior)
https://nodejs.org/

# Instalar Python (3.11 o superior) 
https://python.org/

# Instalar MongoDB (Opción 1 - Local)
https://mongodb.com/try/download/community

# O usar MongoDB Atlas (Opción 2 - Cloud)
https://mongodb.com/atlas
```

## 🗂️ **Estructura de Carpetas**

```
mi-proyecto-lsweb/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   ├── .env                    # ⚠️ CREAR ESTE ARCHIVO
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── .env                    # ⚠️ CREAR ESTE ARCHIVO
│   └── ...
└── README.md
```

## ⚙️ **Configuración del Backend (FastAPI)**

### **1. Crear entorno virtual de Python:**
```bash
# En la carpeta del proyecto
cd backend
python -m venv venv

# Activar entorno virtual:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

### **2. Instalar dependencias:**
```bash
pip install -r requirements.txt
```

### **3. Crear archivo `.env` en `/backend/.env`:**
```env
# Base de datos MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=lsweb_db

# JWT Configuration
JWT_SECRET=ls-web-super-secret-key-change-this-in-production-2025

# Email Configuration - Gmail SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alexisromeroezequiel139@gmail.com
SMTP_PASSWORD=tu_app_password_de_gmail
EMAIL_TO=alexisromeroezequiel139@gmail.com
```

### **4. Inicializar MongoDB:**

#### **Opción A: MongoDB Local**
```bash
# Iniciar MongoDB (debe estar instalado)
mongod --dbpath /ruta/a/tu/data/db

# O en Windows (como servicio):
net start MongoDB
```

#### **Opción B: MongoDB Atlas (Recomendado)**
1. Crear cuenta en https://mongodb.com/atlas
2. Crear cluster gratuito
3. Obtener connection string
4. Cambiar `MONGO_URL` en `.env`:
```env
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/lsweb_db?retryWrites=true&w=majority
```

### **5. Ejecutar el backend:**
```bash
# En la carpeta backend/ con entorno activado
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

## ⚙️ **Configuración del Frontend (React)**

### **1. Instalar dependencias:**
```bash
cd frontend
npm install
# o
yarn install
```

### **2. Crear archivo `.env` en `/frontend/.env`:**
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### **3. Ejecutar el frontend:**
```bash
# En la carpeta frontend/
npm start
# o
yarn start
```

## 🔧 **Scripts para package.json (Opcional)**

Agregar en `/frontend/package.json`:
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "dev": "react-scripts start",
    "backend": "cd ../backend && uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
  }
}
```

## 📧 **Configurar Gmail para Emails**

### **1. Habilitar 2FA en Gmail:**
- Ve a tu cuenta de Gmail
- Configuración → Seguridad → Verificación en 2 pasos

### **2. Generar App Password:**
1. Ve a: https://myaccount.google.com/apppasswords
2. Selecciona "Correo" y "Otro (nombre personalizado)"
3. Escribe "LS WEB"
4. **Copia la contraseña de 16 caracteres**
5. Úsala en `SMTP_PASSWORD` del `.env`

## 🚀 **Ejecución Completa**

### **Opción 1: Terminal Separados**
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate  # o venv\Scripts\activate en Windows
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Terminal 2 - Frontend  
cd frontend
npm start
```

### **Opción 2: Script Automatizado**

Crear `start.bat` (Windows) o `start.sh` (Mac/Linux):

**Windows (start.bat):**
```batch
@echo off
cd backend
call venv\Scripts\activate
start cmd /k "uvicorn server:app --host 0.0.0.0 --port 8001 --reload"
cd ../frontend
start cmd /k "npm start"
```

**Mac/Linux (start.sh):**
```bash
#!/bin/bash
cd backend
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
cd ../frontend
npm start &
```

## 🌐 **URLs de Acceso Local**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api/
- **Documentación:** http://localhost:8001/docs

## 🔍 **Verificar que Todo Funciona**

### **1. Test Backend:**
```bash
curl http://localhost:8001/api/
# Respuesta esperada: {"message":"LS WEB API - Ready"}
```

### **2. Test Frontend:**
- Abrir http://localhost:3000
- Llenar formulario "Solicitar Mi Web Personalizada"
- Verificar que llegue email a tu Gmail

### **3. Test Login:**
- Ir a http://localhost:3000/login
- Usuario: admin@lsweb.com
- Contraseña: admin123

## 🛠️ **Configuración de VS Code (Opcional)**

### **1. Extensiones Recomendadas:**
- Python
- JavaScript (ES6) code snippets
- Thunder Client (para probar APIs)
- MongoDB for VS Code
- Auto Rename Tag
- Bracket Pair Colorizer

### **2. Crear `launch.json` para debugging:**
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python: FastAPI",
            "type": "python",
            "request": "launch",
            "program": "uvicorn",
            "args": ["server:app", "--host", "0.0.0.0", "--port", "8001", "--reload"],
            "cwd": "${workspaceFolder}/backend",
            "console": "integratedTerminal"
        }
    ]
}
```

## 🐛 **Solución de Problemas Comunes**

### **Error: MongoDB no conecta**
```bash
# Verificar que MongoDB esté corriendo
mongo
# O si usas MongoDB Compass, conectar a localhost:27017
```

### **Error: Puerto ocupado**
```bash
# Cambiar puertos en .env files si hay conflicto
# Backend: puerto 8001 → 8002
# Frontend: puerto 3000 → 3001
```

### **Error: Módulos no encontrados**
```bash
# Backend
pip install -r requirements.txt

# Frontend  
npm install
```

### **Error: CORS**
El backend ya tiene CORS configurado, pero si hay problemas:
```python
# En server.py ya está configurado:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción cambiar por dominios específicos
    allow_methods=["*"],
    allow_headers=["*"]
)
```

## 🎉 **¡Listo!**

Con esta configuración tendrás **LS WEB** funcionando completamente en tu entorno local:
- ✅ FastAPI backend con todas las funciones
- ✅ React frontend con diseño completo
- ✅ Base de datos MongoDB
- ✅ Sistema de emails
- ✅ Autenticación JWT
- ✅ Todos los servicios (incluyendo Sistemas de Ventas y BD)

**¡Ahora puedes desarrollar y personalizar LS WEB desde tu propia máquina!** 🚀