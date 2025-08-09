import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  Home, 
  FileText, 
  Package, 
  CreditCard, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin/dashboard',
      color: 'text-blue-600'
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/users',
      color: 'text-green-600'
    },
    {
      title: 'Cars',
      icon: <Car className="h-5 w-5" />,
      href: '/admin/cars',
      color: 'text-purple-600'
    },
    {
      title: 'Appartements',
      icon: <Home className="h-5 w-5" />,
      href: '/admin/appartements',
      color: 'text-orange-600'
    },
    {
      title: 'Visa Services',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/visa-services',
      color: 'text-red-600'
    },
    {
      title: 'Car Rentals',
      icon: <Car className="h-5 w-5" />,
      href: '/admin/car-rentals',
      color: 'text-indigo-600'
    },
    {
      title: 'Live Services',
      icon: <Home className="h-5 w-5" />,
      href: '/admin/live-services',
      color: 'text-teal-600'
    },
    {
      title: 'Full Packages',
      icon: <Package className="h-5 w-5" />,
      href: '/admin/full-packages',
      color: 'text-pink-600'
    },
    {
      title: 'Payments',
      icon: <CreditCard className="h-5 w-5" />,
      href: '/admin/payments',
      color: 'text-emerald-600'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className={item.color}>
              {item.icon}
            </div>
            {!isCollapsed && (
              <span className="font-medium">{item.title}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            to="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/admin/settings')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
          
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="font-medium ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
