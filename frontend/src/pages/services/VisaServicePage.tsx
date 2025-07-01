import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
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
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/visa-services', {
        country_of_birth: countryOfBirth,
        date_of_birth: dateOfBirth,
        residence_country: residenceCountry,
        validity,
      });
      toast({ title: 'Success', description: 'Visa service request submitted!' });
      setCountryOfBirth('');
      setDateOfBirth('');
      setResidenceCountry('');
      setValidity('');
    } catch (err: any) {
      toast({ title: 'Submission Failed', description: err.response?.data?.message || 'Error submitting request', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg space-y-6">
          <h2 className="text-3xl font-bold text-center text-moroccan-primary mb-2">Visa Services</h2>
          <p className="text-center text-muted-foreground mb-6">
            Get expert assistance with your Moroccan visa application. Fill out the form below and our team will guide you through the process for a seamless experience.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="countryOfBirth">Country of Birth</Label>
              <Input id="countryOfBirth" type="text" value={countryOfBirth} onChange={e => setCountryOfBirth(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="residenceCountry">Country of Residence</Label>
              <Input id="residenceCountry" type="text" value={residenceCountry} onChange={e => setResidenceCountry(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="validity">Visa Validity</Label>
              <Select value={validity} onValueChange={setValidity} required>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select visa validity period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="60 days">60 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                  {/* <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="1 year">1 year</SelectItem>
                  <SelectItem value="2 years">2 years</SelectItem>
                  <SelectItem value="5 years">5 years</SelectItem>
                  <SelectItem value="10 years">10 years</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VisaServicePage; 