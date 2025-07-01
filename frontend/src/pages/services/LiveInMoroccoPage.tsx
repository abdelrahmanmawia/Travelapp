import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';
import api from '../../lib/api';
import Navbar from '@/components/Navbar';

const LiveInMoroccoPage: React.FC = () => {
  const [housing, setHousing] = useState(false);
  const [simCard, setSimCard] = useState(false);
  const [adminSupport, setAdminSupport] = useState(false);
  const [price, setPrice] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [mediaInput, setMediaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddMedia = () => {
    if (mediaInput) {
      setMedia([...media, mediaInput]);
      setMediaInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (price === '') {
      toast({ title: 'Error', description: 'Price is required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/live-services', {
        housing,
        sim_card: simCard,
        admin_support: adminSupport,
        price: parseFloat(price),
        media: media.length > 0 ? media : undefined,
      });
      toast({ title: 'Success', description: 'Live in Morocco request submitted!' });
      setHousing(false);
      setSimCard(false);
      setAdminSupport(false);
      setPrice('');
      setMedia([]);
      setMediaInput('');
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
          <h2 className="text-3xl font-bold text-center text-moroccan-primary mb-2">Live in Morocco</h2>
          <p className="text-center text-muted-foreground mb-6">
            Relocate and thrive in Morocco with our complete support. Choose your needs and let us help you settle in with ease.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="housing">Housing</Label>
              <input id="housing" type="checkbox" checked={housing} onChange={e => setHousing(e.target.checked)} />
              <Label htmlFor="simCard">SIM Card</Label>
              <input id="simCard" type="checkbox" checked={simCard} onChange={e => setSimCard(e.target.checked)} />
              <Label htmlFor="adminSupport">Admin Support</Label>
              <input id="adminSupport" type="checkbox" checked={adminSupport} onChange={e => setAdminSupport(e.target.checked)} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="media">Media (optional, add URLs or descriptions)</Label>
              <div className="flex gap-2">
                <Input id="media" type="text" value={mediaInput} onChange={e => setMediaInput(e.target.value)} className="mt-1" />
                <Button type="button" onClick={handleAddMedia}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {media.map((m, idx) => (
                  <span key={idx} className="px-2 py-1 bg-moroccan-primary/10 rounded text-sm">{m}</span>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Request'}</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LiveInMoroccoPage; 