// FilterPanel.tsx
import React from 'react';
import { ICONS } from './Icons';

interface Filters {
  searchTerm: string;
  brand: string;
  inStock: boolean;
  hasSpareParts: boolean;
  isNew: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  brands: string[];
  onFilterChange: (key: keyof Filters, value: string | boolean) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, brands, onFilterChange }) => {
  return (
    <div className="p-4 border-b">
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{ICONS.search}</div>
        <input 
          type="text" 
          placeholder="Hledat..." 
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
          value={filters.searchTerm} 
          onChange={e => onFilterChange('searchTerm', e.target.value)} 
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Značka</label>
        <select 
          value={filters.brand} 
          onChange={e => onFilterChange('brand', e.target.value)} 
          className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {brands.map(b => <option key={b} value={b}>{b || 'Všechny značky'}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex items-center p-2 bg-gray-100 rounded-md">
          <input type="checkbox" className="h-4 w-4 rounded" checked={filters.inStock} onChange={e => onFilterChange('inStock', e.target.checked)} />
          <span className="ml-2">Skladem</span>
        </label>
        <label className="flex items-center p-2 bg-gray-100 rounded-md">
          <input type="checkbox" className="h-4 w-4 rounded" checked={filters.hasSpareParts} onChange={e => onFilterChange('hasSpareParts', e.target.checked)} />
          <span className="ml-2">Náhradní díly</span>
        </label>
        <label className="flex items-center p-2 bg-gray-100 rounded-md">
          <input type="checkbox" className="h-4 w-4 rounded" checked={filters.isNew} onChange={e => onFilterChange('isNew', e.target.checked)} />
          <span className="ml-2">Novinka</span>
        </label>
      </div>
    </div>
  );
};