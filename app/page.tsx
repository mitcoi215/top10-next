'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'lifestyle';

  return (
    <>
      {/* Header 10rating */}
      <section className="w-full bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Compare and shop the <span className="text-red-600">10rating</span> best services & products for you
          </h1>
        </div>
      </section>

      {/* Home Client: Category Pills + Category Content + Top10List */}
      <HomeClient initialCategory={categoryFromUrl} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
