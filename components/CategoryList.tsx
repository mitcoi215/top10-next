'use client';

import { CATEGORIES } from '@/lib/constants';

interface CategoryListProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryList({ activeCategory, onSelectCategory }: CategoryListProps) {
  return (
    <div className="flex justify-center gap-6 py-8 flex-wrap">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onMouseEnter={() => onSelectCategory(cat.name)}
          className={`
            cursor-pointer 
            flex flex-col items-center justify-center 
            rounded-lg p-4 border border-gray-200 transition hover:text-red-600
            text-center
          `}
          style={{ width: '160px', height: '160px', minHeight: '160px', flexShrink: 0 }}
        >
          <img src={cat.icon} alt={cat.name} className="mb-2 h-16 w-16" />
          <span className="font-bold text-gray-900 break-words">{cat.name}</span>
        </div>
      ))}
    </div>
  );
}
