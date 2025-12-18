'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Top10Item, CategoryType } from '@/types';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Type for API response
interface Category {
  id: string;
  slug: string;
  name: string;
}

interface Product {
  id: string;
  rank: number;
  title: string;
  description: string;
  detailedDescription: string | null;
  image: string;
  rating: number | null;
  price: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateLink: string;
  featured: boolean;
  categoryId: string;
  category?: Category;
}

// Convert API Product to Top10Item format
const convertToTop10Item = (product: Product, categorySlug: string): Top10Item => ({
  id: product.id as unknown as number,
  rank: product.rank,
  title: product.title,
  description: product.description,
  detailedDescription: product.detailedDescription || undefined,
  image: product.image,
  rating: product.rating || undefined,
  price: product.price || undefined,
  features: product.features,
  pros: product.pros,
  cons: product.cons,
  category: categorySlug,
  affiliateLink: product.affiliateLink,
  featured: product.featured,
});

export default function ItemDetailPage() {
  const params = useParams();
  const category = params.category as CategoryType;
  const itemId = params.id as string;

  const [item, setItem] = useState<Top10Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Top10Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product by ID
  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the specific product
      const res = await fetch(`/api/products/${itemId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Product not found');
          return;
        }
        throw new Error('Failed to fetch product');
      }
      const product: Product = await res.json();
      const categorySlug = product.category?.slug || category;
      setItem(convertToTop10Item(product, categorySlug));

      // Fetch related products (same category)
      const relatedRes = await fetch(`/api/products?category=${categorySlug}`);
      if (relatedRes.ok) {
        const products: Product[] = await relatedRes.json();
        const related = products
          .filter(p => p.id !== itemId)
          .map(p => convertToTop10Item(p, categorySlug));
        setRelatedItems(related);
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [itemId, category]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          <span className="text-xl text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error || 'Item not found'}</h1>
          <Link href="/" className="text-red-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-red-600 hover:underline inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {item.title}
        </h1>

        {/* Featured Image */}
        <div className="mb-12">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Detailed Description - Markdown Rendering */}
        <article className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {item.detailedDescription || item.description}
          </ReactMarkdown>
        </article>

        {/* Visit Site Button */}
        {item.affiliateLink && (
          <div className="mt-8">
            <a
              href={item.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Visit Site
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </main>

      {/* Related Items */}
      {relatedItems.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Other Top Picks in This Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  href={`/${category}/${relatedItem.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-red-300 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-bold text-red-600 mb-1">#{relatedItem.rank}</div>
                        <h3 className="font-semibold text-base text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                          {relatedItem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
