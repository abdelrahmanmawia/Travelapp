import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

interface LiveInMoroccoService {
  id: number;
  user: { name: string; email: string };
  service_type: string;
  details: string;
  status: string;
  created_at: string;
}

const LiveInMoroccoAdminPage: React.FC = () => {
  const [services, setServices] = useState<LiveInMoroccoService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/live-services?page=${currentPage}`);
      setServices(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load live in morocco services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/live-services/${id}/status`, { status });
      toast({ title: 'Success', description: 'Status updated' });
      fetchServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    }
  };

  const deleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/admin/live-services/${id}`);
      toast({ title: 'Deleted', description: 'Live in Morocco service deleted' });
      fetchServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const filteredServices = services.filter(service =>
    service.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.service_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Live In Morocco Service Requests</h1>
            <Input
              placeholder="Search by user, type, or details..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {filteredServices.length === 0 && <div className="text-center py-8 text-gray-500">No live in morocco service requests found.</div>}
              {filteredServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{service.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{service.user?.email}</p>
                        <p className="text-xs text-gray-400">{service.service_type}</p>
                        <p className="text-xs text-gray-400">Details: {service.details}</p>
                        <p className="text-xs text-gray-400">Requested: {new Date(service.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={service.status === 'pending' ? 'secondary' : 'default'}>{service.status}</Badge>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(service.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(service.id, 'rejected')}>Reject</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteService(service.id)}>Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveInMoroccoAdminPage; 