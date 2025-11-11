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
    <section className="container mx-auto px-4 mb-16">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 tracking-tight">Top 10 Picks</h2>
      <div className="space-y-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${category}/${item.id}`}
            className="block group"
          >
            <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              {/* Header rank */}
              <header className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 flex items-center gap-4 border-b border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.rank}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 flex-1">
                  {item.title}
                </h3>
              </header>

              {/* Body */}
              <div className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="relative flex-shrink-0 w-full sm:w-56 h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      ⭐ Featured
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <p className="text-gray-700 leading-relaxed text-base mb-4 line-clamp-4">
                    {item.detailedDescription || item.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 text-red-600 font-bold text-lg group-hover:gap-4 transition-all duration-300">
                      View Details
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
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
