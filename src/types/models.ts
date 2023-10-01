
// Types for our application

// Customer/Account
export interface Account {
  id: string;
  name: string;
  billingAddress?: Address;
  contacts: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  isPrimary?: boolean;
  type: 'Billing' | 'Sales' | 'Site' | 'Other';
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Quote model
export interface Quote {
  id: string;
  quoteNumber: string;
  projectName: string;
  projectNumber: string;
  createdBy: string;
  createdOn: Date;
  validUntil: Date;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  account?: Account;
  billingContact?: Contact;
  salesContact?: Contact;
  siteContact?: Contact;
  electricalSpecs: ElectricalSpecs;
  configurations: Configuration[];
  billOfMaterials: BillOfMaterial[];
  totalPrice: number;
}

// Electrical specifications
export interface ElectricalSpecs {
  voltage: number;
  phases: number;
  frequency: number;
  current: number;
  powerFactor: number;
  calculatedPower: number;
  powerOutput: number;
  efficiency: number;
}

// Configuration options
export interface Configuration {
  id: string;
  name: string;
  description: string;
  quantity: number;
  selected: boolean;
}

// Bill of Materials
export interface BillOfMaterial {
  id: string;
  partNumber: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  configurationId?: string;
}

// Mock data for part pricing lookup
export interface PartPricing {
  partNumber: string;
  description: string;
  unitCost: number;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}
