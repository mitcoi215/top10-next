'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';

interface CategoryPillsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

type CategoryButton = {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
};

export default function CategoryPills({ activeCategory, onSelectCategory }: CategoryPillsProps) {
  const [categories, setCategories] = useState<CategoryButton[]>(CATEGORIES as CategoryButton[]);

  // Load categories from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse categories:', e);
      }
    }
  }, []);

  return (
    <div className="flex justify-center gap-6 py-8 flex-wrap">
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(cat.id as CategoryType)}
          className="group flex flex-col items-center cursor-pointer transition-all"
          style={{ width: '120px', flexShrink: 0 }}
        >
          {/* Nút vuông với logo */}
          <div
            className={`flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 w-full h-24 transition-all
              ${activeCategory === cat.id ? 'ring-4 ring-gray-900' : ''}
              group-hover:ring-4 group-hover:ring-red-500`}
          >
            <img src={cat.icon} alt={cat.name} className="h-12 w-12" />
          </div>
          {/* Chữ bên dưới */}
          <span className={`mt-2 font-bold text-center break-words transition-colors ${
            activeCategory === cat.id ? 'text-gray-900' : 'text-gray-600'
          } group-hover:text-red-600`}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
