import { Sale } from '../types';

const FIRST_NAMES = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const CITIES = ['New York', 'London', 'Tokyo', 'Paris', 'Dubai', 'Singapore', 'Berlin', 'Toronto'];
const CATEGORIES = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Beauty'];
const BRANDS = ['Apex', 'Nova', 'Vertex', 'Echo', 'Solstice', 'Luna'];
const TAGS_POOL = ['Bestseller', 'New Arrival', 'Eco-Friendly', 'Limited Edition', 'Discounted', 'Gift'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Cash'] as const;
const STATUSES = ['Completed', 'Pending', 'Cancelled', 'Returned'] as const;
const DELIVERY_TYPES = ['Standard', 'Express', 'In-Store Pickup'] as const;

// Deterministic random helper to ensure data feels stable but random
let seed = 1234;
const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const getRandomElement = <T>(arr: readonly T[]): T => arr[Math.floor(random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(random() * (max - min + 1)) + min;

export const generateMockSales = (count: number): Sale[] => {
  return Array.from({ length: count }).map((_, index) => {
    const quantity = getRandomInt(1, 10);
    const price = getRandomInt(10, 500);
    const discount = getRandomInt(0, 30);
    const total = quantity * price;
    const final = total * (1 - discount / 100);
    
    // Generate a date within the last year
    const date = new Date();
    date.setDate(date.getDate() - getRandomInt(0, 365));

    return {
      customerId: `CUST-${1000 + index}`,
      customerName: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
      phoneNumber: `555-${getRandomInt(100, 999)}-${getRandomInt(1000, 9999)}`,
      gender: getRandomElement(['Male', 'Female', 'Other']),
      age: getRandomInt(18, 80),
      customerRegion: getRandomElement(REGIONS),
      customerType: getRandomElement(['Regular', 'Premium', 'New']),
      
      productId: `PROD-${getRandomInt(100, 999)}`,
      productName: `${getRandomElement(BRANDS)} ${getRandomElement(['Widget', 'Gadget', 'Tool', 'Device', 'Accessory'])} ${getRandomInt(1, 9)}`,
      brand: getRandomElement(BRANDS),
      productCategory: getRandomElement(CATEGORIES),
      tags: [getRandomElement(TAGS_POOL), getRandomElement(TAGS_POOL)],
      
      quantity,
      pricePerUnit: price,
      discountPercentage: discount,
      totalAmount: parseFloat(total.toFixed(2)),
      finalAmount: parseFloat(final.toFixed(2)),
      
      date: date.toISOString(),
      paymentMethod: getRandomElement(PAYMENT_METHODS),
      orderStatus: getRandomElement(STATUSES),
      deliveryType: getRandomElement(DELIVERY_TYPES),
      storeId: `STORE-${getRandomInt(1, 20)}`,
      storeLocation: getRandomElement(CITIES),
      salespersonId: `EMP-${getRandomInt(100, 199)}`,
      employeeName: `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`
    };
  });
};

export const MOCK_SALES_DATA = generateMockSales(350); // Generate 350 records