'use client';

import { useState, useEffect, useCallback } from 'react';
import CategoryPills from './CategoryPills';
import Top10List from './Top10List';
import { Top10Item, CategoryType } from '@/types';

// Types for API response
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  featured?: boolean;
  order?: number;
}

interface Product {
  id: string;
  rank: number;
  title: string;
  description: string;
  detailedDescription: string | null;
  image: string;
  rating: number | null;
  price: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateLink: string;
  featured: boolean;
  categoryId: string;
  category?: Category;
}

interface HomeClientSSRProps {
  initialCategory: string;
  initialCategories: Category[];
  initialProducts: Product[];
}

// Convert API Product to Top10Item format
const convertToTop10Item = (product: Product, categorySlug: string): Top10Item => ({
  id: product.id as unknown as number,
  rank: product.rank,
  title: product.title,
  description: product.description,
  detailedDescription: product.detailedDescription || undefined,
  image: product.image,
  rating: product.rating || undefined,
  price: product.price || undefined,
  features: product.features,
  pros: product.pros,
  cons: product.cons,
  category: categorySlug,
  affiliateLink: product.affiliateLink,
  featured: product.featured,
});

export default function HomeClientSSR({
  initialCategory,
  initialCategories,
  initialProducts,
}: HomeClientSSRProps) {
  // Initialize with server-rendered data
  const [categories] = useState<Category[]>(initialCategories);
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);
  const [currentItems, setCurrentItems] = useState<Top10Item[]>(
    initialProducts.map(p => convertToTop10Item(p, initialCategory))
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products for active category (only when category changes client-side)
  const fetchProducts = useCallback(async (categorySlug: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?category=${categorySlug}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const products: Product[] = await res.json();

      const items = products.map(p => convertToTop10Item(p, categorySlug));
      setCurrentItems(items);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setCurrentItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle category selection
  const handleSelectCategory = (categorySlug: CategoryType) => {
    if (categorySlug === activeCategory) return;

    setActiveCategory(categorySlug);
    // Update URL without full page reload
    window.history.pushState({}, '', `/?category=${categorySlug}`);
    // Fetch new products
    fetchProducts(categorySlug);
  };

  return (
    <section className="container mx-auto px-4">
      {/* Category Pills */}
      <CategoryPills
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        categories={categories}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : (
        /* Top10 List - Rendered with server data initially */
        <Top10List items={currentItems} category={activeCategory} />
      )}
    </section>
  );
}
