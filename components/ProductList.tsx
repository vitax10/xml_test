// ProductList.tsx
import React from 'react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, selectedProduct, onProductSelect }) => {
  return (
    <div className="overflow-y-auto flex-grow custom-scrollbar">
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <button 
              onClick={() => onProductSelect(p)} 
              className={`w-full text-left p-4 border-l-4 ${selectedProduct?.id === p.id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-100'}`}
            >
              <p className="font-semibold">{p.name}</p>
              <p className="text-sm text-gray-500">{p.code}</p>
            </button>
          </li>
        ))}
        {products.length === 0 && <p className="p-4 text-center text-gray-500">Žádné produkty neodpovídají filtrům.</p>}
      </ul>
    </div>
  );
};