import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/use-toast';
import { Globe, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API}/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        // Store JWT token
        if (response.data.token) {
          localStorage.setItem('lsweb_token', response.data.token);
          localStorage.setItem('lsweb_user', JSON.stringify(response.data.user));
        }
        
        toast({
          title: "¡Inicio de sesión exitoso!",
          description: `Bienvenido ${response.data.user?.email || 'Usuario'}`,
        });
        
        // Redirect to home or dashboard
        setTimeout(() => {
          navigate('/');
        }, 1000);
        
      } else {
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(e => e.msg).join(', ');
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error de autenticación",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-600/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-emerald-800/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-500/5 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md mx-4">
        {/* Back to home button */}
        <Button
          variant="ghost"
          className="mb-6 text-emerald-400 hover:text-emerald-300"
          onClick={() => navigate('/')}
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>

        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                LS WEB
              </span>
            </span>
          </div>
          <h1 className="text-2xl font-semibold mb-2">Iniciar Sesión</h1>
          <p className="text-gray-400">Accede a tu panel de administración</p>
        </div>

        {/* Login form */}
        <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 disabled:opacity-50"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className="bg-gray-800 border-gray-600 text-white focus:border-emerald-500 pr-10 disabled:opacity-50"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 disabled:cursor-not-allowed"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-emerald-600 bg-gray-800 border-gray-600 rounded focus:ring-emerald-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm">
                ¿No tienes cuenta?{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300">
                  Contacta con nosotros
                </a>
              </p>
              
              {/* Development credentials info */}
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <p className="text-xs text-blue-300 text-center">
                  <strong>Credenciales de prueba:</strong><br />
                  Email: admin@lsweb.com<br />
                  Contraseña: admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Panel exclusivo para clientes y administradores
        </div>
      </div>
    </div>
  );
};

export default LoginPage;