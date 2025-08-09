import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { MapPin, DollarSign, Home, ArrowRight, Users } from 'lucide-react';
import api from '../../lib/api';
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

const LiveInMoroccoPage: React.FC = () => {
  const navigate = useNavigate();
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [selectedAppartementId, setSelectedAppartementId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppartements();
  }, []);

  const fetchAppartements = async () => {
    try {
      const response = await api.get('/appartements');
      setAppartements(response.data);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to load appartements', 
        variant: 'destructive' 
      });
    }
  };

  const handleAppartementSelect = (appartementId: string) => {
    setSelectedAppartementId(appartementId);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppartementId) {
      toast({ 
        title: 'Error', 
        description: 'Please select an appartement', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/live-services', {
        appartement_id: parseInt(selectedAppartementId),
      });
      
      toast({ 
        title: 'Success', 
        description: 'Live in Morocco service request submitted successfully! Our team will contact you soon.' 
      });
      
      // Reset form
      setSelectedAppartementId('');
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Live in Morocco Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose your perfect appartement and let us help you settle in Morocco. 
              We provide complete relocation support including housing, legal assistance, and cultural integration.
            </p>
          </div>

          {!showForm ? (
            /* Appartement Selection Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {appartements.map((appartement) => (
                <Card 
                  key={appartement.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-green-500"
                  onClick={() => handleAppartementSelect(appartement.id.toString())}
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
                            className="w-full h-full object-cover"
                          />
            </div>
                      )}
                      
                      <Button 
                        className="w-full group-hover:bg-green-600 transition-colors"
                        disabled={!appartement.available}
                      >
                        Select This Appartement
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
              </div>
                  </CardContent>
                </Card>
                ))}
              </div>
          ) : (
            /* Service Confirmation Form */
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Confirm Your Live in Morocco Service</CardTitle>
                  <CardDescription>
                    You're about to book our comprehensive Live in Morocco service. 
                    This includes housing, legal support, and cultural integration assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Service Details */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-3">What's Included:</h3>
                      <ul className="space-y-2 text-green-700">
                        <li className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Housing assistance and appartement setup
                        </li>
                        <li className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Legal documentation and visa support
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Cultural integration and local guidance
                        </li>
                        <li className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          24/7 support and emergency assistance
                        </li>
                      </ul>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowForm(false)}
                        >
                          Back to Appartements
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1" 
                          disabled={loading}
                        >
                          {loading ? 'Submitting...' : 'Confirm Service Request'}
                        </Button>
            </div>
          </form>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LiveInMoroccoPage; 