
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, HelpCircle, Menu, X } from "lucide-react";

type User = {
  name: string;
  role: "Admin" | "User";
};

interface AppHeaderProps {
  currentUser?: User;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-company-blue text-white shadow-md">
      <div className="container mx-auto py-3 px-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Company Logo */}
          <Link to="/" className="flex items-center">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
            <span className="text-lg sm:text-xl font-bold">QuoteBuilder Pro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex ml-8 space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/quotes/create" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/quotes/create' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Create Quote
            </Link>
            <Link 
              to="/quotes/replicate" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/quotes/replicate' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Replicate Quote
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {currentUser && (
            <div className="text-xs sm:text-sm hidden md:block">
              <span className="opacity-75">Welcome, </span>
              <span className="font-medium">{currentUser.name}</span>
              <span className="ml-2 bg-company-lightBlue text-white text-xs px-2 py-0.5 rounded">
                {currentUser.role}
              </span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-company-blue text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
          >
            <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span>Help</span>
          </Button>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="md:hidden text-white hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-company-blue border-t border-white/10 animate-in slide-in-from-top">
          <nav className="container mx-auto py-3 px-4 flex flex-col space-y-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/quotes/create" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/quotes/create' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Quote
            </Link>
            <Link 
              to="/quotes/replicate" 
              className={`px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/quotes/replicate' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Replicate Quote
            </Link>
            
            {currentUser && (
              <div className="px-3 py-2 text-xs flex items-center">
                <span className="opacity-75 mr-1">Welcome, </span>
                <span className="font-medium">{currentUser.name}</span>
                <span className="ml-2 bg-company-lightBlue text-white text-xs px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
