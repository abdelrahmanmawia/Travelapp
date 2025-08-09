import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FileText, Globe, Calendar, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';

const VisaServicePage: React.FC = () => {
  const [countryOfBirth, setCountryOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [residenceCountry, setResidenceCountry] = useState('');
  const [validity, setValidity] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryOfBirth || !dateOfBirth || !residenceCountry || !validity) {
      toast({ 
        title: 'Error', 
        description: 'All fields are required', 
        variant: 'destructive' 
      });
      return;
    }

    setLoading(true);
    try {
      await api.post('/visa-services', {
        country_of_birth: countryOfBirth,
        date_of_birth: dateOfBirth,
        residence_country: residenceCountry,
        validity: parseInt(validity),
      });
      
      toast({ 
        title: 'Success', 
        description: 'Visa service request submitted successfully! Our team will contact you soon.' 
      });
      
      // Reset form
      setCountryOfBirth('');
      setDateOfBirth('');
      setResidenceCountry('');
      setValidity('');
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Visa Services
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert assistance with visa applications and documentation for seamless travel to Morocco. 
              We handle all types of visas with professional guidance and support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <FileText className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Visa Types We Handle</CardTitle>
                    <CardDescription>Professional visa application services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Tourist Visa</h4>
                      <p className="text-sm text-gray-600">For leisure and sightseeing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Business Visa</h4>
                      <p className="text-sm text-gray-600">For business meetings and conferences</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Student Visa</h4>
                      <p className="text-sm text-gray-600">For educational purposes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold">Work Visa</h4>
                      <p className="text-sm text-gray-600">For employment opportunities</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">What We Provide:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Document preparation and review</li>
                    <li>• Application submission assistance</li>
                    <li>• Embassy coordination</li>
                    <li>• Status tracking and updates</li>
                    <li>• 24/7 support throughout the process</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Visa Application Form</CardTitle>
                <CardDescription>
                  Please provide your details to start your visa application process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="countryOfBirth">Country of Birth</Label>
                    <Input 
                      id="countryOfBirth" 
                      type="text" 
                      value={countryOfBirth} 
                      onChange={e => setCountryOfBirth(e.target.value)} 
                      required 
                      className="mt-1"
                      placeholder="Enter your country of birth"
                    />
            </div>
                  
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      value={dateOfBirth} 
                      onChange={e => setDateOfBirth(e.target.value)} 
                      required 
                      className="mt-1"
                    />
            </div>
                  
            <div>
              <Label htmlFor="residenceCountry">Country of Residence</Label>
                    <Input 
                      id="residenceCountry" 
                      type="text" 
                      value={residenceCountry} 
                      onChange={e => setResidenceCountry(e.target.value)} 
                      required 
                      className="mt-1"
                      placeholder="Enter your current country of residence"
                    />
            </div>
                  
            <div>
                    <Label htmlFor="validity">Visa Validity (days)</Label>
                    <Select value={validity} onValueChange={setValidity}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select visa validity period" />
                </SelectTrigger>
                <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-orange-600 hover:bg-orange-700" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Visa Application'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
          </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default VisaServicePage; 