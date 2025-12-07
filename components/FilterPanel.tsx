import React from 'react';
import { FilterState } from '../types';
import { salesService } from '../services/salesService';
import { X, Check } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, isOpen, onClose }) => {
  const regions = salesService.getUniqueValues('customerRegion') as string[];
  const categories = salesService.getUniqueValues('productCategory') as string[];
  const paymentMethods = salesService.getUniqueValues('paymentMethod') as string[];

  const toggleArrayFilter = (field: keyof FilterState, value: string) => {
    const current = filters[field] as string[];
    const newArray = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    
    setFilters({ ...filters, [field]: newArray });
  };

  const handleAgeChange = (index: 0 | 1, value: string) => {
    const newVal = parseInt(value) || 0;
    const newRange: [number, number] = [...filters.ageRange];
    newRange[index] = newVal;
    setFilters({ ...filters, ageRange: newRange });
  };

  const clearFilters = () => {
    setFilters({
      regions: [],
      genders: [],
      ageRange: [0, 100],
      categories: [],
      paymentMethods: [],
      dateRange: { start: null, end: null },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 overflow-y-auto border-l border-stone-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-serif text-elite-black">Filters</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Regions */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-stone-500">Region</h3>
            <div className="space-y-2">
              {regions.map((region) => (
                <label key={region} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${filters.regions.includes(region) ? 'bg-black border-black text-white' : 'border-stone-300 group-hover:border-stone-400'}`}>
                    {filters.regions.includes(region) && <Check size={12} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.regions.includes(region)}
                    onChange={() => toggleArrayFilter('regions', region)}
                  />
                  <span className="text-sm text-stone-700">{region}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-stone-500">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-black border-black text-white' : 'border-stone-300 group-hover:border-stone-400'}`}>
                    {filters.categories.includes(cat) && <Check size={12} />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleArrayFilter('categories', cat)}
                  />
                  <span className="text-sm text-stone-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Age Range */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-stone-500">Age Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="100"
                value={filters.ageRange[0]}
                onChange={(e) => handleAgeChange(0, e.target.value)}
                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:border-black"
                placeholder="Min"
              />
              <span className="text-stone-400">-</span>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.ageRange[1]}
                onChange={(e) => handleAgeChange(1, e.target.value)}
                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:border-black"
                placeholder="Max"
              />
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Date Range */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-stone-500">Date Range</h3>
            <div className="space-y-2">
              <input 
                type="date" 
                value={filters.dateRange.start || ''}
                onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, start: e.target.value || null}})}
                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:border-black"
              />
              <input 
                type="date" 
                value={filters.dateRange.end || ''}
                onChange={(e) => setFilters({...filters, dateRange: {...filters.dateRange, end: e.target.value || null}})}
                className="w-full p-2 border border-stone-300 rounded text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

           {/* Actions */}
           <div className="pt-6 sticky bottom-0 bg-white pb-6 border-t border-stone-100">
             <button 
               onClick={clearFilters}
               className="w-full py-2 text-sm text-stone-500 hover:text-black border border-stone-200 hover:border-black rounded mb-2 transition-colors"
             >
               Reset Filters
             </button>
             <button 
               onClick={onClose}
               className="w-full py-2 bg-black text-white text-sm font-medium rounded hover:bg-stone-800 transition-colors"
             >
               Apply
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;