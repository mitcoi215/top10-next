'use client';

import { useState, useEffect } from 'react';
import CategoryPills from './CategoryPills';
import Top10List from './Top10List';
import { Top10Item, CategoryType } from '@/types';
import {
  lifestyleTop10,
  healthTop10,
  homeTop10,
  businessTop10,
  securityTop10
} from '@/data/top10Data';

interface HomeClientProps {
  initialCategory?: string;
}

// Default data for each category
const defaultData: Record<CategoryType, Top10Item[]> = {
  lifestyle: lifestyleTop10,
  health: healthTop10,
  home: homeTop10,
  business: businessTop10,
  security: securityTop10,
};

export default function HomeClient({ initialCategory = 'lifestyle' }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory as CategoryType);
  const [allTop10Data, setAllTop10Data] = useState(defaultData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTop10 = localStorage.getItem('top10_data');
    if (savedTop10) {
      try {
        const parsed = JSON.parse(savedTop10);
        setAllTop10Data({ ...defaultData, ...parsed });
      } catch (e) {
        console.error('Failed to parse top10 data:', e);
      }
    }
  }, []);

  // Get current category items
  const currentItems = allTop10Data[activeCategory] || [];

  return (
    <section className="container mx-auto px-4">
      {/* Category Pills */}
      <CategoryPills activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* Top10 List - Thay đổi theo category */}
      <Top10List items={currentItems} />
    </section>
  );
}
