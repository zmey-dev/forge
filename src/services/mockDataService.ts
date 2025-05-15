
import { Account, Contact, Configuration, PartPricing, Quote, User } from "@/types/models";

// Mock users
export const getUsers = (): User[] => [
  { id: "1", name: "John Admin", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Sarah User", email: "sarah@example.com", role: "User" },
];

// Mock accounts/customers
export const getAccounts = (): Account[] => [
  {
    id: "1",
    name: "Acme Corporation",
    billingAddress: {
      id: "a1",
      street: "123 Business Ave",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    contacts: [
      {
        id: "c1",
        name: "John Doe",
        email: "john@acme.com",
        phone: "555-123-4567",
        type: "Billing",
        isPrimary: true,
        address: {
          id: "a1",
          street: "123 Business Ave",
          city: "Chicago",
          state: "IL",
          zip: "60601",
          country: "USA",
        },
      },
      {
        id: "c2",
        name: "Jane Smith",
        email: "jane@acme.com",
        phone: "555-987-6543",
        type: "Sales",
        address: {
          id: "a2",
          street: "456 Market St",
          city: "Chicago",
          state: "IL",
          zip: "60602",
          country: "USA",
        },
      },
      {
        id: "c3",
        name: "Site Manager",
        email: "site@acme.com",
        phone: "555-555-1234",
        type: "Site",
        address: {
          id: "a3",
          street: "789 Factory Lane",
          city: "Hammond",
          state: "IN",
          zip: "46320",
          country: "USA",
        },
      },
    ],
  },
  {
    id: "2",
    name: "GloboTech Industries",
    billingAddress: {
      id: "a4",
      street: "456 Tech Park",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "USA",
    },
    contacts: [
      {
        id: "c4",
        name: "Alice Johnson",
        email: "alice@globotech.com",
        phone: "555-222-3333",
        type: "Billing",
        isPrimary: true,
        address: {
          id: "a4",
          street: "456 Tech Park",
          city: "Boston",
          state: "MA",
          zip: "02108",
          country: "USA",
        },
      },
      {
        id: "c5",
        name: "Bob Williams",
        email: "bob@globotech.com",
        phone: "555-444-5555",
        type: "Sales",
        address: {
          id: "a5",
          street: "789 Innovation Dr",
          city: "Cambridge",
          state: "MA",
          zip: "02142",
          country: "USA",
        },
      },
      {
        id: "c6",
        name: "Site Supervisor",
        email: "site@globotech.com",
        phone: "555-666-7777",
        type: "Site",
        address: {
          id: "a6",
          street: "101 Manufacturing Blvd",
          city: "Lowell",
          state: "MA",
          zip: "01852",
          country: "USA",
        },
      },
    ],
  },
];

// Mock configurations
export const getConfigurations = (): Configuration[] => [
  { id: "1", name: "Standard", description: "Basic configuration", quantity: 1, selected: false },
  { id: "2", name: "Premium", description: "Enhanced configuration", quantity: 1, selected: false },
  { id: "3", name: "Enterprise", description: "High-capacity configuration", quantity: 1, selected: false },
  { id: "4", name: "Custom", description: "Specialized configuration", quantity: 1, selected: false },
];

// Mock part pricing for BOM
export const getPartPricing = (): PartPricing[] => [
  { partNumber: "P001", description: "Control Panel", unitCost: 450.00 },
  { partNumber: "P002", description: "Power Supply Unit", unitCost: 275.50 },
  { partNumber: "P003", description: "Circuit Breaker", unitCost: 125.25 },
  { partNumber: "P004", description: "Transformer", unitCost: 525.00 },
  { partNumber: "P005", description: "Relay", unitCost: 85.75 },
  { partNumber: "P006", description: "Switch", unitCost: 45.50 },
  { partNumber: "P007", description: "Contactor", unitCost: 95.25 },
  { partNumber: "P008", description: "Motor Starter", unitCost: 185.00 },
  { partNumber: "P009", description: "Terminal Block", unitCost: 15.25 },
  { partNumber: "P010", description: "Wire Harness", unitCost: 125.50 },
];

// Mock existing quotes
export const getExistingQuotes = (): Quote[] => [
  {
    id: "1",
    quoteNumber: "Q-2025-0001",
    projectName: "Factory Automation System",
    projectNumber: "PRJ-001",
    createdBy: "John Admin",
    createdOn: new Date("2025-05-01"),
    validUntil: new Date("2025-06-01"),
    status: "Approved",
    account: getAccounts()[0],
    billingContact: getAccounts()[0].contacts[0],
    salesContact: getAccounts()[0].contacts[1],
    siteContact: getAccounts()[0].contacts[2],
    electricalSpecs: {
      voltage: 480,
      phases: 3,
      frequency: 60,
      current: 20,
      powerFactor: 0.9,
      calculatedPower: 14.9, // kW
      powerOutput: 15, // kW
      efficiency: 0.95,
    },
    configurations: [
      { ...getConfigurations()[0], selected: true },
      { ...getConfigurations()[1], selected: false },
    ],
    billOfMaterials: [
      { id: "bom1", partNumber: "P001", description: "Control Panel", quantity: 1, unitCost: 450, totalCost: 450 },
      { id: "bom2", partNumber: "P002", description: "Power Supply Unit", quantity: 2, unitCost: 275.5, totalCost: 551 },
      { id: "bom3", partNumber: "P003", description: "Circuit Breaker", quantity: 3, unitCost: 125.25, totalCost: 375.75 },
    ],
    totalPrice: 1376.75,
  },
  {
    id: "2",
    quoteNumber: "Q-2025-0002",
    projectName: "Building Control System",
    projectNumber: "PRJ-002",
    createdBy: "Sarah User",
    createdOn: new Date("2025-05-05"),
    validUntil: new Date("2025-06-05"),
    status: "Draft",
    account: getAccounts()[1],
    billingContact: getAccounts()[1].contacts[0],
    salesContact: getAccounts()[1].contacts[1],
    siteContact: getAccounts()[1].contacts[2],
    electricalSpecs: {
      voltage: 240,
      phases: 1,
      frequency: 60,
      current: 15,
      powerFactor: 0.85,
      calculatedPower: 3.05, // kW
      powerOutput: 3, // kW
      efficiency: 0.9,
    },
    configurations: [
      { ...getConfigurations()[2], selected: true },
      { ...getConfigurations()[3], selected: true, quantity: 2 },
    ],
    billOfMaterials: [
      { id: "bom4", partNumber: "P005", description: "Relay", quantity: 5, unitCost: 85.75, totalCost: 428.75 },
      { id: "bom5", partNumber: "P006", description: "Switch", quantity: 10, unitCost: 45.5, totalCost: 455 },
      { id: "bom6", partNumber: "P010", description: "Wire Harness", quantity: 2, unitCost: 125.5, totalCost: 251 },
    ],
    totalPrice: 1134.75,
  },
];

// Generate a new quote number
export const generateQuoteNumber = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const existingQuotes = getExistingQuotes();
  const lastNumber = existingQuotes.length > 0 
    ? parseInt(existingQuotes[existingQuotes.length - 1].quoteNumber.split('-')[2])
    : 0;
  
  return `Q-${year}-${(lastNumber + 1).toString().padStart(4, '0')}`;
};

// Mock current user
export const getCurrentUser = (): User => {
  return getUsers()[0]; // Default to the first user (admin)
};
