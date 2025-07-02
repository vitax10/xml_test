// pages / index.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { getProductData } from '../lib/xmlParser';
import { FilterPanel } from '../components/FilterPanel';
import { ProductList } from '../components/ProductList';
import { ProductDetails } from '../components/ProductDetails';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '', brand: '', inStock: false, hasSpareParts: false, isNew: false
  });

  // Fetching all data on the client side when the component mounts.
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingMessage('Načítání a zpracování dat...');
        const { products: fetchedProducts, brands: fetchedBrands } = await getProductData();
        setProducts(fetchedProducts);
        setBrands(fetchedBrands);
        if (fetchedProducts.length > 0) {
          setSelectedProduct(fetchedProducts[0]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtering the full list of products in memory.
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const f = filters;
      return (f.searchTerm === '' || p.name.toLowerCase().includes(f.searchTerm.toLowerCase()) || p.code.toLowerCase().includes(f.searchTerm.toLowerCase())) &&
             (f.brand === '' || p.brand === f.brand) &&
             (!f.inStock || p.inStock) &&
             (!f.hasSpareParts || p.hasSpareParts) &&
             (!f.isNew || p.isNew);
    });
  }, [products, filters]);

  // When filters change, updating the selected product if it's no longer in the filtered list
  useEffect(() => {
      if (filteredProducts.length > 0) {
          if (!selectedProduct || !filteredProducts.some(p => p.id === selectedProduct.id)) {
              setSelectedProduct(filteredProducts[0]);
          }
      } else {
          setSelectedProduct(null);
      }
  }, [filteredProducts, selectedProduct]);


  const handleFilterChange = (key: keyof typeof filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-center"><div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500 mx-auto"></div><h2 className="mt-4 text-2xl font-semibold text-gray-700">{loadingMessage}</h2></div></div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-red-50"><div className="p-8 bg-white rounded-lg shadow-md text-center max-w-lg"><h2 className="text-2xl font-bold text-red-600">Chyba při načítání dat</h2><p className="mt-2 text-gray-600">{error}</p></div></div>;

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans antialiased bg-gray-50 text-gray-800">
      <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-white border-r border-gray-200 flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Produkty - Katalog</h1>
          <p className="text-sm text-gray-500">Zobrazeno {filteredProducts.length} z {products.length} produktů</p>
        </header>
        <FilterPanel filters={filters} brands={brands} onFilterChange={handleFilterChange} />
        <ProductList products={filteredProducts} selectedProduct={selectedProduct} onProductSelect={setSelectedProduct} />
      </aside>
      <main className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-8 overflow-y-auto custom-scrollbar">
        <ProductDetails product={selectedProduct} allProducts={products} onProductSelect={setSelectedProduct} />
      </main>
    </div>
  );
}