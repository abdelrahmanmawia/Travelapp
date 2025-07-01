import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/Loader';

interface FullPackage {
  id: number;
  user: { name: string; email: string };
  visa: string[];
  air_ticket: string[];
  transport: string[];
  program: string[];
  total_price: number;
  status: string;
  created_at: string;
}

const FullPackageAdminPage: React.FC = () => {
  const [packages, setPackages] = useState<FullPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/full-packages?page=${currentPage}`);
      setPackages(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load full packages', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/full-packages/${id}/status`, { status });
      toast({ title: 'Success', description: 'Status updated' });
      fetchPackages();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to update status', variant: 'destructive' });
    }
  };

  const deletePackage = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/admin/full-packages/${id}`);
      toast({ title: 'Deleted', description: 'Full package deleted' });
      fetchPackages();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete', variant: 'destructive' });
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.visa?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.air_ticket?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.transport?.join(', ').toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.program?.join(', ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 w-full">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Full Package Requests</h1>
            <Input
              placeholder="Search by user or package..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="space-y-4">
              {filteredPackages.length === 0 && <div className="text-center py-8 text-gray-500">No full package requests found.</div>}
              {filteredPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium">{pkg.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{pkg.user?.email}</p>
                        <p className="text-xs text-gray-400">Visa: {pkg.visa?.join(', ')}</p>
                        <p className="text-xs text-gray-400">Air Ticket: {pkg.air_ticket?.join(', ')}</p>
                        <p className="text-xs text-gray-400">Transport: {pkg.transport?.join(', ')}</p>
                        <p className="text-xs text-gray-400">Program: {pkg.program?.join(', ')}</p>
                        <p className="text-xs text-gray-400">Total Price: {pkg.total_price}</p>
                        <p className="text-xs text-gray-400">Requested: {new Date(pkg.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={pkg.status === 'pending' ? 'secondary' : 'default'}>{pkg.status}</Badge>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(pkg.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => updateStatus(pkg.id, 'rejected')}>Reject</Button>
                      <Button size="sm" variant="destructive" onClick={() => deletePackage(pkg.id)}>Delete</Button>
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

export default FullPackageAdminPage; 