import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, CreditCard, User, Calendar, DollarSign, Clock, CheckCircle, XCircle, Trash2, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

interface Payment {
  id: number;
  user: { name: string; email: string };
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  payment_type: string;
  reference_id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const PaymentsAdminPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/payments?page=${currentPage}`);
      setPayments(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load payments', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/payments/${id}/status`, { status });
      toast({ title: 'Success', description: 'Payment status updated successfully' });
      fetchPayments();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update payment status', variant: 'destructive' });
    }
  };

  const deletePayment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    try {
      await api.delete(`/admin/payments/${id}`);
      toast({ title: 'Success', description: 'Payment record deleted successfully' });
      fetchPayments();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete payment', variant: 'destructive' });
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <TrendingDown className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'paypal':
        return <span className="text-blue-600 font-bold text-sm">PP</span>;
      case 'bank_transfer':
        return <span className="text-green-600 font-bold text-sm">BT</span>;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTotalRevenue = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter(p => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getFailedAmount = () => {
    return payments
      .filter(p => p.status === 'failed' || p.status === 'cancelled')
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
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
                Payments Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Monitor and manage all payment transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search payments..."
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
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">{payments.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    ${getTotalRevenue().toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-green-600" />
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
                    ${getPendingAmount().toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Failed/Cancelled</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${getFailedAmount().toLocaleString()}
                    </p>
                  </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        ) : (
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">All Payments ({filteredPayments.length})</CardTitle>
              <CardDescription>Monitor and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                  <p className="text-gray-500">No payments match your search criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <Card key={payment.id} className="border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-4">
                            {/* User and Payment Info */}
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{payment.user?.name || 'Unknown User'}</h3>
                                <p className="text-gray-600">{payment.user?.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <CreditCard className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {payment.payment_type} - {payment.reference_id}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Amount:</span>
                                  <span className="text-sm font-bold text-green-600">
                                    {payment.currency} {payment.amount.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Payment Method:</span>
                                  <span className="text-sm text-gray-600 capitalize">
                                    {payment.payment_method.replace('_', ' ')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Created:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(payment.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                        </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">Status:</span>
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(payment.status)}
                                    <Badge className={`${getStatusBadge(payment.status)} border`}>
                                      {payment.status}
                            </Badge>
                          </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">Updated:</span>
                                  <span className="text-sm text-gray-600">
                                    {new Date(payment.updated_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                        </div>
                                {payment.description && (
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-700">Description:</span>
                                    <span className="text-sm text-gray-600">{payment.description}</span>
                      </div>
                        )}
                      </div>
                    </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 ml-6">
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(payment.payment_method)}
                              <span className="text-sm text-gray-600 capitalize">
                                {payment.payment_method.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="flex flex-col gap-2">
                              {payment.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                    onClick={() => updateStatus(payment.id, 'completed')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(payment.id, 'failed')}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Mark Failed
                                  </Button>
                                </>
                              )}
                              {payment.status === 'processing' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white border-0"
                                    onClick={() => updateStatus(payment.id, 'completed')}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => updateStatus(payment.id, 'failed')}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Fail
                                  </Button>
                                </>
                              )}
                              {payment.status === 'completed' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                  onClick={() => updateStatus(payment.id, 'refunded')}
                                >
                                  <TrendingDown className="w-4 h-4 mr-2" />
                                  Refund
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => deletePayment(payment.id)}
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
        )}
        </div>
      </div>
  );
};

export default PaymentsAdminPage;
