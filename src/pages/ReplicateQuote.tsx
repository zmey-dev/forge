
import React from 'react';
import AppHeader from '@/components/AppHeader';
import ReplicateQuoteForm from '@/components/ReplicateQuoteForm';
import { getCurrentUser } from '@/services/mockDataService';

const ReplicateQuote = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader currentUser={currentUser} />
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-company-blue mb-2 sm:mb-4">Replicate Existing Quote</h1>
        <p className="text-company-gray mb-3 sm:mb-6 text-xs sm:text-sm md:text-base max-w-3xl">
          Search for and replicate an existing quote. You can modify customer details and 
          specifications to create a new personalized quote based on an existing template.
        </p>
        <ReplicateQuoteForm />
      </div>
    </div>
  );
};

export default ReplicateQuote;
