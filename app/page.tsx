'use client';

import { useState } from 'react';
import HomeClient from '@/components/HomeClient';
import { CATEGORY_CONTENTS } from '@/lib/constants';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('lifestyle');

  return (
    <>
      {/* Header Top10 */}
      <section className="w-full bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Compare and shop the <span className="text-red-600">Top10</span> best services & products for you
          </h1>
        </div>x`
      </section>

      {/* Home Client: Category Pills + Category Content + Top10List */}
      <HomeClient initialCategory={activeCategory} />
    </>
  );
}
