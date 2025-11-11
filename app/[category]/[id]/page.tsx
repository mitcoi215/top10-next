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
              <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{item.description}</p>

              <a
                href={item.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition text-center inline-block"
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
                    <img
                      src={relatedItem.image}
                      alt={relatedItem.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="text-lg font-bold text-red-600 mb-1">#{relatedItem.rank}</div>
                      <h3 className="font-semibold text-base group-hover:text-red-600 transition">
                        {relatedItem.title}
                      </h3>
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
