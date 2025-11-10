'use client';

import { CATEGORIES } from '@/lib/constants';

interface CategoryPillsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryPills({ activeCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div className="flex justify-center gap-6 py-8 flex-wrap">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          style={{ width: '120px', flexShrink: 0 }}
        >
          {/* Nút vuông với logo */}
          <div
            className={`flex items-center justify-center rounded-lg ${cat.color} w-full h-24 ${
              activeCategory === cat.id ? 'ring-4 ring-gray-900' : ''
            }`}
          >
            <img src={cat.icon} alt={cat.name} className="h-12 w-12" />
          </div>
          {/* Chữ bên dưới */}
          <span className={`mt-2 font-bold text-center break-words ${
            activeCategory === cat.id ? 'text-gray-900' : 'text-gray-600'
          }`}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
