'use client';

import { useState, useEffect, useCallback } from 'react';
import CategoryPills from './CategoryPills';
import Top10List from './Top10List';
import { Top10Item, CategoryType } from '@/types';

interface HomeClientProps {
  initialCategory?: string;
}

// Type for API response
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
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

// Convert API Product to Top10Item format
const convertToTop10Item = (product: Product, categorySlug: string): Top10Item => ({
  id: product.id as unknown as number, // Keep as string but cast for type compatibility
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

export default function HomeClient({ initialCategory }: HomeClientProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('');
  const [currentItems, setCurrentItems] = useState<Top10Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);

      // Set initial active category
      if (data.length > 0) {
        const initialCat = initialCategory || data[0].slug;
        setActiveCategory(initialCat);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [initialCategory]);

  // Fetch products for active category
  const fetchProducts = useCallback(async () => {
    if (!activeCategory) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?category=${activeCategory}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const products: Product[] = await res.json();

      const items = products.map(p => convertToTop10Item(p, activeCategory));
      setCurrentItems(items);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setCurrentItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load products when category changes
  useEffect(() => {
    if (activeCategory) {
      fetchProducts();
    }
  }, [activeCategory, fetchProducts]);

  // Handle category selection
  const handleSelectCategory = (categorySlug: CategoryType) => {
    setActiveCategory(categorySlug);
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
        /* Top10 List - Changes based on category */
        <Top10List items={currentItems} category={activeCategory} />
      )}
    </section>
  );
}
