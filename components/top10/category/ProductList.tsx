import ProductCard from './ProductCard';

interface Product {
  rank: number;
  name: string;
  tagline?: string;
  logo: string;
  score: number;
  scoreLabel: string;
  highlights: string[];
  ctaUrl: string;
  ctaText?: string;
  ribbon?: string;
  bestFor?: string;
  reviewUrl?: string;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  return (
    <div className="chart">
      <div className="chart__body">
        <div className="chart__body__products">
          {products.map((product) => (
            <ProductCard key={product.rank} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
