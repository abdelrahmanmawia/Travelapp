import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
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

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      console.log('Dashboard API response:', response.data); // Debug log
      setStats(response.data.stats);
      setRecentActivities(response.data.recentActivities);
      if (!response.data.stats) {
        toast({
          title: 'Error',
          description: 'No statistics data received from backend.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard data',
        variant: 'destructive',
      });
      console.error('Dashboard API error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your travel services and monitor activities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visa Services</CardTitle>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalVisaServices || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalPayments || 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage different sections of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/users')}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Manage Users
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/bookings')}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Bookings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/visa-services')}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Manage Visa Services
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/car-rentals')}
                >
                  Manage Car Rentals
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/live-services')}
                >
                  Manage Live In Morocco
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/admin/full-packages')}
                >
                  Manage Full Packages
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Statistics</CardTitle>
                <CardDescription>Overview of different services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Car Rentals</span>
                  <Badge variant="secondary">{stats?.totalCarRentals || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Live Services</span>
                  <Badge variant="secondary">{stats?.totalLiveServices || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Full Packages</span>
                  <Badge variant="secondary">{stats?.totalFullPackages || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current system health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Status</span>
                  <Badge variant="default" className="bg-green-500">Online</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Updated</span>
                  <span className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
              <TabsTrigger value="visa">Recent Visa Services</TabsTrigger>
              <TabsTrigger value="payments">Recent Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking requests from users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities?.bookings?.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{booking.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{booking.destination}</p>
                          <p className="text-xs text-gray-400">{formatDate(booking.created_at)}</p>
                        </div>
                        <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {(!recentActivities?.bookings || recentActivities.bookings.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No recent bookings</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visa" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Visa Services</CardTitle>
                  <CardDescription>Latest visa service requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities?.visaServices?.map((visa: any) => (
                      <div key={visa.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{visa.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{visa.country_of_birth} → {visa.residence_country}</p>
                          <p className="text-xs text-gray-400">{formatDate(visa.created_at)}</p>
                        </div>
                        <Badge variant={visa.status === 'pending' ? 'secondary' : 'default'}>
                          {visa.status}
                        </Badge>
                      </div>
                    ))}
                    {(!recentActivities?.visaServices || recentActivities.visaServices.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No recent visa services</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities?.payments?.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{payment.user?.name || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">${payment.amount}</p>
                          <p className="text-xs text-gray-400">{formatDate(payment.created_at)}</p>
                        </div>
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                    {(!recentActivities?.payments || recentActivities.payments.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No recent payments</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 