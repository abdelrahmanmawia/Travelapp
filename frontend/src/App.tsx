import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VisaServicePage from "@/pages/services/VisaServicePage";
import CarRentalPage from "@/pages/services/CarRentalPage";
import LiveInMoroccoPage from "@/pages/services/LiveInMoroccoPage";
import FullPackagePage from "@/pages/services/FullPackagePage";
import AdminDashboard from "@/pages/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/lib/AuthContext";
import VisaServiceAdminPage from '@/pages/admin/VisaServiceAdminPage';
import CarRentalAdminPage from '@/pages/admin/CarRentalAdminPage';
import FullPackageAdminPage from '@/pages/admin/FullPackageAdminPage';
import LiveInMoroccoAdminPage from '@/pages/admin/LiveInMoroccoAdminPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services/visa" element={<VisaServicePage />} />
            <Route path="/services/car-rental" element={<CarRentalPage />} />
            <Route path="/services/live-in-morocco" element={<LiveInMoroccoPage />} />
            <Route path="/services/full-package" element={<FullPackagePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <UsersPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/visa-services" element={
              <ProtectedRoute requireAdmin={true}>
                <VisaServiceAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/car-rentals" element={
              <ProtectedRoute requireAdmin={true}>
                <CarRentalAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/full-packages" element={
              <ProtectedRoute requireAdmin={true}>
                <FullPackageAdminPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/live-services" element={
              <ProtectedRoute requireAdmin={true}>
                <LiveInMoroccoAdminPage />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
