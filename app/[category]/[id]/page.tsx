'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Top10Item, CategoryType } from '@/types';
import Link from 'next/link';
import { lifestyleTop10, healthTop10, homeTop10, businessTop10, securityTop10 } from '@/data/top10Data';

// Default data
const defaultData: Record<string, Top10Item[]> = {
  lifestyle: lifestyleTop10,
  health: healthTop10,
  home: homeTop10,
  business: businessTop10,
  security: securityTop10,
};

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as CategoryType;
  const itemId = parseInt(params.id as string);

  const [item, setItem] = useState<Top10Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Top10Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage, fallback to default data
    let allData = defaultData;

    const savedData = localStorage.getItem('top10_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge saved data with default data
        allData = { ...defaultData, ...parsed };
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    }

    const categoryItems = allData[category] || [];

    // Find the specific item
    const foundItem = categoryItems.find((i: Top10Item) => i.id === itemId);
    setItem(foundItem || null);

    // Get related items (same category, different id)
    const related = categoryItems.filter((i: Top10Item) => i.id !== itemId);
    setRelatedItems(related);

    setLoading(false);
  }, [category, itemId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item not found</h1>
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
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-red-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Item Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              {item.featured && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold">
                  Featured
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-red-600">#{item.rank}</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-3xl font-bold">{item.rating}</span>
                  <span className="text-gray-500">/5</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{item.description}</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-green-600">{item.price}</div>
              </div>

              <a
                href={item.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition text-center"
              >
                Visit Site →
              </a>
            </div>
          </div>

          {/* Detailed Review Section */}
          {item.detailedDescription && (
            <div className="border-t p-8 bg-gray-50">
              <h2 className="text-2xl font-bold mb-4">Detailed Review</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {item.detailedDescription}
                </p>
              </div>
            </div>
          )}

          {/* Features Section */}
          {item.features && item.features.length > 0 && (
            <div className="border-t p-8">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="grid md:grid-cols-2 gap-3">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pros & Cons */}
          <div className="border-t p-8 grid md:grid-cols-2 gap-8">
            {/* Pros */}
            {item.pros && item.pros.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-green-600">Pros</h2>
                <ul className="space-y-2">
                  {item.pros.map((pro, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {item.cons && item.cons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-red-600">Cons</h2>
                <ul className="space-y-2">
                  {item.cons.map((con, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Other Top Picks in This Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  href={`/${category}/${relatedItem.id}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-red-600">#{relatedItem.rank}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-red-600 transition">
                        {relatedItem.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>⭐ {relatedItem.rating}</span>
                        <span>•</span>
                        <span>{relatedItem.price}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
