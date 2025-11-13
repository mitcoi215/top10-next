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
import { CATEGORIES } from '@/lib/constants';

interface HomeClientProps {
  initialCategory?: string;
}

// Default data for each category
const defaultData: Record<string, Top10Item[]> = {
  lifestyle: lifestyleTop10,
  health: healthTop10,
  home: homeTop10,
  business: businessTop10,
  security: securityTop10,
};

export default function HomeClient({ initialCategory }: HomeClientProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('');
  const [allTop10Data, setAllTop10Data] = useState<Record<string, Top10Item[]>>(defaultData);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load categories to determine first category
    const savedCategories = localStorage.getItem('categories');
    const categories = savedCategories ? JSON.parse(savedCategories) : CATEGORIES;

    // Set initial category
    const firstCategoryId = categories[0]?.id || 'lifestyle';
    setActiveCategory(initialCategory || firstCategoryId);

    // Load 10rating data
    const savedTop10 = localStorage.getItem('top10_data');
    if (savedTop10) {
      try {
        const parsed = JSON.parse(savedTop10);
        setAllTop10Data({ ...defaultData, ...parsed });
      } catch (e) {
        console.error('Failed to parse 10rating data:', e);
      }
    }
  }, [initialCategory]);

  // Get current category items
  const currentItems = allTop10Data[activeCategory] || [];

  return (
    <section className="container mx-auto px-4">
      {/* Category Pills */}
      <CategoryPills activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

      {/* 10rating List - Thay đổi theo category */}
      <Top10List items={currentItems} category={activeCategory} />
    </section>
  );
}
