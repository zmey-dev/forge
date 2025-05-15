
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Account, 
  Contact, 
  ElectricalSpecs, 
  Configuration, 
  BillOfMaterial
} from '@/types/models';
import { getAccounts, getConfigurations, getPartPricing, generateQuoteNumber, getCurrentUser } from '@/services/mockDataService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { FileText } from "lucide-react";

const CreateQuoteForm: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  
  // State for the quote form
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [billingContact, setBillingContact] = useState<Contact | null>(null);
  const [salesContact, setSalesContact] = useState<Contact | null>(null);
  const [siteContact, setSiteContact] = useState<Contact | null>(null);
  
  const [quoteNumber, setQuoteNumber] = useState<string>(generateQuoteNumber());
  const [projectName, setProjectName] = useState<string>("");
  const [projectNumber, setProjectNumber] = useState<string>("");
  const [validUntil, setValidUntil] = useState<string>("");

  // Electrical specs
  const [electricalSpecs, setElectricalSpecs] = useState<ElectricalSpecs>({
    voltage: 0,
    phases: 0,
    frequency: 60,
    current: 0,
    powerFactor: 0.9,
    calculatedPower: 0,
    powerOutput: 0,
    efficiency: 0.95,
  });

  // Configurations
  const [availableConfigurations, setAvailableConfigurations] = useState<Configuration[]>([]);
  const [selectedConfigurations, setSelectedConfigurations] = useState<Configuration[]>([]);

  // BOM
  const [billOfMaterials, setBillOfMaterials] = useState<BillOfMaterial[]>([]);
  const [availableParts, setAvailableParts] = useState<any[]>([]);
  const [currentPart, setCurrentPart] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  // Highlighting changed values
  const [highlightFields, setHighlightFields] = useState<{ [key: string]: boolean }>({});

  // Load initial data
  useEffect(() => {
    setAccounts(getAccounts());
    setAvailableConfigurations(getConfigurations());
    setAvailableParts(getPartPricing());

    // Set default date (30 days from today)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    setValidUntil(thirtyDaysFromNow.toISOString().split('T')[0]);
  }, []);

  // Calculate power when electrical inputs change
  useEffect(() => {
    const { voltage, current, phases, powerFactor } = electricalSpecs;
    
    // Calculate power in kW: P = √3 × V × I × PF / 1000 (for 3-phase)
    // or P = V × I × PF / 1000 (for single-phase)
    let calculatedPower = 0;
    if (phases === 3) {
      calculatedPower = Math.sqrt(3) * voltage * current * powerFactor / 1000;
    } else if (phases === 1) {
      calculatedPower = voltage * current * powerFactor / 1000;
    }

    const roundedPower = Math.round(calculatedPower * 100) / 100;
    
    if (roundedPower !== electricalSpecs.calculatedPower) {
      setElectricalSpecs({
        ...electricalSpecs,
        calculatedPower: roundedPower,
        powerOutput: Math.ceil(roundedPower) // Round up to the next whole number for output power
      });
      highlightField('calculatedPower');
      highlightField('powerOutput');
    }
  }, [electricalSpecs.voltage, electricalSpecs.current, electricalSpecs.phases, electricalSpecs.powerFactor]);

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

  // Helper to highlight changed fields
  const highlightField = (field: string) => {
    setHighlightFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setHighlightFields(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  // Handle electrical spec changes
  const handleElectricalChange = (field: keyof ElectricalSpecs, value: number) => {
    setElectricalSpecs(prev => ({ ...prev, [field]: value }));
  };

  // Handle configuration selection
  const toggleConfiguration = (config: Configuration) => {
    const updatedConfigs = availableConfigurations.map(c => 
      c.id === config.id ? { ...c, selected: !c.selected } : c
    );
    setAvailableConfigurations(updatedConfigs);
    
    // Update selected configurations
    const newSelectedConfigs = updatedConfigs.filter(c => c.selected);
    setSelectedConfigurations(newSelectedConfigs);
  };

  // Handle adding part to BOM
  const addPartToBOM = () => {
    if (!currentPart || currentQuantity <= 0) {
      toast("Please select a part and specify a quantity");
      return;
    }
    
    const partDetails = availableParts.find(p => p.partNumber === currentPart);
    if (!partDetails) return;
    
    const newBOMItem: BillOfMaterial = {
      id: `bom-${billOfMaterials.length + 1}`,
      partNumber: partDetails.partNumber,
      description: partDetails.description,
      quantity: currentQuantity,
      unitCost: partDetails.unitCost,
      totalCost: partDetails.unitCost * currentQuantity
    };
    
    setBillOfMaterials([...billOfMaterials, newBOMItem]);
    setCurrentPart("");
    setCurrentQuantity(1);
    
    toast.success("Part added to Bill of Materials");
  };

  // Handle removing part from BOM
  const removePartFromBOM = (id: string) => {
    setBillOfMaterials(billOfMaterials.filter(item => item.id !== id));
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return billOfMaterials.reduce((sum, item) => sum + item.totalCost, 0);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAccount) {
      toast.error("Please select a customer account");
      return;
    }
    
    if (!billingContact || !salesContact || !siteContact) {
      toast.error("Please select all required contacts");
      return;
    }
    
    if (billOfMaterials.length === 0) {
      toast.error("Please add at least one item to the Bill of Materials");
      return;
    }
    
    // Normally we would save this to a database
    toast.success("Quote created successfully!", {
      description: `Quote ${quoteNumber} for ${selectedAccount.name} has been created.`
    });
    
    // Navigate to print preview or back to home
    navigate("/");
  };

  // Generate print preview of the quote
  const handlePrintPreview = () => {
    if (!selectedAccount) {
      toast.error("Please complete the quote before generating a preview");
      return;
    }
    
    toast("Preparing print preview...");
    window.print();
  };

  return (
    <div className="container mx-auto py-6 px-4 print:px-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-company-blue">Create New Quotation</h1>
          <p className="text-company-gray">Complete the form below to create a new customer quote</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
          <Button variant="default" onClick={handleSubmit} className="bg-company-blue hover:bg-company-lightBlue">
            Save Quote
          </Button>
        </div>
      </div>
      
      {/* Print header (only visible when printing) */}
      <div className="hidden print:flex print:flex-col print:items-center print:mb-6">
        <div className="flex items-center mb-4">
          <FileText className="h-10 w-10 mr-2 text-company-blue" />
          <h1 className="text-3xl font-bold">QuoteBuilder Pro</h1>
        </div>
        <h2 className="text-2xl">{quoteNumber}: {projectName}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="print:hidden">
          <TabsList className="mb-6 bg-company-lightGray">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="customer">Customer Information</TabsTrigger>
            <TabsTrigger value="electrical">Electrical Specifications</TabsTrigger>
            <TabsTrigger value="configurations">Configurations</TabsTrigger>
            <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
            <TabsTrigger value="summary">Quote Summary</TabsTrigger>
          </TabsList>
          
          {/* Basic Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quoteNumber">Quote Number</Label>
                    <Input 
                      id="quoteNumber" 
                      value={quoteNumber} 
                      readOnly 
                      className="bg-gray-100" 
                    />
                    <p className="text-xs text-company-gray mt-1">Auto-generated number</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="projectName" className="required">Project Name</Label>
                    <Input 
                      id="projectName" 
                      value={projectName} 
                      onChange={e => setProjectName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="projectNumber">Project Number</Label>
                    <Input 
                      id="projectNumber" 
                      value={projectNumber} 
                      onChange={e => setProjectNumber(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="createdBy">Created By</Label>
                    <Input 
                      id="createdBy" 
                      value={currentUser?.name || ""} 
                      readOnly 
                      className="bg-gray-100" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="createdOn">Created On</Label>
                    <Input 
                      id="createdOn" 
                      type="date" 
                      value={new Date().toISOString().split('T')[0]}
                      readOnly 
                      className="bg-gray-100" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="validUntil" className="required">Valid Until</Label>
                    <Input 
                      id="validUntil" 
                      type="date" 
                      value={validUntil}
                      onChange={e => setValidUntil(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Customer Information Tab */}
          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="account" className="required">Select Customer Account</Label>
                  <Select 
                    onValueChange={(value) => {
                      const account = accounts.find(a => a.id === value);
                      setSelectedAccount(account || null);
                    }}
                    required
                  >
                    <SelectTrigger>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-4 space-y-4">
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
                        <div className="text-sm">
                          <p><strong>Address:</strong> {billingContact.address.street}</p>
                          <p>{billingContact.address.city}, {billingContact.address.state} {billingContact.address.zip}</p>
                          <p><strong>Email:</strong> {billingContact.email}</p>
                          <p><strong>Phone:</strong> {billingContact.phone}</p>
                        </div>
                      )}
                    </Card>
                    
                    <Card className="p-4 space-y-4">
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
                        <div className="text-sm">
                          <p><strong>Address:</strong> {salesContact.address.street}</p>
                          <p>{salesContact.address.city}, {salesContact.address.state} {salesContact.address.zip}</p>
                          <p><strong>Email:</strong> {salesContact.email}</p>
                          <p><strong>Phone:</strong> {salesContact.phone}</p>
                        </div>
                      )}
                    </Card>
                    
                    <Card className="p-4 space-y-4">
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
                        <div className="text-sm">
                          <p><strong>Address:</strong> {siteContact.address.street}</p>
                          <p>{siteContact.address.city}, {siteContact.address.state} {siteContact.address.zip}</p>
                          <p><strong>Email:</strong> {siteContact.email}</p>
                          <p><strong>Phone:</strong> {siteContact.phone}</p>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Electrical Specifications Tab */}
          <TabsContent value="electrical">
            <Card>
              <CardHeader>
                <CardTitle>Electrical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Input Parameters</h3>
                    
                    <div>
                      <Label htmlFor="voltage">Voltage (V)</Label>
                      <Input 
                        id="voltage" 
                        type="number" 
                        value={electricalSpecs.voltage || ''} 
                        onChange={e => handleElectricalChange('voltage', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phases">Phases</Label>
                      <Select 
                        onValueChange={(value) => handleElectricalChange('phases', parseInt(value))}
                        value={electricalSpecs.phases.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select phases" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Single Phase (1)</SelectItem>
                          <SelectItem value="3">Three Phase (3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency">Frequency (Hz)</Label>
                      <Select 
                        onValueChange={(value) => handleElectricalChange('frequency', parseInt(value))}
                        value={electricalSpecs.frequency.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50 Hz</SelectItem>
                          <SelectItem value="60">60 Hz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="current">Current (A)</Label>
                      <Input 
                        id="current" 
                        type="number" 
                        step="0.1"
                        value={electricalSpecs.current || ''} 
                        onChange={e => handleElectricalChange('current', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="powerFactor">Power Factor</Label>
                      <Input 
                        id="powerFactor" 
                        type="number"
                        step="0.01"
                        min="0"
                        max="1" 
                        value={electricalSpecs.powerFactor || ''} 
                        onChange={e => handleElectricalChange('powerFactor', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Calculated Parameters</h3>
                    
                    <div>
                      <Label htmlFor="calculatedPower">Calculated Power (kW)</Label>
                      <Input 
                        id="calculatedPower" 
                        value={electricalSpecs.calculatedPower || ''} 
                        readOnly 
                        className={`bg-gray-100 ${highlightFields.calculatedPower ? 'animate-highlight' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="powerOutput">Power Output (kW)</Label>
                      <Input 
                        id="powerOutput" 
                        value={electricalSpecs.powerOutput || ''} 
                        readOnly 
                        className={`bg-gray-100 ${highlightFields.powerOutput ? 'animate-highlight' : ''}`}
                      />
                      <p className="text-xs text-company-gray mt-1">Rounded up to nearest kW</p>
                    </div>
                    
                    <div>
                      <Label htmlFor="efficiency">Efficiency</Label>
                      <Input 
                        id="efficiency" 
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={electricalSpecs.efficiency || ''} 
                        onChange={e => handleElectricalChange('efficiency', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Configurations Tab */}
          <TabsContent value="configurations">
            <Card>
              <CardHeader>
                <CardTitle>Product Configurations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-company-gray">Select the configurations required for this quote:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableConfigurations.map(config => (
                    <div key={config.id} className="border rounded-md p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Checkbox 
                          id={`config-${config.id}`} 
                          checked={config.selected}
                          onCheckedChange={() => toggleConfiguration(config)}
                        />
                        <Label 
                          htmlFor={`config-${config.id}`} 
                          className="font-medium cursor-pointer"
                        >
                          {config.name}
                        </Label>
                      </div>
                      <p className="text-company-gray text-sm mb-2">{config.description}</p>
                      
                      {config.selected && (
                        <div className="mt-3">
                          <Label htmlFor={`config-qty-${config.id}`}>Quantity</Label>
                          <Input 
                            id={`config-qty-${config.id}`}
                            type="number"
                            min="1"
                            value={config.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              const updatedConfigs = availableConfigurations.map(c => 
                                c.id === config.id ? { ...c, quantity: value } : c
                              );
                              setAvailableConfigurations(updatedConfigs);
                            }}
                            className="mt-1 w-20"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-3">Selected Configurations</h3>
                  {availableConfigurations.filter(c => c.selected).length === 0 ? (
                    <p className="text-company-gray italic">No configurations selected</p>
                  ) : (
                    <ul className="space-y-2">
                      {availableConfigurations.filter(c => c.selected).map(config => (
                        <li key={config.id}>
                          {config.name} - Qty: {config.quantity} - {config.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Bill of Materials Tab */}
          <TabsContent value="bom">
            <Card>
              <CardHeader>
                <CardTitle>Bill of Materials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="part">Select Part</Label>
                    <Select 
                      onValueChange={setCurrentPart}
                      value={currentPart}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a part" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableParts.map(part => (
                          <SelectItem key={part.partNumber} value={part.partNumber}>
                            {part.partNumber}: {part.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      value={currentQuantity} 
                      onChange={e => setCurrentQuantity(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      onClick={addPartToBOM}
                      className="bg-company-blue hover:bg-company-lightBlue"
                    >
                      Add to BOM
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Current Bill of Materials</h3>
                  
                  {billOfMaterials.length === 0 ? (
                    <p className="text-company-gray italic">No items added to BOM</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-company-lightGray">
                            <th className="p-2 text-left">Part Number</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-right">Quantity</th>
                            <th className="p-2 text-right">Unit Cost</th>
                            <th className="p-2 text-right">Total Cost</th>
                            <th className="p-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {billOfMaterials.map(item => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.partNumber}</td>
                              <td className="p-2">{item.description}</td>
                              <td className="p-2 text-right">{item.quantity}</td>
                              <td className="p-2 text-right">${item.unitCost.toFixed(2)}</td>
                              <td className="p-2 text-right">${item.totalCost.toFixed(2)}</td>
                              <td className="p-2 text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removePartFromBOM(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  Remove
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="font-medium">
                            <td colSpan={4} className="p-2 text-right">Total:</td>
                            <td className="p-2 text-right">${calculateTotalPrice().toFixed(2)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Quote Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-4">Project Details</h3>
                    <p><strong>Quote Number:</strong> {quoteNumber}</p>
                    <p><strong>Project Name:</strong> {projectName || "Not specified"}</p>
                    <p><strong>Project Number:</strong> {projectNumber || "Not specified"}</p>
                    <p><strong>Created By:</strong> {currentUser?.name}</p>
                    <p><strong>Created On:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Valid Until:</strong> {validUntil ? new Date(validUntil).toLocaleDateString() : "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">Customer Information</h3>
                    {selectedAccount ? (
                      <>
                        <p><strong>Account:</strong> {selectedAccount.name}</p>
                        
                        {billingContact && (
                          <p><strong>Billing Contact:</strong> {billingContact.name}</p>
                        )}
                        
                        {salesContact && (
                          <p><strong>Sales Contact:</strong> {salesContact.name}</p>
                        )}
                        
                        {siteContact && (
                          <p><strong>Site Address:</strong> {siteContact.address.street}, {siteContact.address.city}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-company-gray italic">No customer selected</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Electrical Specifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <p><strong>Voltage:</strong> {electricalSpecs.voltage}V</p>
                    <p><strong>Phases:</strong> {electricalSpecs.phases}</p>
                    <p><strong>Frequency:</strong> {electricalSpecs.frequency}Hz</p>
                    <p><strong>Current:</strong> {electricalSpecs.current}A</p>
                    <p><strong>Power Factor:</strong> {electricalSpecs.powerFactor}</p>
                    <p><strong>Power Output:</strong> {electricalSpecs.powerOutput}kW</p>
                    <p><strong>Efficiency:</strong> {Math.round(electricalSpecs.efficiency * 100)}%</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Selected Configurations</h3>
                  {availableConfigurations.filter(c => c.selected).length === 0 ? (
                    <p className="text-company-gray italic">No configurations selected</p>
                  ) : (
                    <ul className="space-y-2">
                      {availableConfigurations.filter(c => c.selected).map(config => (
                        <li key={config.id}>
                          {config.name} - Qty: {config.quantity} - {config.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Bill of Materials Summary</h3>
                  {billOfMaterials.length === 0 ? (
                    <p className="text-company-gray italic">No items added to BOM</p>
                  ) : (
                    <>
                      <p><strong>Total Items:</strong> {billOfMaterials.length}</p>
                      <p><strong>Total Quantity:</strong> {billOfMaterials.reduce((sum, item) => sum + item.quantity, 0)}</p>
                      <p><strong>Total Cost:</strong> ${calculateTotalPrice().toFixed(2)}</p>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end mt-6 gap-3">
                  <Button variant="outline" onClick={handlePrintPreview} type="button">
                    Print Preview
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleSubmit}
                    className="bg-company-blue hover:bg-company-lightBlue"
                  >
                    Save Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Print view - only visible when printing */}
        <div className="hidden print:block">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium mb-4">Project Details</h3>
              <p><strong>Quote Number:</strong> {quoteNumber}</p>
              <p><strong>Project Name:</strong> {projectName || "Not specified"}</p>
              <p><strong>Project Number:</strong> {projectNumber || "Not specified"}</p>
              <p><strong>Created By:</strong> {currentUser?.name}</p>
              <p><strong>Created On:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Valid Until:</strong> {validUntil ? new Date(validUntil).toLocaleDateString() : "Not specified"}</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Customer Information</h3>
              {selectedAccount && (
                <>
                  <p><strong>Account:</strong> {selectedAccount.name}</p>
                  
                  {billingContact && (
                    <>
                      <p><strong>Billing Contact:</strong> {billingContact.name}</p>
                      <p>{billingContact.address.street}, {billingContact.address.city}, {billingContact.address.state}</p>
                      <p>Email: {billingContact.email}</p>
                      <p>Phone: {billingContact.phone}</p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-4">Electrical Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <p><strong>Voltage:</strong> {electricalSpecs.voltage}V</p>
              <p><strong>Phases:</strong> {electricalSpecs.phases}</p>
              <p><strong>Frequency:</strong> {electricalSpecs.frequency}Hz</p>
              <p><strong>Current:</strong> {electricalSpecs.current}A</p>
              <p><strong>Power Factor:</strong> {electricalSpecs.powerFactor}</p>
              <p><strong>Power Output:</strong> {electricalSpecs.powerOutput}kW</p>
              <p><strong>Efficiency:</strong> {Math.round(electricalSpecs.efficiency * 100)}%</p>
            </div>
          </div>
          
          {billOfMaterials.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-4">Bill of Materials</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-company-lightGray">
                    <th className="p-2 text-left">Part Number</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-right">Unit Cost</th>
                    <th className="p-2 text-right">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {billOfMaterials.map(item => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.partNumber}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${item.unitCost.toFixed(2)}</td>
                      <td className="p-2 text-right">${item.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td colSpan={4} className="p-2 text-right">Total:</td>
                    <td className="p-2 text-right">${calculateTotalPrice().toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
          
          <div className="mt-10 pt-10 border-t text-sm">
            <p className="mb-2">Terms and Conditions:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>This quote is valid until the date specified above.</li>
              <li>Prices are subject to change without notice.</li>
              <li>Delivery time is estimated and may vary depending on availability.</li>
              <li>Payment terms: 50% deposit, balance prior to delivery.</li>
              <li>Warranty: 12 months on parts and labor.</li>
            </ol>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuoteForm;
