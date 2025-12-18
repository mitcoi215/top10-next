'use client';

import { CategoryType } from '@/types';

// Type for category from API
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryPillsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  categories?: Category[]; // Optional - passed from parent
}

export default function CategoryPills({ activeCategory, onSelectCategory, categories = [] }: CategoryPillsProps) {
  if (categories.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center" style={{ width: '120px' }}>
              <div className="w-full h-24 bg-gray-200 rounded-lg"></div>
              <div className="mt-2 h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-6 py-8 flex-wrap">
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(cat.slug as CategoryType)}
          className="group flex flex-col items-center cursor-pointer transition-all"
          style={{ width: '120px', flexShrink: 0 }}
        >
          {/* Square button with logo */}
          <div
            className={`flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 w-full h-24 transition-all
              ${activeCategory === cat.slug ? 'ring-4 ring-gray-900' : ''}
              group-hover:ring-4 group-hover:ring-red-500`}
          >
            <img src={cat.icon} alt={cat.name} className="h-12 w-12" />
          </div>
          {/* Text below */}
          <span className={`mt-2 font-bold text-center break-words transition-colors ${
            activeCategory === cat.slug ? 'text-gray-900' : 'text-gray-600'
          } group-hover:text-red-600`}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
