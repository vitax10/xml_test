// ProductDetails.tsx

import React, { useMemo } from 'react';
import { Product } from '../types';
import { ICONS } from './Icons';
import { RelatedProducts } from './RelatedProducts';

interface ProductDetailsProps {
  product: Product | null;
  allProducts: Product[];
  onProductSelect: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product, allProducts, onProductSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  const cycleImage = () => {
    if (!product || product.photoGallery.length === 0) return;
    setCurrentImageIndex(prev => (prev + 1) % product.photoGallery.length);
  };

  const groupedDescriptions = useMemo(() => {
      if (!product) return {};
      return product.descriptions.reduce((acc, desc) => {
          if (!acc[desc.title]) acc[desc.title] = [];
          const cleanHtml = desc.html.replace(/<\/?font[^>]*>/g, '');
          acc[desc.title].push(cleanHtml);
          return acc;
      }, {} as Record<string, string[]>);
  }, [product]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <h2 className="text-2xl font-semibold">Vyberte produkt</h2>
          <p>Zvolte produkt ze seznamu pro zobrazení detailů.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-4">
          <div>
              <h2 className="text-4xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-lg text-gray-500 mt-1">Značka: {product.brand} | Kód: {product.code}</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {product.isNew && <span className="badge bg-blue-100 text-blue-800">Novinka</span>}
            {product.inStock && <span className="badge bg-green-100 text-green-800">Skladem</span>}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
              <div className="relative">
                  <img src={product.photoGallery[currentImageIndex] || product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-lg cursor-pointer" onClick={cycleImage} onError={(e) => { (e.target as HTMLImageElement).src='https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Error' }} />
                  {product.photoGallery.length > 1 && <div className="absolute bottom-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-full text-sm">{currentImageIndex + 1} / {product.photoGallery.length}</div>}
              </div>
          </div>
          <div>
              <div className="details-section mb-6"><h3>{ICONS.price}Ceny</h3><div className="grid grid-cols-2 gap-4 text-center"><div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Cena (CZK)</p><p className="text-2xl font-bold">{product.prices.czk.toLocaleString('cs-CZ')} Kč</p></div><div className="p-4 bg-gray-100 rounded-lg"><p className="text-sm text-gray-500">Cena (EUR)</p><p className="text-2xl font-bold">€{product.prices.eur.toLocaleString('de-DE')}</p></div></div></div>
              <div className="details-section"><h3>{ICONS.wrench}Náhradní díly</h3>{product.hasSpareParts ? <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">{product.spareParts.map((p, i) => <li key={i} className="flex p-2 bg-gray-50 rounded-md"><div><p className="font-medium text-gray-700">{p.name}</p><p className="text-xs text-gray-500">{p.code}</p></div></li>)}</ul> : <p className="text-gray-500">Nejsou uvedeny žádné náhradní díly.</p>}</div>
          </div>
      </div>
      
      <div className="details-section mb-8">
          <h3>{ICONS.desc}Popis</h3>
          <div className="space-y-6">
              {Object.entries(groupedDescriptions).map(([title, htmlContents]) => (
                  <div key={title}>
                      <h4 className="font-semibold text-lg mb-2">{title}</h4>
                      {htmlContents.map((html, index) => (
                          <div key={index} className="prose-content text-gray-600" dangerouslySetInnerHTML={{ __html: html }} />
                      ))}
                  </div>
              ))}
          </div>
      </div>

      <div className="details-section mb-8"><h3>{ICONS.specs}Specifikace</h3><table className="w-full text-sm text-left"><tbody>{[...product.parameters, {name: 'Hmotnost', value: `${product.weight} kg`}, {name: 'Rozměry (D×Š×V)', value: `${product.length}×${product.width}×${product.height} cm`}, {name: 'Datum vytvoření', value: product.dates.created}, {name: 'Poslední změna', value: product.dates.changed || 'nezměněno'}].map((p,i) => <tr key={i} className="border-b"><th scope="row" className="px-4 py-2 font-medium bg-gray-50 w-1/3">{p.name}</th><td className="px-4 py-2">{p.value}</td></tr>)}</tbody></table></div>
      
      <RelatedProducts title="Související produkty" items={product.related} allProducts={allProducts} onProductSelect={onProductSelect} />
      <RelatedProducts title="Alternativní produkty" items={product.alternative} allProducts={allProducts} onProductSelect={onProductSelect} />
      <RelatedProducts title="Příslušenství" items={product.accessories} allProducts={allProducts} onProductSelect={onProductSelect} />
    </div>
  );
};