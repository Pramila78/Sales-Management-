import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutDashboard, Settings, UserCircle, Download } from 'lucide-react';
import { Sale, FilterState, SortConfig, SortField, PaginationConfig } from '../types';
import { salesService } from '../services/salesService';
import { useDebounce } from '../hooks/useDebounce';
import SalesTable from './SalesTable';
import FilterPanel from './FilterPanel';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // State
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    regions: [],
    genders: [],
    ageRange: [0, 100],
    categories: [],
    paymentMethods: [],
    dateRange: { start: null, end: null },
  });
  const [sort, setSort] = useState<SortConfig>({ field: 'date', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await salesService.getSales(
          debouncedSearch,
          filters,
          sort,
          pagination.page,
          pagination.pageSize
        );
        setData(response.data);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch sales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, filters, sort, pagination.page, pagination.pageSize]);

  // Handlers
  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  // Prepare chart data (simplified aggregation)
  const chartData = React.useMemo(() => {
    const agg: Record<string, number> = {};
    data.forEach(item => {
        const d = new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        agg[d] = (agg[d] || 0) + item.finalAmount;
    });
    return Object.entries(agg).map(([name, value]) => ({ name, value })).slice(0, 7);
  }, [data]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-black text-white hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-stone-800">
          <h1 className="text-xl font-bold font-serif tracking-wide text-elite-beige">EliteSales</h1>
          <p className="text-xs text-stone-500 mt-1">Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="flex items-center w-full px-4 py-3 bg-stone-900 text-white rounded-lg transition-colors">
            <LayoutDashboard size={18} className="mr-3 text-elite-beige" />
            <span className="text-sm font-medium">Dashboard</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white rounded-lg transition-colors">
            <UserCircle size={18} className="mr-3" />
            <span className="text-sm font-medium">Customers</span>
          </button>
          <button className="flex items-center w-full px-4 py-3 text-stone-400 hover:bg-stone-900 hover:text-white rounded-lg transition-colors">
            <Settings size={18} className="mr-3" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>
        <div className="p-6 border-t border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-elite-beige flex items-center justify-center text-black font-bold text-xs">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-stone-500">admin@elitesales.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-black">Dashboard Overview</h2>
            <p className="text-stone-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-600 hover:border-black transition-colors shadow-sm">
                <Download size={16} />
                Export Report
            </button>
          </div>
        </header>

        {/* Stats Row (Visual flair) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Recent Revenue</h3>
                <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <Bar dataKey="value" fill="#E8E4D9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-black text-white p-6 rounded-xl shadow-lg lg:col-span-2 flex flex-col justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-stone-400 text-sm mb-1">Total Active Sales (Filtered)</p>
                        <h3 className="text-4xl font-serif">{pagination.totalItems}</h3>
                    </div>
                     <div className="text-right">
                        <p className="text-stone-400 text-sm mb-1">Page</p>
                        <h3 className="text-2xl font-serif">{pagination.page} <span className="text-stone-600 text-lg">/ {pagination.totalPages}</span></h3>
                    </div>
                </div>
            </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-lg border border-stone-200 p-4 mb-6 shadow-sm sticky top-2 z-20">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-black transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers by name or phone..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                </div>

                {/* Filter Trigger & Active Badges */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setIsFilterOpen(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border ${isFilterOpen ? 'bg-stone-100 border-stone-300' : 'bg-white border-stone-200 hover:border-black hover:bg-stone-50'}`}
                    >
                        <Filter size={16} />
                        Filters
                        {(filters.regions.length > 0 || filters.categories.length > 0) && (
                            <span className="w-5 h-5 bg-black text-white rounded-full text-xs flex items-center justify-center">!</span>
                        )}
                    </button>
                    
                    <div className="h-8 w-px bg-stone-200 hidden md:block"></div>

                    <div className="flex items-center gap-2 text-stone-500 text-sm">
                        <SlidersHorizontal size={16} />
                        <span className="hidden md:inline">Sort by:</span>
                        <select 
                            value={sort.field} 
                            onChange={(e) => handleSort(e.target.value as SortField)}
                            className="bg-transparent font-medium text-black focus:outline-none cursor-pointer"
                        >
                            <option value="date">Date</option>
                            <option value="quantity">Quantity</option>
                            <option value="customerName">Customer</option>
                            <option value="finalAmount">Amount</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <SalesTable 
            data={data} 
            isLoading={loading} 
            sort={sort} 
            onSort={handleSort} 
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
            <span className="text-sm text-stone-500">
                Showing <span className="font-medium text-black">{data.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> to <span className="font-medium text-black">{Math.min(pagination.page * pagination.pageSize, pagination.totalItems)}</span> of <span className="font-medium text-black">{pagination.totalItems}</span> entries
            </span>
            
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className="p-2 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        // Simple pagination logic for display
                        let p = i + 1;
                        if (pagination.totalPages > 5 && pagination.page > 3) {
                             p = pagination.page - 2 + i;
                        }
                        if (p > pagination.totalPages) return null;
                        
                        return (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${pagination.page === p ? 'bg-black text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
                <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                    className="p-2 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      </main>

      {/* Filter Panel Overlay */}
      <FilterPanel 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}