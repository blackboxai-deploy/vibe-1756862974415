from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, validator
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import smtplib
import email.mime.text
import email.mime.multipart
import jwt
import bcrypt
from jinja2 import Template

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-this')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Email Configuration
SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', '587'))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
EMAIL_TO = os.environ.get('EMAIL_TO', 'alexisromeroezequiel139@gmail.com')

# Models
class ContactRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    company: Optional[str] = Field(None, max_length=100)
    projectType: str = Field(..., min_length=1)
    budget: Optional[str] = None
    timeline: Optional[str] = None
    description: str = Field(..., min_length=10, max_length=2000)

    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('description')
    def validate_description(cls, v):
        if not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()

class ContactRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str]
    company: Optional[str]
    project_type: str
    budget: Optional[str]
    timeline: Optional[str]
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = Field(default="pending")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None

class ContactRequestResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None
    details: Optional[str] = None

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    role: str = Field(default="admin")
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Email Templates
EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nueva Solicitud de Web - LS WEB</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #2563eb; }
        .value { margin-left: 10px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 LS WEB - Nueva Solicitud</h1>
            <p>Has recibido una nueva solicitud de web personalizada</p>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">👤 Nombre:</span>
                <span class="value">{{ name }}</span>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <span class="value">{{ email }}</span>
            </div>
            {% if phone %}
            <div class="field">
                <span class="label">📱 Teléfono:</span>
                <span class="value">{{ phone }}</span>
            </div>
            {% endif %}
            {% if company %}
            <div class="field">
                <span class="label">🏢 Empresa:</span>
                <span class="value">{{ company }}</span>
            </div>
            {% endif %}
            <div class="field">
                <span class="label">🎯 Tipo de Proyecto:</span>
                <span class="value">
                    {% if project_type == 'web-corporativa' %}Web Corporativa
                    {% elif project_type == 'e-commerce' %}E-commerce
                    {% elif project_type == 'sistema-ventas-bd' %}Sistema de Ventas y Base de Datos
                    {% elif project_type == 'crm-personalizado' %}CRM Personalizado
                    {% elif project_type == 'landing-page' %}Landing Page
                    {% elif project_type == 'blog' %}Blog/Portfolio
                    {% elif project_type == 'app-web' %}Aplicación Web
                    {% elif project_type == 'marketing-digital' %}Marketing Digital
                    {% elif project_type == 'community-management' %}Community Management
                    {% else %}{{ project_type }}
                    {% endif %}
                </span>
            </div>
            {% if budget %}
            <div class="field">
                <span class="label">💰 Presupuesto:</span>
                <span class="value">{{ budget }}</span>
            </div>
            {% endif %}
            {% if timeline %}
            <div class="field">
                <span class="label">⏰ Tiempo de Entrega:</span>
                <span class="value">{{ timeline }}</span>
            </div>
            {% endif %}
            <div class="field">
                <span class="label">📝 Descripción del Proyecto:</span>
                <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 10px;">
                    {{ description }}
                </div>
            </div>
        </div>
        <div class="footer">
            <p><strong>LS WEB</strong> - Creando experiencias digitales excepcionales</p>
            <p>Fecha: {{ created_at.strftime('%d/%m/%Y %H:%M') }}</p>
        </div>
    </div>
</body>
</html>
"""

# Utility Functions
def create_jwt_token(user_email: str, user_role: str) -> str:
    payload = {
        "email": user_email,
        "role": user_role,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

async def send_email(contact_data: dict) -> bool:
    try:
        # Create message
        msg = email.mime.multipart.MimeMultipart('alternative')
        msg['Subject'] = f"Nueva Solicitud de Web - {contact_data['name']}"
        msg['From'] = SMTP_USER
        msg['To'] = EMAIL_TO

        # Render HTML template
        template = Template(EMAIL_TEMPLATE)
        html_content = template.render(**contact_data)
        
        # Create HTML part
        html_part = email.mime.text.MimeText(html_content, 'html')
        msg.attach(html_part)

        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    except Exception as e:
        logging.error(f"Email sending failed: {str(e)}")
        return False

# API Routes
@api_router.get("/")
async def root():
    return {"message": "LS WEB API - Ready"}

@api_router.post("/contact-request", response_model=ContactRequestResponse)
async def create_contact_request(contact_data: ContactRequestCreate):
    try:
        # Create contact request object
        contact_dict = contact_data.dict()
        contact_dict['project_type'] = contact_dict.pop('projectType')  # Map frontend field name
        
        contact_obj = ContactRequest(**contact_dict)
        
        # Save to database
        await db.contact_requests.insert_one(contact_obj.dict())
        
        # Send email
        email_data = contact_obj.dict()
        email_sent = await send_email(email_data)
        
        if not email_sent:
            logging.warning(f"Email failed to send for request {contact_obj.id}")
            # Still return success since the request was saved
        
        return ContactRequestResponse(
            success=True,
            message="Solicitud enviada exitosamente. Te contactaremos pronto.",
            id=contact_obj.id
        )
        
    except Exception as e:
        logging.error(f"Contact request creation failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

@api_router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    try:
        # Find user in database
        user_doc = await db.users.find_one({"email": login_data.email})
        
        if not user_doc:
            return LoginResponse(
                success=False,
                message="Credenciales inválidas"
            )
        
        # Verify password
        if not verify_password(login_data.password, user_doc['password_hash']):
            return LoginResponse(
                success=False,
                message="Credenciales inválidas"
            )
        
        # Create JWT token
        token = create_jwt_token(user_doc['email'], user_doc['role'])
        
        return LoginResponse(
            success=True,
            message="Login exitoso",
            token=token,
            user={
                "email": user_doc['email'],
                "role": user_doc['role']
            }
        )
        
    except Exception as e:
        logging.error(f"Login failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

@api_router.get("/contact-requests", response_model=List[ContactRequest])
async def get_contact_requests():
    try:
        requests = await db.contact_requests.find().sort("created_at", -1).to_list(100)
        return [ContactRequest(**request) for request in requests]
    except Exception as e:
        logging.error(f"Failed to fetch contact requests: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

# Initialize default admin user
@api_router.post("/init-admin")
async def initialize_admin():
    try:
        # Check if admin already exists
        existing_admin = await db.users.find_one({"email": "admin@lsweb.com"})
        if existing_admin:
            return {"message": "Admin user already exists"}
        
        # Create default admin
        admin_user = User(
            email="admin@lsweb.com",
            password_hash=hash_password("admin123"),
            role="admin"
        )
        
        await db.users.insert_one(admin_user.dict())
        return {"message": "Admin user created successfully"}
        
    except Exception as e:
        logging.error(f"Admin initialization failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno del servidor"
        )

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("LS WEB API Starting up...")
    # Initialize admin user on startup
    try:
        existing_admin = await db.users.find_one({"email": "admin@lsweb.com"})
        if not existing_admin:
            admin_user = User(
                email="admin@lsweb.com",
                password_hash=hash_password("admin123"),
                role="admin"
            )
            await db.users.insert_one(admin_user.dict())
            logger.info("Default admin user created")
    except Exception as e:
        logger.error(f"Failed to initialize admin: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()