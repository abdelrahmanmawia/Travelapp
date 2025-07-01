import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import Navbar from '@/components/Navbar';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !passwordConfirmation) {
      toast({ title: 'Error', description: 'All fields are required', variant: 'destructive' });
      return;
    }
    if (password !== passwordConfirmation) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.post('/register', { name, email, password, password_confirmation: passwordConfirmation });
      toast({ title: 'Success', description: 'Registered successfully. Please login.' });
      navigate('/login');
    } catch (err: any) {
      toast({ title: 'Registration Failed', description: err.response?.data?.message || 'Registration error', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <Input id="passwordConfirmation" type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
          <div className="text-center text-sm">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register; 