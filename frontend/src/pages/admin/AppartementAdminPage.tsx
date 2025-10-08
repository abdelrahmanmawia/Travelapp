import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Home, Plus, Edit, Trash2, Filter, MapPin, DollarSign, Users, Star, Bed, Bath, Wifi, CheckCircle, X } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';


interface Appartement {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  available: boolean;
  images?: string[];
  image_url?: string;
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

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price_per_night: '',
    bedrooms: '',
    bathrooms: '',
    max_guests: '',
    amenities: [] as string[],
    available: true
  });

  // Image handling
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    fetchAppartements();
  }, [currentPage]);

  const fetchAppartements = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/appartements?page=${currentPage}`);
      setAppartements(res.data.data || res.data);
      setTotalPages(res.data.last_page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to load appartements', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
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
        if (key === 'amenities') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value.toString());
        }
      });
      
      // Always include the available field
      formDataToSend.append('available', formData.available.toString());
      
      // Add images
      selectedImages.forEach(image => {
        formDataToSend.append('images[]', image);
      });

      if (editingAppartement) {
        await api.put(`/admin/appartements/${editingAppartement.id}`, formDataToSend);
        toast({ title: 'Success', description: 'Appartement updated successfully' });
      } else {
        await api.post('/admin/appartements', formDataToSend);
        toast({ title: 'Success', description: 'Appartement added successfully' });
      }
      setShowAddForm(false);
      setEditingAppartement(null);
      resetForm();
      setSelectedImages([]);
      setImagePreviewUrls([]);
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
      city: appartement.city,
      price_per_night: appartement.price_per_night.toString(),
      bedrooms: appartement.bedrooms.toString(),
      bathrooms: appartement.bathrooms.toString(),
      max_guests: appartement.max_guests.toString(),
      amenities: appartement.amenities || [],
      available: appartement.available
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
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
      city: '',
      price_per_night: '',
      bedrooms: '',
      bathrooms: '',
      max_guests: '',
      amenities: [],
      available: true
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const filteredAppartements = appartements.filter(appartement =>
    (appartement.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (appartement.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (appartement.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getAvailabilityBadge = (available: boolean) => {
    return available ? 
      <Badge className="bg-green-100 text-green-800 border-green-200">Available</Badge> :
      <Badge className="bg-red-100 text-red-800 border-red-200">Unavailable</Badge>;
  };

  const amenitiesList = ['WiFi', 'Kitchen', 'Air Conditioning', 'Parking', 'Balcony', 'Pool', 'Gym', 'Pet Friendly'];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Appartements Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Manage your rental properties</p>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)} 
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Appartement
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-3xl font-bold text-gray-900">{appartements.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Home className="w-6 h-6 text-blue-600" />
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
                    {appartements.filter(apt => apt.available).length}
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
                  <p className="text-sm font-medium text-gray-600">Cities</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {new Set(appartements.map(apt => apt.city)).size}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
          </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Price/Night</p>
                  <p className="text-3xl font-bold text-orange-600">
                    ${appartements.length > 0 ? Math.round(appartements.reduce((sum, apt) => sum + apt.price_per_night, 0) / appartements.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-orange-600" />
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
                  placeholder="Search appartements by title, city, or address..."
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
                {editingAppartement ? 'Edit Appartement' : 'Add New Appartement'}
              </CardTitle>
              <CardDescription>
                {editingAppartement ? 'Update appartement information' : 'Add a new rental property'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Cozy Downtown Apartment"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      placeholder="e.g., Casablanca"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Input
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      placeholder="Full address"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the property..."
                      required
                      rows={3}
                      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
                    <Input
                      type="number"
                      value={formData.price_per_night}
                      onChange={e => setFormData({...formData, price_per_night: e.target.value})}
                      placeholder="100"
                      min="0"
                      step="0.01"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                    <Input
                      type="number"
                      value={formData.max_guests}
                      onChange={e => setFormData({...formData, max_guests: e.target.value})}
                      placeholder="4"
                      min="1"
                      max="20"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                      placeholder="2"
                      min="0"
                      max="10"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                      placeholder="1"
                      min="0"
                      max="10"
                      step="0.5"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({...formData, amenities: [...formData.amenities, amenity]});
                            } else {
                              setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image Upload */}
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
                    
                    {/* Image Previews */}
                    {(imagePreviewUrls.length > 0 || (editingAppartement?.images && editingAppartement.images.length > 0)) && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* New image previews */}
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
                        
                        {/* Existing images from editing */}
                        {editingAppartement?.images && editingAppartement.images.map((image, index) => (
                          <div key={`existing-${index}`} className="relative">
                            <img
                              src={`/storage/${image}`}
                              alt={`Property ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
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
                      onChange={e => setFormData({...formData, available: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Available for rent</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
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
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Appartements List */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-xl font-semibold text-gray-900">All Appartements ({filteredAppartements.length})</CardTitle>
              <CardDescription>Manage your rental properties</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {filteredAppartements.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appartements found</h3>
                  <p className="text-gray-500">No appartements match your search criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredAppartements.map((appartement) => (
                    <Card key={appartement.id} className="border border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Appartement Header */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900">{appartement.title}</h3>
                              <p className="text-gray-600">{appartement.city}</p>
                            </div>
                            {getAvailabilityBadge(appartement.available)}
                          </div>

                          {/* Appartement Images */}
                          {appartement.images && appartement.images.length > 0 ? (
                            <div className="space-y-2">
                              <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src={`/storage/${appartement.images[0]}`}
                                  alt={appartement.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {appartement.images.length > 1 && (
                                <div className="flex gap-2">
                                  {appartement.images.slice(1, 4).map((image, index) => (
                                    <div key={index} className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                                      <img
                                        src={`/storage/${image}`}
                                        alt={appartement.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {appartement.images.length > 4 && (
                                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                                      <span className="text-white text-sm font-medium">+{appartement.images.length - 4}</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Home className="w-12 h-12 text-gray-400" />
                            </div>
                          )}

                          {/* Appartement Details */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">Price per night</span>
                              </div>
                              <span className="font-bold text-lg text-green-600">${appartement.price_per_night}</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Bed className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">{appartement.bedrooms} beds</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Bath className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-600">{appartement.bathrooms} baths</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-orange-600" />
                                <span className="text-gray-600">{appartement.max_guests} guests</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate">{appartement.address}</span>
                            </div>

                            {/* Amenities */}
                            {appartement.amenities && appartement.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {appartement.amenities.slice(0, 3).map((amenity, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                                {appartement.amenities.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{appartement.amenities.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
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

export default AppartementAdminPage; 