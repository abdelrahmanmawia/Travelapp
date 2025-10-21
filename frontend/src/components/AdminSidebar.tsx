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
    <div className={`bg-white border-r border-gray-200 h-screen transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`flex items-center p-4 border-b border-gray-200 ${
        isCollapsed ? 'justify-center' : 'justify-between'
      }`}>
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
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center rounded-lg transition-colors ${
              isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'
            } ${
              isActive(item.href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={isCollapsed ? item.title : ''}
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
      <div className="p-2 border-t border-gray-200 space-y-1">
        <Link
          to="/admin/settings"
          className={`flex items-center rounded-lg transition-colors ${
            isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'
          } ${
            isActive('/admin/settings')
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}
          title={isCollapsed ? 'Settings' : ''}
        >
          <Settings className="h-5 w-5 text-gray-700" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </Link>
        
        <button
          onClick={logout}
          className={`flex items-center w-full rounded-lg transition-colors text-red-600 hover:text-red-700 hover:bg-red-50 ${
            isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;