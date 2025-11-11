'use client';

import { useState } from 'react';
import CategoryPills from './CategoryPills';
import Top10List from './Top10List';
import { CATEGORY_CONTENTS } from '@/lib/constants';
import { lifestyleTop10 } from '@/data/top10Data';

interface HomeClientProps {
  initialCategory?: string;
}

export default function HomeClient({ initialCategory = 'lifestyle' }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const contents = CATEGORY_CONTENTS[activeCategory] || [];

  return (
    <section className="container mx-auto px-4">
      {/* Category Pills */}
      <CategoryPills activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* Nội dung con dưới mỗi category - Chỉ thay đổi khi click category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {contents.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h4 className="font-bold text-gray-900">{item.title}</h4>
              <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top10 List - Nội dung cố định, không thay đổi */}
      <Top10List items={lifestyleTop10} />
    </section>
  );
}
