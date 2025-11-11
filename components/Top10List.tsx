'use client';

import { Top10Item, CategoryType } from '@/types';
import Link from 'next/link';

interface Top10ListProps {
  items: Top10Item[];
  category: CategoryType;
}

export default function Top10List({ items, category }: Top10ListProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Top 10 Picks</h2>
      <div className="space-y-8">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${category}/${item.id}`}
            className="block group"
          >
            <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              {/* Header rank */}
              <header className="bg-gray-100 px-4 py-2 flex items-center gap-4">
                <span className="font-bold text-xl">{item.rank}</span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition">
                  {item.title}
                </h3>
              </header>

              {/* Body */}
              <div className="p-4 flex flex-col sm:flex-row gap-4">
                <img src={item.image} alt={item.title} className="w-full sm:w-32 h-32 object-cover rounded" />
                <div>
                  <p className="text-gray-600">{item.description}</p>
                  {item.features && item.features.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                      {item.features.map((f, idx) => (
                        <li key={idx}>{f}</li>
                      ))}
                    </ul>
                  )}
                  <div className="text-red-600 font-bold mt-2 inline-block group-hover:underline">
                    View Details →
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
