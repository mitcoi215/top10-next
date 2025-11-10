// 📍 File: components/SEO.tsx
// 🌐 SERVER COMPONENT - Render metadata trên server

import { SEOData } from '@/types';
import { SITE_CONFIG } from '@/lib/constants';

interface SEOProps {
  data?: SEOData; // Cho phép không truyền data
}

export default function SEO({ data }: SEOProps) {
  // Nếu không có data, dùng mặc định từ SITE_CONFIG
  const description = data?.description || SITE_CONFIG.description;
  const title = data?.title || SITE_CONFIG.name;

  // Generate JSON-LD structured data cho Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
