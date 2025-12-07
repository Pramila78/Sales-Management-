import React from 'react';
import { Sale, SortConfig, SortField } from '../types';
import { ArrowUp, ArrowDown, MoreHorizontal, ShoppingBag, User, Calendar, Tag } from 'lucide-react';

interface SalesTableProps {
  data: Sale[];
  isLoading: boolean;
  sort: SortConfig;
  onSort: (field: SortField) => void;
}

const SalesTable: React.FC<SalesTableProps> = ({ data, isLoading, sort, onSort }) => {
  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return <div className="w-4 h-4" />; // Placeholder
    return sort.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const SortHeader: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <th 
      onClick={() => onSort(field)} 
      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500 cursor-pointer hover:text-black hover:bg-stone-50 transition-colors select-none"
    >
      <div className="flex items-center gap-2">
        {label}
        {getSortIcon(field)}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white rounded-lg border border-stone-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-400 text-sm animate-pulse">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-white rounded-lg border border-stone-200 p-8 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="text-stone-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-stone-900 mb-2">No results found</h3>
        <p className="text-stone-500 max-w-sm">
          We couldn't find any sales matching your search or filters. Try adjusting your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <SortHeader field="date" label="Date" />
              <SortHeader field="customerName" label="Customer" />
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Product</th>
              <SortHeader field="quantity" label="Qty" />
              <SortHeader field="finalAmount" label="Total" />
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((row) => (
              <tr key={row.finalAmount + row.customerId + row.productId + Math.random()} className="hover:bg-stone-50/80 transition-colors group">
                {/* Date */}
                <td className="px-6 py-4 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-stone-400" />
                    {new Date(row.date).toLocaleDateString()}
                  </div>
                </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-stone-900">{row.customerName}</span>
                    <span className="text-xs text-stone-400">{row.phoneNumber}</span>
                  </div>
                </td>

                {/* Product */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-stone-800">{row.productName}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {row.productCategory}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 text-sm text-stone-600 font-mono">
                  {row.quantity}
                </td>

                {/* Total */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-stone-900 font-mono">
                    ${row.finalAmount.toFixed(2)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${row.orderStatus === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                      row.orderStatus === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'}`}>
                    {row.orderStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button className="text-stone-400 hover:text-black transition-colors p-1 rounded hover:bg-stone-100">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;