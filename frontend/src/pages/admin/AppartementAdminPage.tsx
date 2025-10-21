import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, Plus, Edit, Trash2, Filter, MapPin, DollarSign, Bed, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Appartement {
  id: number;
  title: string;
  description: string;
  address: string;
  rooms: number;
  price: number;
  images?: { url: string }[];
  created_at: string;
}

const AppartementAdminPage: React.FC = () => {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppartement, setEditingAppartement] = useState<Appartement | null>(null);
  const { toast } = useToast();
  const [selectedImageIndexes, setSelectedImageIndexes] = useState<Record<number, number>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    rooms: '',
    price: '',
  });

  // Image handling
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchAppartements();
  }, [currentPage]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (showAddForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showAddForm]);

  const fetchAppartements = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/appartements?page=${currentPage}`);
      const appartementsData = res.data.data || res.data;
      setAppartements(appartementsData);
      // Initialize image indexes for carousels
      setSelectedImageIndexes(
        appartementsData.reduce((acc: Record<number, number>, apt: Appartement) => ({ ...acc, [apt.id]: 0 }), {})
      );
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load appartements', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedImages(prev => [...prev, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      selectedImages.forEach(image => {
        formDataToSend.append('images[]', image);
      });

      if (editingAppartement) {
        await api.post(`/admin/appartements/${editingAppartement.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: 'Success', description: 'Appartement updated successfully' });
      } else {
        await api.post('/admin/appartements', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast({ title: 'Success', description: 'Appartement added successfully' });
      }
      setShowAddForm(false);
      setEditingAppartement(null);
      resetForm();
      fetchAppartements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save appartement', variant: 'destructive' });
    }
  };

  const handleEdit = (appartement: Appartement) => {
    setEditingAppartement(appartement);
    setFormData({
      title: appartement.title,
      description: appartement.description,
      address: appartement.address,
      rooms: appartement.rooms.toString(),
      price: appartement.price.toString(),
    });
    setSelectedImages([]);
    setImagePreviewUrls(appartement.images ? appartement.images.map(img => img.url) : []);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this appartement?')) return;
    try {
      await api.delete(`/admin/appartements/${id}`);
      toast({ title: 'Success', description: 'Appartement deleted successfully' });
      fetchAppartements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete appartement', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      address: '',
      rooms: '',
      price: '',
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const filteredAppartements = appartements.filter(appartement =>
    (appartement.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (appartement.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const nextImage = (appartementId: number, totalImages: number) => {
    setSelectedImageIndexes(prev => ({
      ...prev,
      [appartementId]: (prev[appartementId] + 1) % totalImages,
    }));
  };

  const prevImage = (appartementId: number, totalImages: number) => {
    setSelectedImageIndexes(prev => ({
      ...prev,
      [appartementId]: (prev[appartementId] - 1 + totalImages) % totalImages,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appartements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Appartements Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your rental properties</p>
            </div>
            <Button
              onClick={() => {
                setShowAddForm(true);
                setEditingAppartement(null);
                resetForm();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Appartement
            </Button>
          </div>
        </div>

        <Card className="mb-6 bg-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search appartements by title or address..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in-0">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => { setShowAddForm(false); setEditingAppartement(null); resetForm(); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"
              >
                <X className="w-7 h-7" />
              </button>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Home className="w-8 h-8 text-indigo-600" />
                  <h2 className="text-3xl font-bold text-gray-800">
                    {editingAppartement ? 'Edit Appartement' : 'Add New Appartement'}
                  </h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <Input
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Cozy Downtown Apartment"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <Input
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Full address"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the property..."
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        placeholder="100"
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                      <Input
                        type="number"
                        value={formData.rooms}
                        onChange={e => setFormData({ ...formData, rooms: e.target.value })}
                        placeholder="2"
                        min="0"
                        max="10"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Property Images</label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Home className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 2MB</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>

                      {(imagePreviewUrls.length > 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={`new-${index}`} className="relative">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl">
                      {editingAppartement ? 'Update Appartement' : 'Add Appartement'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingAppartement(null);
                        resetForm();
                      }}
                      className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {filteredAppartements.length === 0 && !showAddForm ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Home className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No appartements available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppartements.map((appartement) => (
              <div key={appartement.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow relative group">
                {/* Image Carousel */}
                {appartement.images && appartement.images.length > 0 ? (
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={appartement.images[selectedImageIndexes[appartement.id]]?.url}
                      alt={appartement.title}
                      className="w-full h-full object-cover"
                    />
                    {appartement.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(appartement.id, appartement.images!.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => nextImage(appartement.id, appartement.images!.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {appartement.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedImageIndexes[appartement.id] ? 'bg-white w-6' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Home className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Appartement Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1 truncate">{appartement.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 truncate">{appartement.address}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm">{appartement.rooms} rooms</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-lg">{parseFloat(String(appartement.price)).toLocaleString()} / night</span>
                    </div>
                  </div>

                  {appartement.description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {appartement.description}
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(appartement)}
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(appartement.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
      </div>
    </div>
  );
};

export default AppartementAdminPage;