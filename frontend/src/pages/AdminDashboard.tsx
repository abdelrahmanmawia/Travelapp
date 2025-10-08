import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Car, 
  Home, 
  FileText, 
  Package, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  Settings,
  BarChart3,
  Activity,
  ArrowRight,
  Plus,
  Eye
} from 'lucide-react';
import api from '@/lib/api';

// FIX: Import Navbar (was missing, causing error)
import Navbar from '@/components/Navbar';

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalVisaServices: number;
  totalCarRentals: number;
  totalLiveServices: number;
  totalFullPackages: number;
  totalPayments: number;
}

interface RecentActivity {
  bookings: any[];
  visaServices: any[];
  payments: any[];
}

interface MonthlyStats {
  month: number;
  count: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentActivities(response.data.recentActivities);
      setMonthlyStats(response.data.monthlyStats || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1] || '';
  };

  const adminQuickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      href: '/admin/users'
    },
    {
      title: 'Car Management',
      description: 'Add, edit, and manage cars',
      icon: <Car className="h-6 w-6" />,
      color: 'bg-green-500',
      href: '/admin/cars'
    },
    {
      title: 'Appartements',
      description: 'Manage available appartements',
      icon: <Home className="h-6 w-6" />,
      color: 'bg-purple-500',
      href: '/admin/appartements'
    },
    {
      title: 'Visa Services',
      description: 'Review visa applications',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-orange-500',
      href: '/admin/visa-services'
    },
    {
      title: 'Car Rentals',
      description: 'Manage car rental requests',
      icon: <Car className="h-6 w-6" />,
      color: 'bg-indigo-500',
      href: '/admin/car-rentals'
    },
    {
      title: 'Live Services',
      description: 'Review live in Morocco requests',
      icon: <Home className="h-6 w-6" />,
      color: 'bg-teal-500',
      href: '/admin/live-services'
    },
    {
      title: 'Full Packages',
      description: 'Manage package requests',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-pink-500',
      href: '/admin/full-packages'
    },
    {
      title: 'Payments',
      description: 'View payment history',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-red-500',
      href: '/admin/payments'
    }
  ];

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
      </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your travel services and monitor activities</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/admin/users')}>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button onClick={() => navigate('/admin/cars')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Car
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">Active bookings</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visa Services</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalVisaServices || 0}</div>
                <p className="text-xs text-muted-foreground">Visa applications</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Car Rentals</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCarRentals || 0}</div>
                <p className="text-xs text-muted-foreground">Rental requests</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Live Services</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalLiveServices || 0}</div>
                <p className="text-xs text-muted-foreground">Relocation requests</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Full Packages</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalFullPackages || 0}</div>
                <p className="text-xs text-muted-foreground">Package requests</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
                <p className="text-xs text-muted-foreground">Processed payments</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Service completion</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminQuickActions.map((action, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(action.href)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg text-white ${action.color}`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Activity Tabs */}
          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="visa">Visa Services</TabsTrigger>
              <TabsTrigger value="payments">Recent Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities?.bookings && recentActivities.bookings.length > 0 ? (
                  <div className="space-y-4">
                      {recentActivities.bookings.map((booking: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Booking #{booking.id}</p>
                            <p className="text-sm text-gray-600">
                              {booking.serviceable_type} - {formatDate(booking.created_at)}
                            </p>
                        </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    </div>
                  ) : (
                      <p className="text-center text-gray-500 py-4">No recent bookings</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visa" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Visa Services</CardTitle>
                  <CardDescription>Latest visa applications</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities?.visaServices && recentActivities.visaServices.length > 0 ? (
                  <div className="space-y-4">
                      {recentActivities.visaServices.map((visa: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Visa Application #{visa.id}</p>
                            <p className="text-sm text-gray-600">
                              {visa.country_of_birth} - {formatDate(visa.created_at)}
                            </p>
                        </div>
                          <Badge variant={visa.status === 'confirmed' ? 'default' : 'secondary'}>
                          {visa.status}
                        </Badge>
                      </div>
                    ))}
                    </div>
                  ) : (
                      <p className="text-center text-gray-500 py-4">No recent visa services</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment activities</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities?.payments && recentActivities.payments.length > 0 ? (
                  <div className="space-y-4">
                      {recentActivities.payments.map((payment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Payment #{payment.id}</p>
                            <p className="text-sm text-gray-600">
                              ${payment.amount} - {payment.method} - {formatDate(payment.created_at)}
                            </p>
                          </div>
                          <Badge variant={payment.payment_status === 'completed' ? 'default' : 'secondary'}>
                            {payment.payment_status}
                          </Badge>
                        </div>
                      ))}
                      </div>
                  ) : (
                      <p className="text-center text-gray-500 py-4">No recent payments</p>
                    )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Monthly Statistics */}
          {monthlyStats.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Booking Statistics</CardTitle>
                  <CardDescription>Booking trends over the past year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-32">
                    {monthlyStats.map((stat, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${(stat.count / Math.max(...monthlyStats.map(s => s.count))) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-2">{getMonthName(stat.month)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
  );
};

export default AdminDashboard; 