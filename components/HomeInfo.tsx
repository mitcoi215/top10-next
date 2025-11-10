'use client';

import { CATEGORY_CONTENTS } from '@/lib/constants';

interface HomeInfoProps {
  activeCategory: string;
}

export default function HomeInfo({ activeCategory }: HomeInfoProps) {
  const content = CATEGORY_CONTENTS[activeCategory] || [];

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
      {content.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow text-center">
          <img src={item.image} alt={item.title} className="mx-auto mb-2 h-20 w-20" />
          <h4 className="font-bold text-gray-900">{item.title}</h4>
          <p className="text-gray-600 mt-1">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
