'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductFeature {
  text: string;
  bold?: boolean;
}

interface ProductQuote {
  text: string;
  source: string;
  date: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  bottomLine: string | null;
  features: ProductFeature[];
  quote: ProductQuote | null;
  ctaText: string | null;
  ctaUrl: string | null;
  ribbon: string | null;
  reviewHref: string | null;
  reviewCount: string | null;
}

interface ProductListProps {
  products: Product[];
  categorySlug: string;
  initialShow?: number;
}

export default function ProductList({
  products,
  categorySlug,
  initialShow = 3
}: ProductListProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleProducts = expanded ? products : products.slice(0, initialShow);
  const hasMore = products.length > initialShow;

  return (
    <>
      <div className="chart__body__products" data-role="chart-body-products">
        {visibleProducts.map((product, idx) => {
          const features = (product.features as ProductFeature[]) || [];
          const quote = product.quote as ProductQuote | null;

          // Calculate actual position (always based on full list)
          const position = products.findIndex(p => p.id === product.id) + 1;

          return (
            <ProductCard
              key={product.id}
              position={position}
              productId={product.id}
              name={product.name}
              slug={product.slug}
              logo={product.logoUrl || '/top10-images/default-logo.png'}
              bottomLine={product.bottomLine || ''}
              features={features}
              quote={quote || undefined}
              ctaText={product.ctaText || 'Visit Site'}
              ctaHref={product.ctaUrl || '#'}
              ribbon={position === 1 ? (product.ribbon || 'Our Most Popular') : product.ribbon || undefined}
              reviewHref={product.reviewHref || `/${categorySlug}/reviews/${product.slug}`}
              reviewCount={product.reviewCount || undefined}
            />
          );
        })}
      </div>

      {hasMore && (
        <div className={` charticle-chart__bottom-line chart__show-more ${expanded ? 'expanded' : ''}`}>
          <span
            data-auto-name="show-more"
            className="chart__show-more__text"
            data-role="show-more"
            data-expanded={expanded ? 'true' : 'false'}
            data-less-more-after={initialShow}
            data-max-products-show={products.length}
            data-show-more-text="Show more"
            data-show-less-text="Show less"
            data-show-prefix="Showing Top"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </span>
        </div>
      )}
      <style jsx>{`
        .chart__show-more {
          display: flex;
          flex-direction: row;
          justify-content: center;
          margin-top: 5px;
          margin-bottom: 11px;
          background-color: transparent;
        }

        @media screen and (min-width: 1000px) {
          .chart__show-more {
            margin-bottom: -50px;
          }
        }

        .chart__show-more__text {
          align-self: flex-end;
          color: #797979;
          text-align: right;
          text-transform: capitalize;
          font-size: 14px;
          line-height: 20px;
          font-weight: 400;
          margin-bottom: 14px;
          margin-top: -29px;
          cursor: pointer;
        }

        @media screen and (min-width: 1000px) {
          .chart__show-more__text {
            margin-bottom: 10px;
            margin-top: 9px;
          }
        }

        .chart__show-more__text:hover {
          color: #1564bf;
        }

        @media screen and (min-width: 1000px) {
          .chart__show-more__text:hover {
            color: #2d2d2d;

          }
        }
        .charticle-chart__bottom-line {
            border-bottom: 1px solid #d5d5d5;
        }
      `}</style>
    </>
  );
}
