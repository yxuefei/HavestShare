import { Link, useLocation } from "wouter";
import { TreePine, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [location, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Listen for localStorage changes (useful for cross-tab updates)
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('currentUser');
      setCurrentUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when user signs in/out in same tab
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem('currentUser');
      setCurrentUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('userChange', handleUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChange', handleUserChange);
    };
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    
    // Dispatch custom event to update navigation
    window.dispatchEvent(new Event('userChange'));
    
    setLocation('/');
  };

  const isActive = (path: string) => location === path || currentPage === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <TreePine className="text-primary text-2xl mr-2" />
                <span className="font-heading font-bold text-xl text-gray-900">HarvestShare</span>
              </Link>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/browse-properties" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/browse-properties') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}>
                Browse Properties
              </Link>
              <Link href="/how-it-works" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/how-it-works') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}>
                How It Works
              </Link>
              <Link href="/about" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}>
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {currentUser.name}
                </span>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}