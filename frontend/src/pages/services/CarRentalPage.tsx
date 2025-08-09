import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Car, MapPin, DollarSign, Users, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  available: boolean;
  images: string[];
}

const CarRentalPage: React.FC = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<string>('');
  const [licenseAge, setLicenseAge] = useState('');
  const [licensePhoto, setLicensePhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load cars', 
        variant: 'destructive' 
      });
    }
  };

  const handleCarSelect = (carId: string) => {
    setSelectedCarId(carId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !licenseAge || !licensePhoto) {
      toast({ 
        title: 'Error', 
        description: 'All fields are required', 
        variant: 'destructive' 
      });
      return;
    }

    if (parseInt(licenseAge) < 18) {
      toast({ 
        title: 'Error', 
        description: 'License age must be at least 18 years', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/car-rentals', {
        car_id: parseInt(selectedCarId),
        license_age: parseInt(licenseAge),
        license_photo: licensePhoto,
      });
      
      toast({ 
        title: 'Success', 
        description: 'Car rental request submitted successfully! Our team will contact you soon.' 
      });
      
      // Reset form
      setSelectedCarId('');
      setLicenseAge('');
      setLicensePhoto('');
      setShowForm(false);
    } catch (err: any) {
      toast({ 
        title: 'Submission Failed', 
        description: err.response?.data?.message || 'Error submitting request', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Car Rental Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our premium fleet of vehicles and explore Morocco at your own pace. 
              All vehicles come with full insurance and 24/7 roadside assistance.
            </p>
          </div>

          {!showForm ? (
            /* Car Selection Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cars.map((car) => (
                <Card 
                  key={car.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
                  onClick={() => handleCarSelect(car.id.toString())}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={car.available ? "default" : "secondary"}>
                        {car.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{car.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">
                      {car.brand}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">${car.price}/day</span>
                      </div>
                      
                      {car.images && car.images.length > 0 && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={car.images[0]} 
                            alt={car.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <Button 
                        className="w-full group-hover:bg-blue-600 transition-colors"
                        disabled={!car.available}
                      >
                        Select This Car
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
            </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Rental Form */
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Complete Your Rental Request</CardTitle>
                  <CardDescription>
                    Please provide your license information to complete the booking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="licenseAge">License Age (years)</Label>
                      <Input 
                        id="licenseAge" 
                        type="number" 
                        min="18"
                        value={licenseAge} 
                        onChange={e => setLicenseAge(e.target.value)} 
                        required 
                        className="mt-1"
                        placeholder="Enter your license age"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Must be at least 18 years old
                      </p>
            </div>
                    
            <div>
                      <Label htmlFor="licensePhoto">License Photo URL</Label>
                      <Input 
                        id="licensePhoto" 
                        type="url" 
                        value={licensePhoto} 
                        onChange={e => setLicensePhoto(e.target.value)} 
                        required 
                        className="mt-1"
                        placeholder="https://example.com/license-photo.jpg"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Please upload your license photo to a cloud service and provide the URL
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowForm(false)}
                      >
                        Back to Cars
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1" 
                        disabled={loading}
                      >
                        {loading ? 'Submitting...' : 'Submit Request'}
                      </Button>
            </div>
          </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarRentalPage; 