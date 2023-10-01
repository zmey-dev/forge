
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Copy, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const QuoteWelcome: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
        <Link to="/quotes/create" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-company-blue">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full">
              <div className="bg-company-blue text-white p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <FileText size={24} className="sm:w-9 sm:h-9" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-company-blue mb-2">Create New Quotation</h2>
              <p className="text-company-gray mb-4 sm:mb-6 flex-grow text-sm sm:text-base">
                Start a new quote from scratch with customer details, product configurations, and pricing.
                Ideal for new projects or customers.
              </p>
              <ul className="text-left text-xs sm:text-sm text-company-gray mb-4 sm:mb-6 w-full">
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Set up customer and contact information</span>
                </li>
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Configure electrical specifications</span>
                </li>
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Build custom bill of materials</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Generate accurate pricing</span>
                </li>
              </ul>
              <Button className="w-full text-sm sm:text-base bg-company-blue hover:bg-company-lightBlue group">
                Create New
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/quotes/replicate" className="block">
          <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-company-blue">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full">
              <div className="bg-company-blue text-white p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <Copy size={24} className="sm:w-9 sm:h-9" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-company-blue mb-2">Replicate Existing</h2>
              <p className="text-company-gray mb-4 sm:mb-6 flex-grow text-sm sm:text-base">
                Find and replicate an existing quote, making adjustments for a new customer or project.
                Perfect for similar projects with different customers.
              </p>
              <ul className="text-left text-xs sm:text-sm text-company-gray mb-4 sm:mb-6 w-full">
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Search and filter existing quotes</span>
                </li>
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Update customer information</span>
                </li>
                <li className="mb-2 flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Maintain technical specifications</span>
                </li>
                <li className="flex items-start">
                  <div className="min-w-4 mr-2 text-company-blue flex-shrink-0">✓</div>
                  <span>Adjust pricing as needed</span>
                </li>
              </ul>
              <Button className="w-full text-sm sm:text-base bg-company-blue hover:bg-company-lightBlue group">
                Replicate Quote
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default QuoteWelcome;
