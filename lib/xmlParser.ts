// xmlParser.ts
import { Product } from '../types';
import JSZip from 'jszip';

// In-memory cache
let cachedData: { products: Product[], brands: string[] } | null = null;

export async function getProductData(): Promise<{ products: Product[], brands: string[] }> {
  if (cachedData) {
    console.log("Returning cached data.");
    return cachedData;
  }

  console.log("Fetching and parsing new data...");
  const proxyUrl = 'https://corsproxy.io/?';
  const zipFileUrl = 'https://www.retailys.cz/wp-content/uploads/astra_export_xml.zip';
  const targetUrl = proxyUrl + encodeURIComponent(zipFileUrl);

  const response = await fetch(targetUrl);
  if (!response.ok) throw new Error(`HTTP error fetching ZIP! status: ${response.status}`);

  const zipBlob = await response.blob();
  const zip = await new JSZip().loadAsync(zipBlob);
  
  const xmlFile = zip.file('export_full.xml');
  if (!xmlFile) throw new Error('export_full.xml not found in the ZIP archive.');

  const xmlText = await xmlFile.async('string');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");

  if (xmlDoc.querySelector("parsererror")) throw new Error("Failed to parse XML.");

  const itemsNode = xmlDoc.querySelector('items');
  if (!itemsNode) throw new Error("<items> tag not found in XML.");

  const uniqueBrands = new Set<string>();
  const parsedProducts: Product[] = Array.from(itemsNode.querySelectorAll(':scope > item')).map((item, index) => {
    const getAttr = (attr: string) => item.getAttribute(attr) || '';
    const getFloat = (attr: string) => parseFloat(getAttr(attr)) || 0;
    const getBool = (attr: string) => getAttr(attr) === 'true';

    const brand = getAttr('brand') || 'Neznámá';
    if (brand !== 'Neznámá') uniqueBrands.add(brand);
    
    const descriptions = Array.from(item.querySelectorAll('descriptions > description')).map(d => ({ title: d.getAttribute('title') || '', html: d.textContent || '' }));
    const parameters = Array.from(item.querySelectorAll('parameters > parameter')).map(p => ({ name: p.querySelector('name')?.textContent || '', value: p.querySelector('value')?.textContent || '' }));
    const photoGallery = Array.from(item.querySelectorAll('gallery > photo')).map(p => p.textContent || '');
    const related = Array.from(item.querySelectorAll('related > item')).map(r => ({ name: r.getAttribute('name') || '', code: r.getAttribute('code') || '' }));
    const alternative = Array.from(item.querySelectorAll('alternative > item')).map(r => ({ name: r.getAttribute('name') || '', code: r.getAttribute('code') || '' }));
    const accessories = Array.from(item.querySelectorAll('accessories > item')).map(r => ({ name: r.getAttribute('name') || '', code: r.getAttribute('code') || '' }));
    const spareParts = Array.from(item.querySelectorAll('parts > part > item')).map(p => ({ name: p.getAttribute('name') || '', code: p.getAttribute('code') || '' }));

    return {
      id: index,
      name: getAttr('name') || 'N/A',
      code: getAttr('code'),
      brand,
      image: getAttr('image') || 'https://placehold.co/600x400/e2e8f0/4a5568?text=No+Image',
      photoGallery: [getAttr('image'), ...photoGallery].filter(Boolean),
      inStock: getBool('stock'),
      isNew: getBool('new'),
      weight: getFloat('weight'),
      length: getFloat('length'),
      width: getFloat('width'),
      height: getFloat('height'),
      prices: { czk: getFloat('czk'), eur: getFloat('eur'), czksmap: getFloat('czksmap'), eursmap: getFloat('eursmap') },
      dates: { created: getAttr('created'), changed: getAttr('changed') },
      descriptions,
      parameters,
      related,
      alternative,
      accessories,
      spareParts,
      hasSpareParts: spareParts.length > 0,
    };
  });
  
  cachedData = {
      products: parsedProducts,
      brands: ['', ...Array.from(uniqueBrands).sort()]
  };

  return cachedData;
}