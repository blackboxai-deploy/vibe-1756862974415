'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { LogOut, RefreshCw, Users, Mail, Clock, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget?: string;
  timeline?: string;
  description: string;
  created_at: string;
  status: string;
}

const projectTypeLabels: { [key: string]: string } = {
  'web-corporativa': 'Web Corporativa',
  'e-commerce': 'E-commerce',
  'sistema-ventas-bd': 'Sistema de Ventas y BD',
  'crm-personalizado': 'CRM Personalizado',
  'landing-page': 'Landing Page',
  'app-web': 'Aplicación Web',
  'blog': 'Blog/Portfolio',
  'marketing-digital': 'Marketing Digital',
  'community-management': 'Community Management',
};

export default function DashboardPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    
    if (!token || !email) {
      router.push('/login');
      return;
    }
    
    setUserEmail(email);
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact-requests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las solicitudes.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error de conexión al cargar las solicitudes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendiente</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">En Proceso</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Completado</Badge>;
      default:
        return <Badge variant="outline">Pendiente</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - LS WEB</h1>
              <p className="text-gray-600">Panel de administración</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Conectado como: <strong>{userEmail}</strong>
              </span>
              <Button variant="outline" onClick={fetchRequests} disabled={loading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                  <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <RefreshCw className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Proceso</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'in-progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Solicitudes Recientes</h2>
            <Badge variant="secondary">{requests.length} solicitudes</Badge>
          </div>

          {requests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes</h3>
                <p className="text-gray-600">
                  Las solicitudes de contacto aparecerán aquí cuando los usuarios las envíen.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {request.email}
                          {request.phone && (
                            <>
                              <span className="mx-2">•</span>
                              {request.phone}
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(request.status)}
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(request.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Tipo de Proyecto</p>
                        <p className="text-sm text-gray-900">
                          {projectTypeLabels[request.project_type] || request.project_type}
                        </p>
                      </div>
                      
                      {request.company && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Empresa</p>
                          <p className="text-sm text-gray-900">{request.company}</p>
                        </div>
                      )}
                      
                      {request.budget && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Presupuesto</p>
                          <p className="text-sm text-gray-900">{request.budget}</p>
                        </div>
                      )}
                      
                      {request.timeline && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Tiempo de entrega</p>
                          <p className="text-sm text-gray-900">{request.timeline}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Descripción del Proyecto</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                          {request.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}