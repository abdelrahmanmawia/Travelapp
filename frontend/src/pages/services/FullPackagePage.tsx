import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Package, Plane, Car, MapPin, Home, ArrowRight, CheckCircle, Star } from 'lucide-react';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';

const FullPackagePage: React.FC = () => {
  const [visa, setVisa] = useState(false);
  const [airTicket, setAirTicket] = useState(false);
  const [transport, setTransport] = useState(false);
  const [program, setProgram] = useState(false);
  const [airportPickup, setAirportPickup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visa && !airTicket && !transport && !program && !airportPickup) {
      toast({ 
        title: 'Error', 
        description: 'Please select at least one service', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/full-packages', {
        visa,
        air_ticket: airTicket,
        transport,
        program,
        airport_pickup: airportPickup,
      });
      
      toast({ 
        title: 'Success', 
        description: 'Full package request submitted successfully! Our team will contact you soon.' 
      });
      
      // Reset form
      setVisa(false);
      setAirTicket(false);
      setTransport(false);
      setProgram(false);
      setAirportPickup(false);
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

  const serviceOptions = [
    {
      id: 'visa',
      title: 'Visa Services',
      description: 'Complete visa application assistance',
      icon: <CheckCircle className="h-5 w-5" />,
      checked: visa,
      onChange: setVisa,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'airTicket',
      title: 'Air Tickets',
      description: 'Flight booking and reservation',
      icon: <Plane className="h-5 w-5" />,
      checked: airTicket,
      onChange: setAirTicket,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'transport',
      title: 'Transportation',
      description: 'Airport transfers and local transport',
      icon: <Car className="h-5 w-5" />,
      checked: transport,
      onChange: setTransport,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'program',
      title: 'Tour Program',
      description: 'Customized tour itineraries',
      icon: <MapPin className="h-5 w-5" />,
      checked: program,
      onChange: setProgram,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'airportPickup',
      title: 'Airport Pickup',
      description: 'Meet and greet at airport',
      icon: <Home className="h-5 w-5" />,
      checked: airportPickup,
      onChange: setAirportPickup,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Full Package Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create your perfect Moroccan experience with our comprehensive travel packages. 
              Choose the services you need and let us handle everything for you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
            <div>
                    <CardTitle className="text-2xl">Select Your Services</CardTitle>
                    <CardDescription>Choose the services you want included in your package</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {serviceOptions.map((option) => (
                      <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={option.id}
                          checked={option.checked}
                          onCheckedChange={option.onChange}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded ${option.color}`}>
                              {option.icon}
                            </div>
                            <Label htmlFor={option.id} className="text-lg font-semibold cursor-pointer">
                              {option.title}
                            </Label>
                          </div>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                        </div>
                      </div>
                ))}
              </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Package Request'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Package Information */}
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">What's Included</CardTitle>
                  <CardDescription>Comprehensive travel solutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Personalized Planning</h4>
                        <p className="text-sm text-gray-600">Custom itineraries tailored to your preferences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">24/7 Support</h4>
                        <p className="text-sm text-gray-600">Round-the-clock assistance throughout your journey</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Local Expertise</h4>
                        <p className="text-sm text-gray-600">Insider knowledge and authentic experiences</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Star className="h-5 w-5 text-purple-600" />
                      <div>
                        <h4 className="font-semibold">Quality Assurance</h4>
                        <p className="text-sm text-gray-600">Carefully selected partners and accommodations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Why Choose Our Packages?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Seamless Experience</h4>
                        <p className="text-sm text-gray-600">Everything is coordinated and managed for you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Cost Effective</h4>
                        <p className="text-sm text-gray-600">Bundled services at competitive rates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
                        <h4 className="font-semibold">Flexible Options</h4>
                        <p className="text-sm text-gray-600">Choose only the services you need</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FullPackagePage; 