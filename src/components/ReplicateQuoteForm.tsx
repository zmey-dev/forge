
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Quote,
  Account, 
  Contact
} from '@/types/models';
import { getExistingQuotes, getAccounts, generateQuoteNumber, getCurrentUser } from '@/services/mockDataService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { ChevronLeft } from "lucide-react";

const ReplicateQuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const [existingQuotes, setExistingQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [billingContact, setBillingContact] = useState<Contact | null>(null);
  const [salesContact, setSalesContact] = useState<Contact | null>(null);
  const [siteContact, setSiteContact] = useState<Contact | null>(null);
  const [newQuoteNumber, setNewQuoteNumber] = useState<string>("");
  const [projectNameFilter, setProjectNameFilter] = useState<string>("");
  const [projectNumberFilter, setProjectNumberFilter] = useState<string>("");
  const [filteringApplied, setFilteringApplied] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    const quotes = getExistingQuotes();
    setExistingQuotes(quotes);
    setFilteredQuotes(quotes);
    setAccounts(getAccounts());
    setNewQuoteNumber(generateQuoteNumber());
  }, []);

  // Reset contacts when account changes
  useEffect(() => {
    if (selectedAccount) {
      // Default to the primary billing contact if available
      const defaultBillingContact = selectedAccount.contacts.find(c => c.type === 'Billing');
      const defaultSalesContact = selectedAccount.contacts.find(c => c.type === 'Sales');
      const defaultSiteContact = selectedAccount.contacts.find(c => c.type === 'Site');
      
      setBillingContact(defaultBillingContact || null);
      setSalesContact(defaultSalesContact || null);
      setSiteContact(defaultSiteContact || null);
    } else {
      setBillingContact(null);
      setSalesContact(null);
      setSiteContact(null);
    }
  }, [selectedAccount]);

  // Handle applying filters to quotes
  const applyFilters = () => {
    let filtered = [...existingQuotes];
    
    if (projectNameFilter) {
      filtered = filtered.filter(q => 
        q.projectName.toLowerCase().includes(projectNameFilter.toLowerCase())
      );
    }
    
    if (projectNumberFilter) {
      filtered = filtered.filter(q => 
        q.projectNumber.toLowerCase().includes(projectNumberFilter.toLowerCase())
      );
    }
    
    setFilteredQuotes(filtered);
    setFilteringApplied(true);
    
    if (filtered.length === 0) {
      toast("No quotes match the applied filters. Try different criteria.");
    } else {
      toast.success(`Found ${filtered.length} matching quotes.`);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setProjectNameFilter("");
    setProjectNumberFilter("");
    setFilteredQuotes(existingQuotes);
    setFilteringApplied(false);
  };

  // Handle quote selection
  const handleSelectQuote = (quoteId: string) => {
    const quote = existingQuotes.find(q => q.id === quoteId);
    if (quote) {
      setSelectedQuote(quote);
      // Reset customer information for the new quote
      setSelectedAccount(null);
      setBillingContact(null);
      setSalesContact(null);
      setSiteContact(null);
    }
  };

  // Create replicated quote
  const handleCreateReplicate = () => {
    if (!selectedQuote) {
      toast.error("Please select a quote to replicate");
      return;
    }
    
    if (!selectedAccount) {
      toast.error("Please select a customer account for the new quote");
      return;
    }
    
    if (!billingContact || !salesContact || !siteContact) {
      toast.error("Please select all required contacts");
      return;
    }
    
    // In a real application, we would save the new quote to the database here
    // For this mock, we'll just show a success message
    toast.success("Quote replicated successfully!", {
      description: `New quote ${newQuoteNumber} created based on ${selectedQuote.quoteNumber}`
    });
    
    // Navigate back to home
    navigate("/");
  };

  return (
    <div className="w-full py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-company-blue">Replicate Existing Quotation</h2>
          <p className="text-sm text-company-gray mt-1">Find a quote and create a new one with modified customer info</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mt-2 sm:mt-0 text-sm flex items-center"
          size="sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>
      
      {!selectedQuote ? (
        // Step 1: Find an existing quote
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Find Quote to Replicate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input 
                  id="projectName" 
                  value={projectNameFilter} 
                  onChange={e => setProjectNameFilter(e.target.value)}
                  placeholder="Filter by project name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="projectNumber">Project Number</Label>
                <Input 
                  id="projectNumber" 
                  value={projectNumberFilter} 
                  onChange={e => setProjectNumberFilter(e.target.value)} 
                  placeholder="Filter by project number"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={applyFilters}
                className="bg-company-blue hover:bg-company-lightBlue w-full sm:w-auto text-sm"
                size="sm"
              >
                Apply Filters
              </Button>
              {filteringApplied && (
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="w-full sm:w-auto text-sm"
                  size="sm"
                >
                  Reset Filters
                </Button>
              )}
            </div>
            
            <Separator className="my-2" />
            
            <div>
              <h3 className="font-medium text-sm mb-2">{filteringApplied ? 'Matching Quotes' : 'Recent Quotes'}</h3>
              
              {filteredQuotes.length === 0 ? (
                <p className="text-company-gray italic text-sm">No quotes found</p>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <div className="overflow-hidden border border-gray-200 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-company-lightGray">
                          <tr>
                            <th className="p-2 text-left text-xs font-medium text-company-gray tracking-wider">Quote #</th>
                            <th className="p-2 text-left text-xs font-medium text-company-gray tracking-wider">Project</th>
                            <th className="hidden sm:table-cell p-2 text-left text-xs font-medium text-company-gray tracking-wider">Project #</th>
                            <th className="hidden sm:table-cell p-2 text-left text-xs font-medium text-company-gray tracking-wider">Customer</th>
                            <th className="hidden sm:table-cell p-2 text-left text-xs font-medium text-company-gray tracking-wider">Created</th>
                            <th className="p-2 text-center text-xs font-medium text-company-gray tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredQuotes.map(quote => (
                            <tr key={quote.id} className="hover:bg-gray-50">
                              <td className="p-2 whitespace-nowrap text-xs">{quote.quoteNumber}</td>
                              <td className="p-2 whitespace-nowrap text-xs">{quote.projectName}</td>
                              <td className="hidden sm:table-cell p-2 whitespace-nowrap text-xs">{quote.projectNumber}</td>
                              <td className="hidden sm:table-cell p-2 whitespace-nowrap text-xs">{quote.account?.name}</td>
                              <td className="hidden sm:table-cell p-2 whitespace-nowrap text-xs">{new Date(quote.createdOn).toLocaleDateString()}</td>
                              <td className="p-2 whitespace-nowrap text-center">
                                <Button 
                                  onClick={() => handleSelectQuote(quote.id)}
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs py-1 h-7"
                                >
                                  Select
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Step 2: Configure new quote with customer information
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Source Quote Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Original Quote:</span> {selectedQuote.quoteNumber}</p>
                  <p><span className="font-semibold">Project Name:</span> {selectedQuote.projectName}</p>
                  <p><span className="font-semibold">Project Number:</span> {selectedQuote.projectNumber}</p>
                  <p><span className="font-semibold">Original Customer:</span> {selectedQuote.account?.name}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">New Quote Number:</span> {newQuoteNumber}</p>
                  <p><span className="font-semibold">Created By:</span> {getCurrentUser().name}</p>
                  <p><span className="font-semibold">Created On:</span> {new Date().toLocaleDateString()}</p>
                  <p><span className="font-semibold">Valid Until:</span> {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedQuote(null)}
                  size="sm"
                  className="text-xs"
                >
                  Select Different Quote
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">New Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="account" className="required text-sm">Select New Customer Account</Label>
                <Select 
                  onValueChange={(value) => {
                    const account = accounts.find(a => a.id === value);
                    setSelectedAccount(account || null);
                  }}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedAccount && (
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-3 space-y-3 text-sm">
                    <h3 className="font-medium">Billing Contact</h3>
                    <Select 
                      onValueChange={(value) => {
                        const contact = selectedAccount.contacts.find(c => c.id === value);
                        setBillingContact(contact || null);
                      }}
                      value={billingContact?.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select billing contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAccount.contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} ({contact.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {billingContact && (
                      <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                        <p><span className="font-semibold">Address:</span> {billingContact.address.street}</p>
                        <p>{billingContact.address.city}, {billingContact.address.state} {billingContact.address.zip}</p>
                        <p><span className="font-semibold">Email:</span> {billingContact.email}</p>
                        <p><span className="font-semibold">Phone:</span> {billingContact.phone}</p>
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-3 space-y-3 text-sm">
                    <h3 className="font-medium">Sales Contact</h3>
                    <Select 
                      onValueChange={(value) => {
                        const contact = selectedAccount.contacts.find(c => c.id === value);
                        setSalesContact(contact || null);
                      }}
                      value={salesContact?.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sales contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAccount.contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} ({contact.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {salesContact && (
                      <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                        <p><span className="font-semibold">Address:</span> {salesContact.address.street}</p>
                        <p>{salesContact.address.city}, {salesContact.address.state} {salesContact.address.zip}</p>
                        <p><span className="font-semibold">Email:</span> {salesContact.email}</p>
                        <p><span className="font-semibold">Phone:</span> {salesContact.phone}</p>
                      </div>
                    )}
                  </Card>
                  
                  <Card className="p-3 space-y-3 text-sm">
                    <h3 className="font-medium">Site Address</h3>
                    <Select 
                      onValueChange={(value) => {
                        const contact = selectedAccount.contacts.find(c => c.id === value);
                        setSiteContact(contact || null);
                      }}
                      value={siteContact?.id}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select site contact" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAccount.contacts.map(contact => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} ({contact.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {siteContact && (
                      <div className="text-xs space-y-1 bg-gray-50 p-2 rounded">
                        <p><span className="font-semibold">Address:</span> {siteContact.address.street}</p>
                        <p>{siteContact.address.city}, {siteContact.address.state} {siteContact.address.zip}</p>
                        <p><span className="font-semibold">Email:</span> {siteContact.email}</p>
                        <p><span className="font-semibold">Phone:</span> {siteContact.phone}</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:justify-end mt-4 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateReplicate}
                  className="bg-company-blue hover:bg-company-lightBlue w-full sm:w-auto"
                >
                  Create Replicated Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReplicateQuoteForm;
