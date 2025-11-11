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

        {/* Detailed Description */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-line">
            {item.detailedDescription || item.description}
          </div>
        </div>
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
