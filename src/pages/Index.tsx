
import React from 'react';
import AppHeader from '@/components/AppHeader';
import QuoteWelcome from '@/components/QuoteWelcome';
import { getCurrentUser } from '@/services/mockDataService';
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader currentUser={currentUser} />
      
      <div className="container mx-auto py-3 px-3 sm:py-6 sm:px-6">
        <div className="max-w-4xl mx-auto mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-company-blue mb-3">
            Welcome to QuoteBuilder Pro
          </h1>
          <Card className="bg-white/80 mb-3 sm:mb-6">
            <CardContent className="p-3 sm:p-6">
              <p className="text-sm sm:text-base text-company-gray mb-3">
                This tool helps you create accurate and personalized quotes for customers, ready for manufacturing when needed.
                Select an option below to get started.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-company-gray">
                <div className="flex items-start">
                  <div className="bg-company-blue rounded-full p-1 text-white mr-2 flex-shrink-0">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 text-center text-xs sm:text-sm">1</span>
                  </div>
                  <p>Create new quotations from scratch with customer details, specifications, and pricing.</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-company-blue rounded-full p-1 text-white mr-2 flex-shrink-0">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 text-center text-xs sm:text-sm">2</span>
                  </div>
                  <p>Replicate existing quotes to save time when creating similar quotations for different customers.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
        <QuoteWelcome />
      </div>
    </div>
  );
};

export default Index;
