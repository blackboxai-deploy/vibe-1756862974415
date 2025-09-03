# 🚀 LS WEB con Supabase - Base de Datos en la Nube

## 🌟 **¿Por qué Supabase?**

✅ **Completamente GRATIS** (hasta 50,000 filas por mes)  
✅ **Acceso desde cualquier lugar** - No necesita instalación local  
✅ **PostgreSQL completo** - Base de datos profesional  
✅ **Dashboard web** - Ver y editar datos fácilmente  
✅ **API REST automática** - Se genera sola  
✅ **Autenticación incluida** - Sistema de usuarios integrado  
✅ **Backups automáticos** - Tus datos están seguros  

## 🔧 **Configuración de Supabase (5 minutos)**

### **1. Crear Cuenta en Supabase:**
1. Ve a: https://supabase.com
2. Clic en "Start your project" 
3. Crea cuenta con Gmail/GitHub
4. **¡Es GRATIS!**

### **2. Crear Nuevo Proyecto:**
1. Clic en "New Project"
2. Nombre: `lsweb-database`
3. Password de BD: `elige_una_segura123`
4. Región: `South America` (más cerca de Argentina)
5. Clic "Create new project"
6. **Esperar 2-3 minutos** a que se configure

### **3. Obtener Credenciales:**
1. En tu proyecto, ir a **Settings** → **API**
2. Copiar estos valores:

```
Project URL: https://abcdefgh.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **4. Crear Tablas en Supabase:**

**Ir a SQL Editor y ejecutar:**

```sql
-- Tabla para solicitudes de contacto
CREATE TABLE contact_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(100),
  project_type VARCHAR(50) NOT NULL,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor performance
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

-- Insertar usuario admin por defecto
INSERT INTO users (email, password_hash, role) VALUES (
  'admin@lsweb.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRuIwmH.LhqV1u6', -- password: admin123
  'admin'
);
```

## 📝 **Configurar el Backend**

### **1. Actualizar `.env`:**
```env
# JWT Configuration
JWT_SECRET=ls-web-super-secret-key-change-this-in-production-2025

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=alexisromeroezequiel139@gmail.com
SMTP_PASSWORD=tu_gmail_app_password
EMAIL_TO=alexisromeroezequiel139@gmail.com

# Supabase Configuration (REEMPLAZAR con tus valores reales)
SUPABASE_URL=https://abcdefgh.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tu_anon_key_aqui
```

### **2. Instalar Nueva Dependencia:**
```bash
pip install httpx
```

### **3. Usar el Nuevo Server:**
```bash
# En lugar de server.py, usar:
uvicorn server_supabase:app --host 0.0.0.0 --port 8001 --reload
```

## 🌐 **URLs y Acceso**

### **Dashboard de Supabase:**
- **Ver datos**: https://app.supabase.com/project/tu-proyecto/editor
- **Métricas**: https://app.supabase.com/project/tu-proyecto/reports
- **SQL Editor**: https://app.supabase.com/project/tu-proyecto/sql

### **Tu App:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **Docs**: http://localhost:8001/docs

## 👀 **Ver Datos en Tiempo Real**

### **1. Dashboard Web de Supabase:**
1. Ve a tu proyecto en https://app.supabase.com
2. Clic en "Table Editor" 
3. Selecciona tabla `contact_requests`
4. **¡Verás todas las solicitudes en tiempo real!**

### **2. Funciones del Dashboard:**
- ✅ **Ver todas las solicitudes** con filtros
- ✅ **Editar datos** directamente 
- ✅ **Exportar a CSV/Excel**
- ✅ **Buscar por nombre, email, etc.**
- ✅ **Cambiar status** (pending → contacted → completed)
- ✅ **Ver métricas** y gráficos

## 🔄 **Migrar de MongoDB a Supabase**

### **Si ya tienes datos en MongoDB:**

1. **Exportar de MongoDB:**
```bash
mongoexport --db lsweb_db --collection contact_requests --out solicitudes.json
```

2. **Importar a Supabase:**
- Ve a Table Editor → contact_requests
- Clic en "Insert" → "Import data"  
- Subir archivo JSON
- Mapear campos automáticamente

## 📊 **Ventajas vs MongoDB Local**

| Característica | MongoDB Local | Supabase |
|---|---|---|
| **Instalación** | ❌ Compleja | ✅ Sin instalación |
| **Acceso remoto** | ❌ Solo local | ✅ Desde cualquier lugar |
| **Dashboard visual** | ❌ Requiere MongoDB Compass | ✅ Dashboard web incluido |
| **Backups** | ❌ Manual | ✅ Automáticos |
| **Escalabilidad** | ❌ Manual | ✅ Automática |
| **Costo** | ❌ Servidor propio | ✅ Gratis hasta 50k filas |
| **Mantenimiento** | ❌ Tu responsabilidad | ✅ Cero mantenimiento |

## 🚀 **Deployment en Producción**

### **Opciones Gratuitas para Deploy:**

1. **Vercel (Frontend) + Railway (Backend):**
   - Frontend: https://vercel.com (gratis)
   - Backend: https://railway.app (gratis $5/mes crédito)

2. **Netlify + Render:**
   - Frontend: https://netlify.com (gratis)  
   - Backend: https://render.com (gratis)

3. **GitHub Pages + Heroku:**
   - Frontend: GitHub Pages (gratis)
   - Backend: Heroku (gratis con limitaciones)

## 🔐 **Seguridad**

### **Row Level Security (RLS) - Opcional pero recomendado:**

```sql
-- Habilitar RLS para contact_requests
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Solo lectura pública para datos no sensibles
CREATE POLICY "Public read access" ON contact_requests
  FOR SELECT TO anon
  USING (true);

-- Solo admins pueden insertar
CREATE POLICY "Admin insert access" ON contact_requests  
  FOR INSERT TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');
```

## 📞 **Soporte y Ayuda**

- **Documentación**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com  
- **Ejemplos**: https://github.com/supabase/supabase/tree/master/examples

## 🎉 **¡Ya está listo!**

Con Supabase tienes:
- ✅ **Base de datos en la nube** accesible 24/7
- ✅ **Dashboard web** para gestionar solicitudes
- ✅ **API REST automática** sin configuración  
- ✅ **Backups automáticos** de tus datos
- ✅ **Escalabilidad** automática según crezca tu negocio
- ✅ **Costo $0** hasta que tengas muchos clientes

**¡Ahora LS WEB funcionará desde cualquier lugar del mundo sin instalaciones complicadas!** 🌍✨