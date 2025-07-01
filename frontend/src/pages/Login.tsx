import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../lib/AuthContext';
import Navbar from '@/components/Navbar';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Error', description: 'Email and password are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      login(response.data.user);
      
      // Store token in localStorage for API calls
      localStorage.setItem('token', response.data.token);
      
      toast({ title: 'Success', description: 'Logged in successfully' });
      
      // Navigate based on user role
      if (response.data.user.is_admin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: 'Login Failed', description: err.response?.data?.message || 'Invalid credentials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          <div className="text-center text-sm">
            Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login; 