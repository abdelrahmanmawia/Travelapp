import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Car, DollarSign, MapPin, ArrowRight, Search, Filter } from 'lucide-react';
import api from '@/lib/api';
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

const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, brandFilter, priceFilter]);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = cars;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (brandFilter && brandFilter !== 'all') {
      filtered = filtered.filter(car => car.brand === brandFilter);
    }

    // Price filter
    if (priceFilter && priceFilter !== 'all') {
      const maxPrice = parseInt(priceFilter);
      filtered = filtered.filter(car => car.price <= maxPrice);
    }

    setFilteredCars(filtered);
  };

  const handleCarSelect = (carId: number) => {
    navigate(`/services/car-rental?car=${carId}`);
  };

  const getBrands = () => {
    const brands = [...new Set(cars.map(car => car.brand))];
    return brands.sort();
  };

  const getPriceRanges = () => {
    const prices = cars.map(car => car.price);
    const maxPrice = Math.max(...prices);
    return [
      { value: '50', label: 'Under $50' },
      { value: '100', label: 'Under $100' },
      { value: '200', label: 'Under $200' },
      { value: '500', label: 'Under $500' },
      { value: maxPrice.toString(), label: 'All Prices' }
    ];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Cars
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our premium fleet of vehicles. All cars come with full insurance, 
              GPS navigation, and 24/7 roadside assistance.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All brands" />
                  </SelectTrigger>
                                      <SelectContent>
                      <SelectItem value="all">All brands</SelectItem>
                      {getBrands().map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                                      <SelectContent>
                      <SelectItem value="all">All prices</SelectItem>
                      {getPriceRanges().map(range => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setBrandFilter('all');
                      setPriceFilter('all');
                    }}
                    className="w-full"
                  >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
              </div>
            </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredCars.length} of {cars.length} cars
            </p>
          </div>

          {/* Cars Grid */}
          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card 
                  key={car.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500"
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
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <Button 
                        className="w-full group-hover:bg-blue-600 transition-colors"
                        disabled={!car.available}
                        onClick={() => handleCarSelect(car.id)}
                      >
                        {car.available ? 'Rent This Car' : 'Currently Unavailable'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CarListPage; 