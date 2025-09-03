import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Email configuration
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const EMAIL_TEMPLATE = `
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
                <span class="value">{{name}}</span>
            </div>
            <div class="field">
                <span class="label">📧 Email:</span>
                <span class="value">{{email}}</span>
            </div>
            {{#phone}}
            <div class="field">
                <span class="label">📱 Teléfono:</span>
                <span class="value">{{phone}}</span>
            </div>
            {{/phone}}
            {{#company}}
            <div class="field">
                <span class="label">🏢 Empresa:</span>
                <span class="value">{{company}}</span>
            </div>
            {{/company}}
            <div class="field">
                <span class="label">🎯 Tipo de Proyecto:</span>
                <span class="value">{{projectTypeLabel}}</span>
            </div>
            {{#budget}}
            <div class="field">
                <span class="label">💰 Presupuesto:</span>
                <span class="value">{{budget}}</span>
            </div>
            {{/budget}}
            {{#timeline}}
            <div class="field">
                <span class="label">⏰ Tiempo de Entrega:</span>
                <span class="value">{{timeline}}</span>
            </div>
            {{/timeline}}
            <div class="field">
                <span class="label">📝 Descripción del Proyecto:</span>
                <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 10px;">
                    {{description}}
                </div>
            </div>
        </div>
        <div class="footer">
            <p><strong>LS WEB</strong> - Creando experiencias digitales excepcionales</p>
            <p>Fecha: {{createdAt}}</p>
        </div>
    </div>
</body>
</html>
`;

const projectTypeLabels: { [key: string]: string } = {
  'web-corporativa': 'Web Corporativa',
  'e-commerce': 'E-commerce',
  'sistema-ventas-bd': 'Sistema de Ventas y Base de Datos',
  'crm-personalizado': 'CRM Personalizado',
  'landing-page': 'Landing Page',
  'blog': 'Blog/Portfolio',
  'app-web': 'Aplicación Web',
  'marketing-digital': 'Marketing Digital',
  'community-management': 'Community Management',
};

async function sendEmail(contactData: any) {
  try {
    const projectTypeLabel = projectTypeLabels[contactData.projectType] || contactData.projectType;
    
    let htmlContent = EMAIL_TEMPLATE
      .replace(/{{name}}/g, contactData.name)
      .replace(/{{email}}/g, contactData.email)
      .replace(/{{projectTypeLabel}}/g, projectTypeLabel)
      .replace(/{{description}}/g, contactData.description)
      .replace(/{{createdAt}}/g, new Date().toLocaleString('es-AR'));

    // Handle optional fields
    if (contactData.phone) {
      htmlContent = htmlContent.replace(/{{#phone}}(.*?){{\/phone}}/gs, '$1').replace(/{{phone}}/g, contactData.phone);
    } else {
      htmlContent = htmlContent.replace(/{{#phone}}.*?{{\/phone}}/gs, '');
    }

    if (contactData.company) {
      htmlContent = htmlContent.replace(/{{#company}}(.*?){{\/company}}/gs, '$1').replace(/{{company}}/g, contactData.company);
    } else {
      htmlContent = htmlContent.replace(/{{#company}}.*?{{\/company}}/gs, '');
    }

    if (contactData.budget) {
      htmlContent = htmlContent.replace(/{{#budget}}(.*?){{\/budget}}/gs, '$1').replace(/{{budget}}/g, contactData.budget);
    } else {
      htmlContent = htmlContent.replace(/{{#budget}}.*?{{\/budget}}/gs, '');
    }

    if (contactData.timeline) {
      htmlContent = htmlContent.replace(/{{#timeline}}(.*?){{\/timeline}}/gs, '$1').replace(/{{timeline}}/g, contactData.timeline);
    } else {
      htmlContent = htmlContent.replace(/{{#timeline}}.*?{{\/timeline}}/gs, '');
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.EMAIL_TO || process.env.SMTP_USER,
      subject: `Nueva Solicitud de Web - ${contactData.name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, projectType, budget, timeline, description } = body;

    // Validation
    if (!name || !email || !projectType || !description) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    // Create contact request object
    const contactRequest = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      company: company?.trim() || null,
      project_type: projectType,
      budget: budget || null,
      timeline: timeline || null,
      description: description.trim(),
      created_at: new Date().toISOString(),
      status: 'pending',
    };

    // Save to Supabase
    const { error: supabaseError } = await supabase
      .from('contact_requests')
      .insert([contactRequest]);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Continue anyway, just log the error
    }

    // Send email
    const emailSent = await sendEmail({
      ...body,
      createdAt: new Date().toLocaleString('es-AR')
    });

    if (!emailSent) {
      console.warn('Email failed to send');
      // Continue anyway
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada exitosamente. Te contactaremos pronto.',
      id: contactRequest.id,
    });

  } catch (error) {
    console.error('Contact request error:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}