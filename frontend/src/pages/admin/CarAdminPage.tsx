import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Car, Plus, Edit, Trash2, Filter, Calendar, MapPin, DollarSign, Users, Star, CheckCircle, X } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface CarData {
  id: number;
  brand: string;
  model: string;
  year: number;
  price_per_day: number;
  location: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  available: boolean;
  images?: string[];
  created_at: string;
}

const CarAdminPage: React.FC = () => {
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCar, setEditingCar] = useState<CarData | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price_per_day: '',
    location: '',
    seats: '',
    transmission: 'automatic',
    fuel_type: 'gasoline',
    available: true
  });

  // Image handling
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchCars();
  }, [currentPage]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/cars?page=${currentPage}`);
      setCars(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load cars', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // keep previously added + new ones
    setSelectedImages(prev => [...prev, ...files]);

    // previews
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

      // Add basic fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Always include the available field
      formDataToSend.append('available', formData.available ? '1' : '0');

      // Add images
      selectedImages.forEach(image => {
        formDataToSend.append('images[]', image);
      });

      if (editingCar) {
        await api.put(`/admin/cars/${editingCar.id}`, formDataToSend);
        toast({ title: 'Success', description: 'Car updated successfully' });
      } else {
        console.log('Car information being submitted:', formDataToSend);
        await api.post('/admin/cars', formDataToSend);
        toast({ title: 'Success', description: 'Car added successfully' });
      }
      setShowAddForm(false);
      setEditingCar(null);
      resetForm();
      setSelectedImages([]);
      setImagePreviewUrls([]);
      fetchCars();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to save car', variant: 'destructive' });
    }
  };

  const handleEdit = (car: CarData) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price_per_day: car.price_per_day.toString(),
      location: car.location,
      seats: car.seats.toString(),
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      available: car.available
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      await api.delete(`/admin/cars/${id}`);
      toast({ title: 'Success', description: 'Car deleted successfully' });
      fetchCars();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to delete car', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price_per_day: '',
      location: '',
      seats: '',
      transmission: 'automatic',
      fuel_type: 'gasoline',
      available: true
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const filteredCars = cars.filter(car =>
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityBadge = (available: boolean) => {
    return available ?
      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge> :
      <Badge className="bg-red-100 text-red-800 border-red-200">Unavailable</Badge>;
  };

  const getTransmissionIcon = (transmission: string) => {
    return transmission === 'automatic' ? '🔄' : '⚙️';
  };

  const getFuelIcon = (fuelType: string) => {
    const icons = {
      gasoline: '⛽',
      diesel: '🛢️',
      electric: '⚡',
      hybrid: '🔋'
    };
    return icons[fuelType as keyof typeof icons] || '⛽';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cars...</p>
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
                Cars Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your car rental fleet</p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Car
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Cars</p>
                  <p className="text-3xl font-bold text-gray-900">{cars.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-3xl font-bold text-green-600">
                    {cars.filter(car => car.available).length}
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
                  <p className="text-sm font-medium text-gray-600">Average Price</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${cars.length > 0 ? Math.round(cars.reduce((sum, car) => sum + car.price_per_day, 0) / cars.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {new Set(cars.map(car => car.location)).size}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search cars by brand, model, or location..."
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

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6 bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </CardTitle>
              <CardDescription>
                {editingCar ? 'Update car information' : 'Add a new car to your fleet'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <Input
                      value={formData.brand}
                      onChange={e => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Toyota"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <Input
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., Camry"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <Input
                      type="number"
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day ($)</label>
                    <Input
                      type="number"
                      value={formData.price_per_day}
                      onChange={e => setFormData({ ...formData, price_per_day: e.target.value })}
                      placeholder="50"
                      min="0"
                      step="0.01"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Casablanca"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                    <Input
                      type="number"
                      value={formData.seats}
                      onChange={e => setFormData({ ...formData, seats: e.target.value })}
                      placeholder="5"
                      min="1"
                      max="12"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <select
                      value={formData.transmission}
                      onChange={e => setFormData({ ...formData, transmission: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                    <select
                      value={formData.fuel_type}
                      onChange={e => setFormData({ ...formData, fuel_type: e.target.value })}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Car Images</label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Car className="w-8 h-8 mb-3 text-gray-400" />
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

                    {/* Image Previews */}
                    {/* Image Previews */}
                    {(imagePreviewUrls.length > 0 || (editingCar?.images && editingCar.images.length > 0)) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* New uploads */}
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
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {/* Existing images (edit mode) */}
                        {editingCar?.images && editingCar.images.map((image, index) => (
                          <div key={`existing-${index}`} className="relative">
                            <img
                               src={image}  
                              alt={`Car ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs">Existing</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={e => setFormData({ ...formData, available: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Available for rent</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                    {editingCar ? 'Update Car' : 'Add Car'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingCar(null);
                      resetForm();
                    }}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Cars List */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">All Cars ({filteredCars.length})</CardTitle>
            <CardDescription>Manage your car rental fleet</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {filteredCars.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-500">No cars match your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <Card key={car.id} className="border border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Car Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{car.brand} {car.model}</h3>
                            <p className="text-gray-600">{car.year}</p>
                          </div>
                          {getAvailabilityBadge(car.available)}
                        </div>

                        {/* Car Images */}
                        {car.images && car.images.length > 0 ? (
                          <div className="space-y-2">
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                              <img
                                src={`/storage/${car.images[0]}`}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {car.images.length > 1 && (
                              <div className="flex gap-2">
                                {car.images.slice(1, 4).map((image, index) => (
                                  <div key={index} className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={image}  
                                      alt={`${car.brand} ${car.model}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                                {car.images.length > 4 && (
                                  <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">+{car.images.length - 4}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <Car className="w-12 h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Car Details */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-gray-600">Price per day</span>
                            </div>
                            <span className="font-bold text-lg text-green-600">${car.price_per_day}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">{car.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-600">{car.seats} seats</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTransmissionIcon(car.transmission)}</span>
                              <span className="text-gray-600 capitalize">{car.transmission}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getFuelIcon(car.fuel_type)}</span>
                              <span className="text-gray-600 capitalize">{car.fuel_type}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(car)}
                            className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(car.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

export default CarAdminPage;