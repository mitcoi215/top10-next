'use client';

import { CATEGORIES } from '@/lib/constants';

interface CategoryPillsProps {
  onHoverCategory: (category: string | null) => void;
}

export default function CategoryPills({ onHoverCategory }: CategoryPillsProps) {
  return (
    <div className="flex justify-center gap-6 py-8 flex-wrap">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          onMouseEnter={() => onHoverCategory(cat.id)}
          onMouseLeave={() => onHoverCategory(null)}
          className="flex flex-col items-center cursor-pointer"
          style={{ width: '120px', flexShrink: 0 }}
        >
          {/* Nút vuông với logo */}
          <div
            className={`flex items-center justify-center rounded-lg ${cat.color} w-full h-24`}
          >
            <img src={cat.icon} alt={cat.name} className="h-12 w-12" />
          </div>
          {/* Chữ bên dưới */}
          <span className="mt-2 font-bold text-center text-black break-words">
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}
