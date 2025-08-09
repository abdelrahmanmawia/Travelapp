import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';

interface Appartement {
  id: number;
  address: string;
  price: number;
  rooms: number;
  available: boolean;
  images: string[];
}

const AppartementAdminPage: React.FC = () => {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [form, setForm] = useState<Partial<Appartement>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchAppartements = async () => {
    const res = await api.get('/appartements');
    setAppartements(res.data);
  };

  useEffect(() => { fetchAppartements(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.post('/admin/appartements/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(prev => ({ ...prev, images: [...(prev.images || []), res.data.url] }));
      toast({ title: 'Image uploaded' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.response?.data?.message || 'Error uploading image', variant: 'destructive' });
    }
  };
  const handleRemoveImage = (url: string) => {
    setForm(prev => ({ ...prev, images: (prev.images || []).filter(img => img !== url) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/appartements/${editingId}`, form);
        toast({ title: 'Appartement updated' });
      } else {
        await api.post('/admin/appartements', form);
        toast({ title: 'Appartement added' });
      }
      setForm({});
      setEditingId(null);
      fetchAppartements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed', variant: 'destructive' });
    }
  };

  const handleEdit = (appartement: Appartement) => {
    setForm(appartement);
    setEditingId(appartement.id);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this appartement?')) return;
    await api.delete(`/admin/appartements/${id}`);
    fetchAppartements();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Appartements</h1>
        <form onSubmit={handleSubmit} className="space-y-2 mb-6">
          <Input name="address" placeholder="Address" value={form.address || ''} onChange={handleChange} />
          <Input name="price" type="number" placeholder="Price" value={form.price || ''} onChange={handleChange} />
          <Input name="rooms" type="number" placeholder="Rooms" value={form.rooms || ''} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <div className="flex gap-2 flex-wrap mt-2">
            {(form.images || []).map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="appartement" className="w-20 h-16 object-cover rounded" />
                <button type="button" onClick={() => handleRemoveImage(img)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs opacity-80 group-hover:opacity-100">x</button>
              </div>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.available ?? true} onChange={e => setForm({ ...form, available: e.target.checked })} /> Available
          </label>
          <Button type="submit">{editingId ? 'Update' : 'Add'} Appartement</Button>
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({}); }}>Cancel</Button>}
        </form>
        <div className="space-y-2">
          {appartements.map(appartement => (
            <div key={appartement.id} className="border p-2 rounded flex justify-between items-center">
              <div>
                <div className="font-bold">{appartement.address}</div>
                <div>Price: ${appartement.price}</div>
                <div>Rooms: {appartement.rooms}</div>
                <div>Available: {appartement.available ? 'Yes' : 'No'}</div>
                <div>Images: {appartement.images?.join(', ')}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleEdit(appartement)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(appartement.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppartementAdminPage; 