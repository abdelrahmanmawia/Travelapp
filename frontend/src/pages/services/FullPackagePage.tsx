import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';

const SERVICE_OPTIONS = [
  { key: 'visa', label: 'Visa' },
  { key: 'air_ticket', label: 'Air Ticket' },
  { key: 'transport', label: 'Transport' },
  { key: 'program', label: 'Program' },
];

const FullPackagePage: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckboxChange = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selected.length === 0 || totalPrice === '') {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // Prepare the payload as required by backend (each as array)
    const payload: any = {
      visa: selected.includes('visa') ? ['yes'] : [],
      air_ticket: selected.includes('air_ticket') ? ['yes'] : [],
      transport: selected.includes('transport') ? ['yes'] : [],
      program: selected.includes('program') ? ['yes'] : [],
      total_price: parseFloat(totalPrice),
    };
    try {
      await api.post('/full-packages', payload);
      toast({ title: 'Success', description: 'Full package request submitted!' });
      setSelected([]);
      setTotalPrice('');
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
          <h2 className="text-3xl font-bold text-center text-moroccan-primary mb-2">Full Package</h2>
          <p className="text-center text-muted-foreground mb-6">
            Book an all-inclusive Moroccan experience. Select the services you want included in your package.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Services Included</Label>
              <div className="flex flex-col gap-2 mt-2">
                {SERVICE_OPTIONS.map(option => (
                  <label key={option.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(option.key)}
                      onChange={() => handleCheckboxChange(option.key)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="totalPrice">Total Price</Label>
              <input id="totalPrice" type="number" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} required className="mt-1 border rounded px-2 py-1 w-full" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FullPackagePage; 