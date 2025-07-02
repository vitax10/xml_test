// RelatedProducts.tsx
import React from 'react';
import { Product } from '../types';
import { ICONS } from './Icons';

interface RelatedProductsProps {
  title: string;
  items: Array<{ name: string; code: string }>;
  allProducts: Product[];
  onProductSelect: (product: Product) => void;
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ title, items, allProducts, onProductSelect }) => {
    if (!items || items.length === 0) return null;
    
    const handleClick = (code: string) => {
        const product = allProducts.find(p => p.code === code);
        if (product) onProductSelect(product);
    };

    return (
        <div className="details-section mt-8">
            <h3>{ICONS.link}{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item, index) => (
                    <button key={index} onClick={() => handleClick(item.code)} className="p-3 bg-gray-50 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all text-left">
                        <p className="font-semibold text-sm text-blue-700">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};