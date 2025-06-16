// SEO utility functions for dynamic meta tag management
export const updatePageTitle = (title) => {
  if (typeof document !== 'undefined') {
    document.title = `${title} | Doug's Found Wood - Handcrafted Furniture`;
  }
};

export const updateMetaDescription = (description) => {
  if (typeof document !== 'undefined') {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }
};

export const updateCanonicalUrl = (url) => {
  if (typeof document !== 'undefined') {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://www.dfw.earth${url}`);
    }
  }
};

// Gallery page SEO data
export const galleryPageSEO = {
  chairs: {
    title: 'Handcrafted Adirondack Chairs & Outdoor Seating',
    description:
      'Beautiful handcrafted Adirondack chairs, swings, and outdoor seating made from Maine cedar and mahogany. Custom outdoor furniture built to last.',
    keywords:
      'Adirondack chairs, outdoor furniture, cedar chairs, handcrafted seating, Maine furniture',
  },
  smallTable: {
    title: 'Custom Coffee Tables & Side Tables',
    description:
      'Unique coffee tables and side tables crafted from maple burl and spalted wood. Natural edge furniture showcasing wood grain beauty.',
    keywords:
      'coffee tables, side tables, maple burl, spalted wood, natural edge furniture',
  },
  largeTable: {
    title: 'Custom Dining Tables & Large Tables',
    description:
      'Handcrafted dining tables featuring glass tops and natural cedar root bases. Custom large tables for family gatherings.',
    keywords:
      'dining tables, glass top tables, cedar root base, custom dining furniture, large tables',
  },
  structure: {
    title: 'Custom Outdoor Structures & Playhouses',
    description:
      'Handcrafted outdoor structures including playhouses, storage units, and custom buildings made from sustainable Maine wood.',
    keywords:
      'outdoor structures, playhouses, custom buildings, storage units, Maine woodworking',
  },
  other: {
    title: 'Custom Woodworking & Unique Furniture',
    description:
      'Unique handcrafted furniture and woodworking pieces including doors, dressers, and custom items made from reclaimed wood.',
    keywords:
      'custom woodworking, handmade furniture, reclaimed wood, unique pieces, artisan furniture',
  },
};

// Product structured data generator
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: getCategoryName(product.type),
    brand: {
      '@type': 'Brand',
      name: "Doug's Found Wood",
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price.replace(/[^0-9-]/g, ''),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: "Doug's Found Wood",
      },
    },
    material: extractMaterials(product.description),
    artform: 'Woodworking',
    isHandmadeOrIndustrial: 'Handmade',
  };
};

const getCategoryName = (type) => {
  const categories = {
    chairs: 'Outdoor Furniture',
    smallTable: 'Living Room Furniture',
    largeTable: 'Dining Room Furniture',
    structure: 'Outdoor Structures',
    other: 'Custom Woodworking',
  };
  return categories[type] || 'Handcrafted Furniture';
};

const extractMaterials = (description) => {
  const materials = [];
  const desc = description.toLowerCase();

  if (desc.includes('cedar')) materials.push('Cedar');
  if (desc.includes('mahogany')) materials.push('Mahogany');
  if (desc.includes('maple')) materials.push('Maple');
  if (desc.includes('burl')) materials.push('Burl Wood');
  if (desc.includes('spalted')) materials.push('Spalted Wood');
  if (desc.includes('glass')) materials.push('Tempered Glass');

  return materials.join(', ') || 'Sustainably Sourced Wood';
};
