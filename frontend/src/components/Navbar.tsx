import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-moroccan-primary to-moroccan-secondary flex items-center justify-center">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-moroccan-primary">
            MoroccoTravel
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a
            href="/#services"
            className="text-sm font-medium hover:text-moroccan-primary transition-colors"
          >
            Services
          </a>
          <a
            href="/#gallery"
            className="text-sm font-medium hover:text-moroccan-primary transition-colors"
          >
            Gallery
          </a>
          <a
            href="/#testimonials"
            className="text-sm font-medium hover:text-moroccan-primary transition-colors"
          >
            Reviews
          </a>
          <a
            href="/#contact"
            className="text-sm font-medium hover:text-moroccan-primary transition-colors"
          >
            Contact
          </a>
          {user?.is_admin ? (
            <Button
              variant="outline"
              className="border-moroccan-primary text-moroccan-primary"
              onClick={() => navigate("/admin/dashboard")}
            >
              Admin Dashboard
            </Button>
          ) : null}
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <Button
              className="bg-moroccan-primary hover:bg-moroccan-primary/90"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Button
              className="bg-moroccan-primary hover:bg-moroccan-primary/90"
              onClick={logout}
            >
              Logout
            </Button>
          )}
          <Button
            className="bg-moroccan-primary hover:bg-moroccan-primary/90"
            onClick={() => navigate("/services/visa")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 