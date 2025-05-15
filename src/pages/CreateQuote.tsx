
import React from 'react';
import AppHeader from '@/components/AppHeader';
import CreateQuoteForm from '@/components/CreateQuoteForm';
import { getCurrentUser } from '@/services/mockDataService';

const CreateQuote = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader currentUser={currentUser} />
      <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-company-blue mb-2 sm:mb-4">Create New Quote</h1>
        <p className="text-company-gray mb-3 sm:mb-6 text-xs sm:text-sm md:text-base max-w-3xl">
          Fill out the form below to create a new quote. All fields marked with an asterisk (*) are required.
          The quote number will be generated automatically.
        </p>
        <CreateQuoteForm />
      </div>
    </div>
  );
};

export default CreateQuote;
