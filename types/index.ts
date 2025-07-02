// types / index.ts
export interface Product {
  id: number;
  name: string;
  code: string;
  brand: string;
  image: string;
  photoGallery: string[];
  inStock: boolean;
  isNew: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  prices: {
    czk: number;
    eur: number;
    czksmap: number;
    eursmap: number;
  };
  dates: {
    created: string;
    changed: string;
  };
  descriptions: Array<{ title: string; html: string }>;
  parameters: Array<{ name: string; value: string }>;
  related: Array<{ name: string; code: string }>;
  alternative: Array<{ name: string; code: string }>;
  accessories: Array<{ name: string; code: string }>;
  spareParts: Array<{ name: string; code: string }>;
  hasSpareParts: boolean;
}