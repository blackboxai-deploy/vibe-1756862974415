import { Globe, Smartphone, TrendingUp, Users, MessageCircle, BarChart3, Database, ShoppingCart } from 'lucide-react';

const mockData = {
  services: [
    {
      title: "Desarrollo Web",
      description: "Páginas web modernas, responsivas y optimizadas para conversiones",
      icon: <Globe className="w-6 h-6 text-emerald-400" />,
      features: [
        "Diseño responsive",
        "Optimización SEO",
        "Carga ultrarrápida",
        "Panel de administración",
        "Hosting incluido 1 año"
      ],
      price: "Desde $800"
    },
    {
      title: "E-commerce",
      description: "Tiendas online completas con pasarelas de pago integradas",
      icon: <Smartphone className="w-6 h-6 text-emerald-400" />,
      features: [
        "Carrito de compras",
        "Pasarelas de pago",
        "Gestión de inventario",
        "Sistema de envíos",
        "Analytics incluidos"
      ],
      price: "Desde $1,500"
    },
    {
      title: "Sistemas de Ventas y BD",
      description: "CRM personalizado, bases de datos y sistemas de gestión empresarial",
      icon: <Database className="w-6 h-6 text-emerald-400" />,
      features: [
        "CRM personalizado",
        "Base de datos optimizada",
        "Sistema de facturación",
        "Gestión de inventario",
        "Reportes automatizados",
        "Integración API"
      ],
      price: "Desde $2,200"
    },
    {
      title: "Marketing Digital",
      description: "Estrategias completas para aumentar tu visibilidad online",
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      features: [
        "Campañas en Google Ads",
        "Publicidad en redes sociales",
        "Email marketing",
        "SEO avanzado",
        "Reportes mensuales"
      ],
      price: "Desde $600/mes"
    },
    {
      title: "Social Media",
      description: "Gestión profesional de tus redes sociales",
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      features: [
        "Contenido diario",
        "Diseño gráfico",
        "Interacción con seguidores",
        "Stories y reels",
        "Análisis de métricas"
      ],
      price: "Desde $400/mes"
    },
    {
      title: "Community Management",
      description: "Construcción y gestión de comunidades online",
      icon: <MessageCircle className="w-6 h-6 text-emerald-400" />,
      features: [
        "Atención al cliente",
        "Moderación de comentarios",
        "Creación de eventos",
        "Engagement strategies",
        "Reportes detallados"
      ],
      price: "Desde $350/mes"
    },
    {
      title: "Analytics & Reporting",
      description: "Análisis profundo del rendimiento de tu negocio digital",
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      features: [
        "Google Analytics setup",
        "Dashboards personalizados",
        "Reportes automatizados",
        "KPIs específicos",
        "Recomendaciones estratégicas"
      ],
      price: "Desde $200/mes"
    }
  ],
  
  // Mock form submission data
  formSubmissions: [],
  
  // Mock user data for login
  users: [
    {
      email: "admin@lsweb.com",
      password: "admin123",
      role: "admin"
    }
  ]
};

export default mockData;