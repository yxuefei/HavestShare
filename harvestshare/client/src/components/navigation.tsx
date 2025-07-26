import { Link, useLocation } from "wouter";
import { TreePine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [location] = useLocation();

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
            <Link href="/register" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}