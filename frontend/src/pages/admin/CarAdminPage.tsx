import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Car, Plus, Edit, Trash2, Upload, X, Eye } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';

interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  available: boolean;
  images: string[];
}

const CarAdminPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [form, setForm] = useState<Partial<Car>>({
    name: '',
    brand: '',
    price: 0,
    available: true,
    images: []
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchCars = async () => {
    try {
      setLoading(true);
    const res = await api.get('/cars');
    setCars(res.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch cars',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchCars(); 
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await api.post('/admin/cars/upload-image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      setForm(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), res.data.url] 
      }));
      toast({ 
        title: 'Success', 
        description: 'Image uploaded successfully' 
      });
    } catch (err: any) {
      toast({ 
        title: 'Upload failed', 
        description: err.response?.data?.message || 'Error uploading image', 
        variant: 'destructive' 
      });
    }
  };

  const handleRemoveImage = (url: string) => {
    setForm(prev => ({ 
      ...prev, 
      images: (prev.images || []).filter(img => img !== url) 
    }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      brand: '',
      price: 0,
      available: true,
      images: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.brand || !form.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      if (editingId) {
        await api.put(`/admin/cars/${editingId}`, form);
        toast({ 
          title: 'Success', 
          description: 'Car updated successfully' 
        });
      } else {
        await api.post('/admin/cars', form);
        toast({ 
          title: 'Success', 
          description: 'Car added successfully' 
        });
      }
      resetForm();
      fetchCars();
    } catch (err: any) {
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to save car', 
        variant: 'destructive' 
      });
    }
  };

  const handleEdit = (car: Car) => {
    setForm(car);
    setEditingId(car.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }
    
    try {
    await api.delete(`/admin/cars/${id}`);
      toast({
        title: 'Success',
        description: 'Car deleted successfully'
      });
    fetchCars();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete car',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cars...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
                <p className="text-gray-600 mt-2">Add, edit, and manage your car fleet</p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Car List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Car Fleet ({cars.length})</CardTitle>
                  <CardDescription>Manage your available cars</CardDescription>
                </CardHeader>
                <CardContent>
                  {cars.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No cars added yet</p>
                      <Button onClick={() => setShowForm(true)} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Car
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cars.map((car) => (
                        <div key={car.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            {car.images && car.images.length > 0 && (
                              <img 
                                src={car.images[0]} 
                                alt={car.name}
                                className="w-16 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold">{car.name}</h3>
                              <p className="text-sm text-gray-600">{car.brand}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium">${car.price}/day</span>
                                <Badge variant={car.available ? "default" : "secondary"}>
                                  {car.available ? "Available" : "Unavailable"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(car)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(car.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{editingId ? 'Edit Car' : 'Add New Car'}</CardTitle>
                    <CardDescription>
                      {editingId ? 'Update car information' : 'Add a new car to your fleet'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Car Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Toyota Camry"
                          value={form.name || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="brand">Brand *</Label>
                        <Input
                          id="brand"
                          name="brand"
                          placeholder="e.g., Toyota"
                          value={form.brand || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="price">Daily Price ($) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 50.00"
                          value={form.price || ''}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="images">Car Images</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer text-blue-600 hover:text-blue-700">
                            Click to upload image
          </label>
                        </div>
                      </div>

                      {form.images && form.images.length > 0 && (
              <div>
                          <Label>Uploaded Images</Label>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {form.images.map((img, i) => (
                              <div key={i} className="relative group">
                                <img 
                                  src={img} 
                                  alt={`Car ${i + 1}`} 
                                  className="w-20 h-16 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(img)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="available"
                          name="available"
                          checked={form.available || false}
                          onChange={handleChange}
                          className="rounded"
                        />
                        <Label htmlFor="available">Available for rental</Label>
              </div>

              <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingId ? 'Update Car' : 'Add Car'}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
            </div>
        </div>
      </div>
    </>
  );
};

export default CarAdminPage; 