'use client';

import { Top10Item } from '@/types';

interface Top10ListProps {
  items: Top10Item[];
}

export default function Top10List({ items }: Top10ListProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Top 10 Picks</h2>
      <div className="space-y-8">
        {items.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Header rank */}
            <header className="bg-gray-100 px-4 py-2 flex items-center gap-4">
              <span className="font-bold text-xl">{item.rank}</span>
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
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
                {item.affiliateLink && (
                  <a
                    href={item.affiliateLink}
                    className="text-red-600 font-bold mt-2 inline-block"
                  >
                    Check it out
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
