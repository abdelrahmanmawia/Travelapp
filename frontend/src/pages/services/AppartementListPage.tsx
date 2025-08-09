import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Home, DollarSign, MapPin, ArrowRight, Search, Filter, Users } from 'lucide-react';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

interface Appartement {
  id: number;
  address: string;
  price: number;
  rooms: number;
  available: boolean;
  images: string[];
}

const AppartementListPage: React.FC = () => {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [filteredAppartements, setFilteredAppartements] = useState<Appartement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppartements();
  }, []);

  useEffect(() => {
    filterAppartements();
  }, [appartements, searchTerm, roomFilter, priceFilter]);

  const fetchAppartements = async () => {
    try {
      const response = await api.get('/appartements');
      setAppartements(response.data);
    } catch (error) {
      console.error('Failed to fetch appartements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppartements = () => {
    let filtered = appartements;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appartement =>
        appartement.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Room filter
    if (roomFilter && roomFilter !== 'all') {
      const roomCount = parseInt(roomFilter);
      filtered = filtered.filter(appartement => appartement.rooms === roomCount);
    }

    // Price filter
    if (priceFilter && priceFilter !== 'all') {
      const maxPrice = parseInt(priceFilter);
      filtered = filtered.filter(appartement => appartement.price <= maxPrice);
    }

    setFilteredAppartements(filtered);
  };

  const handleAppartementSelect = (appartementId: number) => {
    navigate(`/services/live-in-morocco?appartement=${appartementId}`);
  };

  const getRoomOptions = () => {
    const rooms = [...new Set(appartements.map(appartement => appartement.rooms))];
    return rooms.sort((a, b) => a - b);
  };

  const getPriceRanges = () => {
    const prices = appartements.map(appartement => appartement.price);
    const maxPrice = Math.max(...prices);
    return [
      { value: '500', label: 'Under $500' },
      { value: '1000', label: 'Under $1,000' },
      { value: '2000', label: 'Under $2,000' },
      { value: '5000', label: 'Under $5,000' },
      { value: maxPrice.toString(), label: 'All Prices' }
    ];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appartements...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Available Appartements
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your perfect home in Morocco. All appartements are carefully selected 
              and come with full support for your relocation needs.
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
                    placeholder="Search by address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rooms</label>
                <Select value={roomFilter} onValueChange={setRoomFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All rooms" />
                  </SelectTrigger>
                                      <SelectContent>
                      <SelectItem value="all">All rooms</SelectItem>
                      {getRoomOptions().map(room => (
                        <SelectItem key={room} value={room.toString()}>
                          {room} {room === 1 ? 'Room' : 'Rooms'}
                        </SelectItem>
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
                      setRoomFilter('all');
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
              Showing {filteredAppartements.length} of {appartements.length} appartements
            </p>
          </div>

          {/* Appartements Grid */}
          {filteredAppartements.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appartements found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAppartements.map((appartement) => (
                <Card 
                  key={appartement.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-500"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={appartement.available ? "default" : "secondary"}>
                        {appartement.available ? "Available" : "Unavailable"}
                      </Badge>
                      <Home className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{appartement.address}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">
                      {appartement.rooms} {appartement.rooms === 1 ? 'Room' : 'Rooms'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">${appartement.price}/month</span>
                      </div>
                      
                      {appartement.images && appartement.images.length > 0 && (
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={appartement.images[0]} 
                            alt={appartement.address}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <Button 
                        className="w-full group-hover:bg-green-600 transition-colors"
                        disabled={!appartement.available}
                        onClick={() => handleAppartementSelect(appartement.id)}
                      >
                        {appartement.available ? 'Select This Appartement' : 'Currently Unavailable'}
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

export default AppartementListPage; 