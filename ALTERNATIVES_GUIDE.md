# 🗂️ Alternativas de Base de Datos para LS WEB

## 🥇 **Opción 1: Supabase (RECOMENDADA)**

### **✅ Ventajas:**
- **Gratis** hasta 50,000 filas/mes
- **PostgreSQL completo** - Base de datos profesional
- **Dashboard web** integrado
- **API REST automática**
- **Autenticación incluida**
- **Backups automáticos**

### **📋 Setup rápido:**
1. Cuenta en https://supabase.com
2. Crear proyecto (2 min)
3. Ejecutar SQL para crear tablas
4. Copiar URL y Key al `.env`

---

## 🥈 **Opción 2: Firebase Firestore**

### **✅ Ventajas:**
- **Gratis** hasta 50k lecturas/día
- **Google Cloud** - Súper confiable
- **Tiempo real** - Cambios instantáneos
- **SDK oficial** para JavaScript/Python

### **📝 Configuración:**

**1. Crear proyecto:**
- Ve a https://console.firebase.google.com
- "Crear proyecto" → Elegir nombre
- Habilitar Firestore Database

**2. Obtener credenciales:**
- Configuración → Cuentas de servicio
- Generar nueva clave privada (JSON)
- Descargar archivo

**3. Código para server_firebase.py:**
```python
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Guardar solicitud
def save_contact_request(data):
    doc_ref = db.collection('contact_requests').document()
    doc_ref.set(data)
    return doc_ref.id
```

---

## 🥉 **Opción 3: Airtable (MUY SIMPLE)**

### **✅ Ventajas:**
- **Interface visual** como Excel
- **Súper fácil de usar**
- **API REST incluida**
- **Gratis** hasta 1,200 filas

### **📝 Configuración:**

**1. Crear base:**
- Ve a https://airtable.com
- "Create a base" → Elegir template vacío
- Crear tabla "Contact Requests"

**2. Campos de la tabla:**
```
Name (Single line text)
Email (Email)  
Phone (Phone number)
Company (Single line text)
Project Type (Single select)
Budget (Single select)
Timeline (Single select)  
Description (Long text)
Status (Single select: Pending, Contacted, Completed)
Created At (Created time)
```

**3. Código para server_airtable.py:**
```python
import httpx

AIRTABLE_BASE_ID = "appXXXXXXXXXXXXXX"
AIRTABLE_API_KEY = "keyXXXXXXXXXXXXXX"

async def save_to_airtable(data):
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/Contact%20Requests"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"fields": data}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, headers=headers)
        return response.status_code == 200
```

---

## 🥉 **Opción 4: Google Sheets (ULTRA SIMPLE)**

### **✅ Ventajas:**
- **Gratis total**
- **Interface familiar** (como Excel)
- **Colaboración** en tiempo real
- **Cero configuración** técnica

### **📝 Configuración:**

**1. Crear Google Sheet:**
- Ve a https://sheets.google.com
- Crear nueva hoja: "LS WEB Solicitudes"
- Headers: A1=Name, B1=Email, C1=Phone, etc.

**2. Habilitar API:**
- Ve a https://console.developers.google.com
- Crear proyecto → Habilitar Google Sheets API
- Crear credenciales (Service Account)
- Descargar JSON

**3. Código para server_sheets.py:**
```python
import gspread
from google.oauth2.service_account import Credentials

# Configurar credenciales
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']
creds = Credentials.from_service_account_file('credentials.json', scopes=scope)
client = gspread.authorize(creds)

# Abrir sheet
sheet = client.open("LS WEB Solicitudes").sheet1

# Agregar fila
def add_contact_request(data):
    row = [data['name'], data['email'], data['phone'], 
           data['company'], data['project_type'], 
           data['budget'], data['timeline'], data['description']]
    sheet.append_row(row)
```

---

## 🥉 **Opción 5: Railway PostgreSQL**

### **✅ Ventajas:**
- **PostgreSQL completo**
- **$5/mes crédito gratis**
- **Deploy automático** desde GitHub
- **Variables de entorno** integradas

### **📝 Configuración:**

**1. Crear cuenta:**
- Ve a https://railway.app
- Conectar con GitHub
- "New Project" → "Provision PostgreSQL"

**2. Obtener URL:**
- Ve a tu database → Connect
- Copiar `DATABASE_URL`

**3. Usar con SQLAlchemy:**
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

---

## 🥉 **Opción 6: PlanetScale (MySQL)**

### **✅ Ventajas:**
- **MySQL serverless**
- **Branching** como Git
- **Gratis** hasta 1GB
- **Performance** excepcional

### **📝 Setup:**
1. Cuenta en https://planetscale.com
2. Crear database
3. Obtener connection string
4. Usar con MySQL connector

---

## 📊 **Comparación Rápida**

| Opción | Gratis | Facilidad | Potencia | Dashboard | Recomendado Para |
|---|---|---|---|---|---|
| **Supabase** | ✅ 50k filas | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Excelente | **Proyectos serios** |
| **Firebase** | ✅ 50k ops | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Bueno | Apps con tiempo real |
| **Airtable** | ✅ 1.2k filas | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ Perfecto | No-code, simplicidad |
| **Google Sheets** | ✅ Ilimitado | ⭐⭐⭐⭐⭐ | ⭐ | ✅ Familiar | Pruebas rápidas |
| **Railway** | ✅ $5 crédito | ⭐⭐ | ⭐⭐⭐⭐⭐ | ❌ Terminal | Desarrolladores |
| **PlanetScale** | ✅ 1GB | ⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ Bueno | Apps MySQL |

## 🎯 **Recomendación Final**

### **Para LS WEB, te recomiendo en este orden:**

1. **🥇 Supabase** - La mejor opción completa
   - Dashboard profesional
   - PostgreSQL robusto  
   - API automática
   - Perfecto para crecer

2. **🥈 Airtable** - Si quieres algo súper simple
   - Interface visual perfecta
   - No requiere conocimientos técnicos
   - Ideal para gestionar solicitudes manualmente

3. **🥉 Google Sheets** - Para empezar YA
   - Cero configuración
   - Familiar para todos
   - Perfecto para validar la idea

### **🚀 Mi sugerencia: Empieza con Supabase**
Es gratis, profesional, y te permitirá crecer sin cambiar nada después. ¡En 5 minutos tienes todo funcionando!

¿Cuál prefieres implementar? 🤔