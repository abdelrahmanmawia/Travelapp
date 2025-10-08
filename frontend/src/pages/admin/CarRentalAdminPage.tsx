import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Car, User, Calendar, MapPin, DollarSign, Clock, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

interface CarRental {
  id: number;
  user: { name: string; email: string };
  car: { brand: string; model: string; year: number };
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  pickup_location: string;
  return_location: string;
  created_at: string;
}

const CarRentalAdminPage: React.FC = () => {
  const [rentals, setRentals] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchRentals();
  }, [currentPage]);

  const fetchRentals = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/car-rentals?page=${currentPage}`);
      setRentals(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load car rentals', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/car-rentals/${id}/status`, { status });
      toast({ title: 'Success', description: 'Status updated successfully' });
      fetchRentals();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    }
  };

  const deleteRental = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this rental?')) return;
    try {
      await api.delete(`/admin/car-rentals/${id}`);
      toast({ title: 'Success', description: 'Car rental deleted successfully' });
      fetchRentals();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete rental', variant: 'destructive' });
    }
  };

  const filteredRentals = rentals.filter(rental =>
    rental.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.car?.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.car?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rental.pickup_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
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
          <p className="mt-4 text-gray-600">Loading car rentals...</p>
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
                Car Rentals Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage car rental bookings and reservations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                  placeholder="Search rentals..."
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
                  <p className="text-sm font-medium text-gray-600">Total Rentals</p>
                  <p className="text-3xl font-bold text-gray-900">{rentals.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rentals</p>
                  <p className="text-3xl font-bold text-green-600">
                    {rentals.filter(r => r.status === 'active').length}
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {rentals.filter(r => r.status === 'pending').length}
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
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${rentals.reduce((sum, rental) => sum + rental.total_price, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rentals List */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">All Car Rentals ({filteredRentals.length})</CardTitle>
              <CardDescription>Manage car rental bookings and reservations</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredRentals.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals found</h3>
                  <p className="text-gray-500">No car rentals match your search criteria.</p>
                </div>
          ) : (
            <div className="space-y-4">
              {filteredRentals.map((rental) => (
                    <Card key={rental.id} className="border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            {/* User and Car Info */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                  <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{rental.user?.name || 'Unknown User'}</h3>
                                <p className="text-gray-600">{rental.user?.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Car className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {rental.car?.brand} {rental.car?.model} ({rental.car?.year})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Rental Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Rental Period:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Duration:</span>
                                  <span className="text-sm text-gray-600">
                                    {calculateDuration(rental.start_date, rental.end_date)} days
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Total Price:</span>
                                  <span className="text-sm font-bold text-green-600">${rental.total_price}</span>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Pickup:</span>
                                  <span className="text-sm text-gray-600">{rental.pickup_location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Return:</span>
                                  <span className="text-sm text-gray-600">{rental.return_location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Booked:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(rental.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                      </div>
                    </div>
                  </div>

                          {/* Status and Actions */}
                          <div className="flex flex-col gap-3 ml-6">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(rental.status)}
                              <Badge className={`${getStatusBadge(rental.status)} border`}>
                                {rental.status}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {rental.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                    onClick={() => updateStatus(rental.id, 'confirmed')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(rental.id, 'cancelled')}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {rental.status === 'confirmed' && (
                                <Button 
                                  size="sm" 
                                  className="bg-blue-600 hover:bg-blue-700 text-white border-0"
                                  onClick={() => updateStatus(rental.id, 'active')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Activate
                                </Button>
                              )}
                              {rental.status === 'active' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                  onClick={() => updateStatus(rental.id, 'completed')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Complete
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => deleteRental(rental.id)}
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


export default CarRentalAdminPage; 