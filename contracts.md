# Contratos de API - LS WEB

## 1. API Endpoints

### POST /api/contact-request
**Descripción**: Envía solicitud de web personalizada por email
**URL**: `${BACKEND_URL}/api/contact-request`

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, email format)",
  "phone": "string (optional)",
  "company": "string (optional)",
  "projectType": "string (required)",
  "budget": "string (optional)",
  "timeline": "string (optional)",
  "description": "string (required)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Solicitud enviada exitosamente",
  "id": "uuid"
}
```

**Response Error (400/500)**:
```json
{
  "success": false,
  "message": "Error message",
  "details": "Detailed error info"
}
```

### POST /api/login
**Descripción**: Autenticación de usuarios
**URL**: `${BACKEND_URL}/api/login`

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "jwt_token",
  "user": {
    "email": "string",
    "role": "string"
  }
}
```

## 2. Datos Mock a Reemplazar

### Frontend Mock Data (src/data/mock.js):
- `formSubmissions[]`: Será reemplazado por llamadas API reales
- `users[]`: Será manejado por backend con autenticación real

### Mock Behavior to Replace:
- `handleSubmit` en HomePage.js: Reemplazar setTimeout con llamada API real
- `handleSubmit` en LoginPage.js: Reemplazar setTimeout con llamada API real

## 3. Backend Implementation

### Servicios Necesarios:
1. **Email Service**: Envío de emails usando SMTP
2. **Auth Service**: Autenticación con JWT
3. **Validation Service**: Validación de datos de entrada
4. **Database Models**: Modelos para guardar solicitudes

### Email Configuration:
- **Destinatario**: alexisromeroezequiel139@gmail.com
- **Asunto**: "Nueva Solicitud de Web - LS WEB"
- **Template**: HTML formateado con todos los datos del formulario

### Database Models:
```python
class ContactRequest(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    company: Optional[str]
    project_type: str
    budget: Optional[str]
    timeline: Optional[str]
    description: str
    created_at: datetime
    status: str  # "pending", "contacted", "completed"

class User(BaseModel):
    id: str
    email: str
    password_hash: str
    role: str
    created_at: datetime
```

## 4. Frontend-Backend Integration

### Cambios en HomePage.js:
1. Reemplazar mock handleSubmit con llamada API real
2. Agregar loading states
3. Manejo de errores de red
4. Toast notifications mejoradas

### Cambios en LoginPage.js:
1. Reemplazar mock login con API real
2. Guardar JWT token en localStorage
3. Redirección basada en autenticación exitosa
4. Manejo de errores de autenticación

### Environment Variables Necesarias:
```env
# Backend .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_TO=alexisromeroezequiel139@gmail.com
JWT_SECRET=your_jwt_secret_key
```

## 5. Testing Protocol

### Backend Testing:
1. Test envío de emails
2. Test validación de datos
3. Test autenticación
4. Test endpoints con datos inválidos

### Frontend Integration Testing:
1. Test formulario con backend real
2. Test manejo de errores
3. Test loading states
4. Test autenticación flow

## 6. Security Considerations

1. Validación de datos en backend
2. Rate limiting para endpoints
3. CORS configurado correctamente
4. JWT token expiration
5. Hash de passwords con bcrypt