import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';
import { 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  BarChart3,
  Database,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import mockData from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/contact-request`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast({
          title: "¡Solicitud enviada exitosamente!",
          description: "Te contactaremos pronto para discutir tu proyecto.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          projectType: '',
          budget: '',
          timeline: '',
          description: ''
        });
      } else {
        throw new Error(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Error al enviar la solicitud. Por favor intenta nuevamente.';
      
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error al enviar solicitud",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll animation trigger
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .fade-in-element {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hero-glow {
          background: radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
        }
        
        .service-card {
          transition: all 0.3s ease;
        }
        
        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-sm border-b border-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">LS WEB</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="hover:text-emerald-400 transition-colors">Inicio</a>
              <a href="#servicios" className="hover:text-emerald-400 transition-colors">Servicios</a>
              <a href="#solicitar" className="hover:text-emerald-400 transition-colors">Solicitar Web</a>
              <a href="#contacto" className="hover:text-emerald-400 transition-colors">Contacto</a>
              <Button 
                variant="outline" 
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                onClick={() => window.location.href = '/login'}
              >
                Iniciar Sesión
              </Button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-emerald-900/20">
            <div className="px-4 py-4 space-y-4">
              <a href="#inicio" className="block hover:text-emerald-400 transition-colors">Inicio</a>
              <a href="#servicios" className="block hover:text-emerald-400 transition-colors">Servicios</a>
              <a href="#solicitar" className="block hover:text-emerald-400 transition-colors">Solicitar Web</a>
              <a href="#contacto" className="block hover:text-emerald-400 transition-colors">Contacto</a>
              <Button 
                variant="outline" 
                className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                onClick={() => window.location.href = '/login'}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center hero-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-element">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Creamos tu <span className="gradient-text">Presencia Digital</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Diseño web profesional, marketing digital y community management para impulsar tu negocio al siguiente nivel
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('solicitar').scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar Mi Web
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Servicios
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements animation */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-600/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-emerald-800/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-element text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestros <span className="gradient-text">Servicios</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Soluciones digitales completas para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockData.services.map((service, index) => (
              <Card key={index} className="service-card bg-gray-800/50 border-gray-700 hover:border-emerald-600/50">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <span className="text-2xl font-bold text-emerald-400">{service.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form Section */}
      <section id="solicitar" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-element text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Solicitar Mi Web Personalizada</span>
            </h2>
            <p className="text-xl text-gray-300">
              Cuéntanos sobre tu proyecto y te contactaremos con una propuesta personalizada
            </p>
          </div>

          <Card className="bg-gray-900/50 border-gray-700 fade-in-element">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre completo *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                      placeholder="+54 9 11 xxxx-xxxx"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Empresa/Negocio
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de proyecto *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      required
                      disabled={isSubmitting}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="web-corporativa">Web Corporativa</option>
                      <option value="e-commerce">E-commerce</option>
                      <option value="sistema-ventas-bd">Sistema de Ventas y Base de Datos</option>
                      <option value="crm-personalizado">CRM Personalizado</option>
                      <option value="landing-page">Landing Page</option>
                      <option value="blog">Blog/Portfolio</option>
                      <option value="app-web">Aplicación Web</option>
                      <option value="marketing-digital">Marketing Digital</option>
                      <option value="community-management">Community Management</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                      Presupuesto estimado
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                    >
                      <option value="">Seleccionar rango</option>
                      <option value="500-1000">$500 - $1,000 USD</option>
                      <option value="1000-2500">$1,000 - $2,500 USD</option>
                      <option value="2500-5000">$2,500 - $5,000 USD</option>
                      <option value="5000+">$5,000+ USD</option>
                      <option value="por-definir">Por definir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                    Tiempo de entrega deseado
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    <option value="">Seleccionar tiempo</option>
                    <option value="1-2-semanas">1-2 semanas</option>
                    <option value="3-4-semanas">3-4 semanas</option>
                    <option value="1-2-meses">1-2 meses</option>
                    <option value="2-3-meses">2-3 meses</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción del proyecto *
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                    placeholder="Describe tu proyecto: objetivos, funcionalidades necesarias, referencias, etc."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Solicitud
                      <Mail className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in-element">
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              <span className="gradient-text">Contacto</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-400">alexisromeroezequiel139@gmail.com</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
                <p className="text-gray-400">Disponible por WhatsApp</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ubicación</h3>
                <p className="text-gray-400">Servicios remotos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">LS WEB</span>
            </div>
            <p className="text-gray-400 mb-4">
              Creando experiencias digitales excepcionales
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 LS WEB. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;