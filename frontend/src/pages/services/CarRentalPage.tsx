import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';

const CarRentalPage: React.FC = () => {
  const [carName, setCarName] = useState('');
  const [price, setPrice] = useState('');
  const [licenseAge, setLicenseAge] = useState('');
  const [licensePhoto, setLicensePhoto] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carName || !price || !licenseAge || !licensePhoto) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/car-rentals', {
        car_name: carName,
        price: parseFloat(price),
        license_age: parseInt(licenseAge, 10),
        license_photo: licensePhoto,
      });
      toast({ title: 'Success', description: 'Car rental request submitted!' });
      setCarName('');
      setPrice('');
      setLicenseAge('');
      setLicensePhoto('');
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
          <h2 className="text-3xl font-bold text-center text-moroccan-primary mb-2">Car Rental</h2>
          <p className="text-center text-muted-foreground mb-6">
            Rent a premium vehicle for your Moroccan journey. Fill out the form below and our team will assist you with the best options and support.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="carName">Car Name</Label>
              <Input id="carName" type="text" value={carName} onChange={e => setCarName(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="licenseAge">License Age (years)</Label>
              <Input id="licenseAge" type="number" value={licenseAge} onChange={e => setLicenseAge(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="licensePhoto">License Photo (URL or base64)</Label>
              <Input id="licensePhoto" type="text" value={licensePhoto} onChange={e => setLicensePhoto(e.target.value)} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CarRentalPage; 