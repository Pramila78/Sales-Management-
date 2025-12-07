import { Sale, FilterState, SortConfig, PaginationConfig } from '../types';
import { MOCK_SALES_DATA } from './mockData';

interface SalesResponse {
  data: Sale[];
  pagination: PaginationConfig;
}

// Simulate async backend call delay
const DELAY_MS = 300;

export const salesService = {
  getSales: async (
    searchQuery: string,
    filters: FilterState,
    sort: SortConfig,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SalesResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredData = [...MOCK_SALES_DATA];

        // 1. Search (Case-insensitive)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredData = filteredData.filter(
            (sale) =>
              sale.customerName.toLowerCase().includes(query) ||
              sale.phoneNumber.includes(query)
          );
        }

        // 2. Filters
        if (filters.regions.length > 0) {
          filteredData = filteredData.filter((sale) => filters.regions.includes(sale.customerRegion));
        }
        if (filters.genders.length > 0) {
          filteredData = filteredData.filter((sale) => filters.genders.includes(sale.gender));
        }
        if (filters.categories.length > 0) {
          filteredData = filteredData.filter((sale) => filters.categories.includes(sale.productCategory));
        }
        if (filters.paymentMethods.length > 0) {
          filteredData = filteredData.filter((sale) => filters.paymentMethods.includes(sale.paymentMethod));
        }
        
        // Age Range
        filteredData = filteredData.filter(sale => sale.age >= filters.ageRange[0] && sale.age <= filters.ageRange[1]);

        // Date Range
        if (filters.dateRange.start) {
            filteredData = filteredData.filter(sale => new Date(sale.date) >= new Date(filters.dateRange.start!));
        }
        if (filters.dateRange.end) {
            filteredData = filteredData.filter(sale => new Date(sale.date) <= new Date(filters.dateRange.end!));
        }

        // 3. Sorting
        filteredData.sort((a, b) => {
          let valA: any = a[sort.field];
          let valB: any = b[sort.field];

          if (sort.field === 'date') {
            valA = new Date(valA).getTime();
            valB = new Date(valB).getTime();
          }

          if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
          if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
          return 0;
        });

        // 4. Pagination
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

        resolve({
          data: paginatedData,
          pagination: {
            page,
            pageSize,
            totalItems,
            totalPages,
          },
        });
      }, DELAY_MS);
    });
  },

  getUniqueValues: (field: keyof Sale) => {
    return Array.from(new Set(MOCK_SALES_DATA.map(item => item[field]))).sort();
  }
};