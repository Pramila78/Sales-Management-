export interface Sale {
  // Customer Fields
  customerId: string;
  customerName: string;
  phoneNumber: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  customerRegion: string;
  customerType: 'Regular' | 'Premium' | 'New';

  // Product Fields
  productId: string;
  productName: string;
  brand: string;
  productCategory: string;
  tags: string[];

  // Sales Fields
  quantity: number;
  pricePerUnit: number;
  discountPercentage: number;
  totalAmount: number;
  finalAmount: number;

  // Operational Fields
  date: string; // ISO String
  paymentMethod: 'Credit Card' | 'Debit Card' | 'PayPal' | 'Cash';
  orderStatus: 'Completed' | 'Pending' | 'Cancelled' | 'Returned';
  deliveryType: 'Standard' | 'Express' | 'In-Store Pickup';
  storeId: string;
  storeLocation: string;
  salespersonId: string;
  employeeName: string;
}

export type SortField = 'date' | 'quantity' | 'customerName' | 'finalAmount';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterState {
  regions: string[];
  genders: string[];
  ageRange: [number, number]; // min, max
  categories: string[];
  paymentMethods: string[];
  dateRange: { start: string | null; end: string | null };
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}