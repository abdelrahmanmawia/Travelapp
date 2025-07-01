import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

interface VisaService {
  id: number;
  user: { name: string; email: string };
  country_of_birth: string;
  date_of_birth: string;
  residence_country: string;
  validity: string;
  status: string;
  created_at: string;
}

const VisaServiceAdminPage: React.FC = () => {
  const [services, setServices] = useState<VisaService[]>([]);
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
      const res = await api.get(`/admin/visa-services?page=${currentPage}`);
      setServices(res.data.data || res.data);
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
      toast({ title: 'Success', description: 'Status updated' });
      fetchServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    }
  };

  const deleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      await api.delete(`/admin/visa-services/${id}`);
      toast({ title: 'Deleted', description: 'Visa service deleted' });
      fetchServices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const filteredServices = services.filter(service =>
    service.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.country_of_birth.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.residence_country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 w-full">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Visa Service Requests</h1>
            <Input
              placeholder="Search by user, country, or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {filteredServices.length === 0 && <div className="text-center py-8 text-gray-500">No visa service requests found.</div>}
              {filteredServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{service.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{service.user?.email}</p>
                        <p className="text-xs text-gray-400">{service.country_of_birth} → {service.residence_country}</p>
                        <p className="text-xs text-gray-400">DOB: {service.date_of_birth} | Validity: {service.validity}</p>
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

export default VisaServiceAdminPage; 