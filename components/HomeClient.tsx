'use client';

import { useState, useEffect } from 'react';
import CategoryPills from './CategoryPills';
import Top10List from './Top10List';
import { CATEGORY_CONTENTS } from '@/lib/constants';
import { lifestyleTop10 } from '@/data/top10Data';
import { Top10Item } from '@/types';

interface HomeClientProps {
  initialCategory?: string;
}

export default function HomeClient({ initialCategory = 'lifestyle' }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [categoryContents, setCategoryContents] = useState(CATEGORY_CONTENTS);
  const [top10Items, setTop10Items] = useState<Top10Item[]>(lifestyleTop10);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load category contents
    const savedContents = localStorage.getItem('category_contents');
    if (savedContents) {
      setCategoryContents(JSON.parse(savedContents));
    }

    // Load top10 data
    const savedTop10 = localStorage.getItem('top10_data');
    if (savedTop10) {
      const allData = JSON.parse(savedTop10);
      // Use lifestyle data for Top10List
      if (allData.lifestyle) {
        setTop10Items(allData.lifestyle);
      }
    }
  }, []);

  const contents = categoryContents[activeCategory] || [];

  return (
    <section className="container mx-auto px-4">
      {/* Category Pills */}
      <CategoryPills activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* Nội dung con dưới mỗi category - Chỉ thay đổi khi click category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {contents.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            {/* Title và Description */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h4>
              <p className="text-gray-600 text-sm mb-6">{item.description}</p>
            </div>

            {/* 2 nút Explore và Compare */}
            <div className="flex flex-col gap-2">
              <a
                href={item.link}
                className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-900"
              >
                <span>Explore</span>
                <span>→</span>
              </a>
              <a
                href={item.link}
                className="flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-900"
              >
                <span>Compare</span>
                <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Top10 List - Nội dung cố định, không thay đổi */}
      <Top10List items={top10Items} />
    </section>
  );
}
