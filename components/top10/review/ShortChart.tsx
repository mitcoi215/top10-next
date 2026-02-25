'use client';

import Link from 'next/link';

interface ShortChartProduct {
  position: number;
  name: string;
  logo: string;
  tagline?: string;
  reviewHref: string;
  ctaHref: string;
}

interface ShortChartProps {
  title?: string;
  products: ShortChartProduct[];
}

export default function ShortChart({
  title = 'Editorial Reviews',
  products,
}: ShortChartProps) {
  return (
    <div data-testid="short-chart">
      <div data-testid="short-chart-container" data-layout="inner" className="ni-hshao3">
        <div className="ni-1yyz5zf">
          <div>{title}</div>
        </div>
        <div data-testid="top5-product-list" className="ni-1vitdzs">
          {products.map((product) => (
            <div key={product.position} data-testid="top5-product" className="ni-vv06vq">
              <a href={product.ctaHref} target="_blank" rel="noopener noreferrer" className="ni-3avijb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.logo}
                  alt={product.name}
                  className="ni-1uf4i2"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </a>
              <div className="ni-1q6j3a1">
                <Link href={product.reviewHref} className="ni-1pq7r8v">
                  {product.name}
                </Link>
                {product.tagline && (
                  <span className="ni-s89xxi">{product.tagline}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
