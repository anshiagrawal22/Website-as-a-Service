import React from 'react';
import FashionStoreTemplate from './FashionStoreTemplate';
import RestaurantTemplate from './RestaurantTemplate';
import BeautySalonTemplate from './BeautySalonTemplate';
import CorporateTemplate from './CorporateTemplate';

export default function TemplateRenderer({ templateId = 'fashion', business, products, primaryColor, sectionVisibility, currency, previewMode = false }) {
  const normId = (templateId || 'fashion').toLowerCase();

  switch (normId) {
    case 'restaurant':
      return <RestaurantTemplate business={business} products={products} primaryColor={primaryColor} sectionVisibility={sectionVisibility} currency={currency} previewMode={previewMode} />;
    case 'beauty':
      return <BeautySalonTemplate business={business} products={products} primaryColor={primaryColor} sectionVisibility={sectionVisibility} currency={currency} previewMode={previewMode} />;
    case 'corporate':
      return <CorporateTemplate business={business} products={products} primaryColor={primaryColor} sectionVisibility={sectionVisibility} currency={currency} previewMode={previewMode} />;
    case 'fashion':
    default:
      return <FashionStoreTemplate business={business} products={products} primaryColor={primaryColor} sectionVisibility={sectionVisibility} currency={currency} previewMode={previewMode} />;
  }
}
