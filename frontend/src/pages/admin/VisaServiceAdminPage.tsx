import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, FileText, User, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, Trash2, Filter, Globe } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';


interface VisaService {
  id: number;
  user: { name: string; email: string };
  visa_type: string;
  destination_country: string;
  purpose: string;
  travel_date: string;
  return_date: string;
  total_price: number;
  status: string;
  documents: string[];
  notes: string;
  created_at: string;
}

const VisaServiceAdminPage: React.FC = () => {
  const [visaServices, setVisaServices] = useState<VisaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchVisaServices();
  }, [currentPage]);

  const fetchVisaServices = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/visa-services?page=${currentPage}`);
      setVisaServices(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load visa services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/visa-services/${id}/status`, { status });
      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchVisaServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    }
  };

  const deleteVisaService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this visa service?')) return;
    try {
      await api.delete(`/admin/visa-services/${id}`);
      toast({ title: 'Success', description: 'Visa service deleted successfully' });
      fetchVisaServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete visa service', variant: 'destructive' });
    }
  };

  const filteredVisaServices = visaServices.filter(service =>
    service.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.visa_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.destination_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visa services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visa Services Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage visa applications and services</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                  placeholder="Search visa services..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{visaServices.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {visaServices.filter(v => v.status === 'pending').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {visaServices.filter(v => v.status === 'approved').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${visaServices.reduce((sum, service) => sum + service.total_price, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
                </div>

        {/* Visa Services List */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">All Visa Services ({filteredVisaServices.length})</CardTitle>
              <CardDescription>Manage visa applications and services</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredVisaServices.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No visa services found</h3>
                  <p className="text-gray-500">No visa services match your search criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVisaServices.map((service) => (
                    <Card key={service.id} className="border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            {/* User and Service Info */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{service.user?.name || 'Unknown User'}</h3>
                                <p className="text-gray-600">{service.user?.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {service.visa_type} Visa - {service.destination_country}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Service Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Travel Period:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(service.travel_date).toLocaleDateString()} - {new Date(service.return_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Duration:</span>
                                  <span className="text-sm text-gray-600">
                                    {calculateDuration(service.travel_date, service.return_date)} days
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Total Price:</span>
                                  <span className="text-sm font-bold text-green-600">${service.total_price}</span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                  <span className="text-sm font-medium text-gray-700">Purpose:</span>
                                  <span className="text-sm text-gray-600">{service.purpose}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Applied:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(service.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {service.notes && (
                                  <div className="flex items-start gap-2">
                                    <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                    <span className="text-sm font-medium text-gray-700">Notes:</span>
                                    <span className="text-sm text-gray-600">{service.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Documents */}
                            {service.documents && service.documents.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Documents:</p>
                                <div className="flex flex-wrap gap-2">
                                  {service.documents.map((doc, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {doc}
                                    </Badge>
                                  ))}
                            </div>
                          </div>
                            )}
                          </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col gap-3 ml-6">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(service.status)}
                              <Badge className={`${getStatusBadge(service.status)} border`}>
                                {service.status}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {service.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                                    onClick={() => updateStatus(service.id, 'processing')}
                                  >
                                    <Clock className="w-4 h-4 mr-2" />
                                    Start Processing
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(service.id, 'rejected')}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {service.status === 'processing' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                    onClick={() => updateStatus(service.id, 'approved')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(service.id, 'rejected')}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              {service.status === 'approved' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                  onClick={() => updateStatus(service.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => deleteVisaService(service.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              )}

              {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-2 shadow-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                      className="border-gray-200 hover:bg-gray-50"
                        >
                          Previous
                        </Button>
                    <div className="flex items-center gap-1 px-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : "border-gray-200 hover:bg-gray-50"}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                      className="border-gray-200 hover:bg-gray-50"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};



export default VisaServiceAdminPage;