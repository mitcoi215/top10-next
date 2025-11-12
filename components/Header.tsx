'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG, CATEGORIES } from '@/lib/constants';
import { CategoryType } from '@/types';

type CategoryButton = {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  featured?: boolean;
};

export default function Header() {
  const router = useRouter();
  const [featuredCategories, setFeaturedCategories] = useState<CategoryButton[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load featured categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        const allCategories: CategoryButton[] = JSON.parse(saved);
        const featured = allCategories.filter((cat) => cat.featured);
        setFeaturedCategories(featured);
      } catch (e) {
        console.error('Failed to load categories:', e);
      }
    } else {
      // Use default categories if no saved data
      const featured = (CATEGORIES as CategoryButton[]).slice(0, 4); // First 4 as featured
      setFeaturedCategories(featured);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home with search query (we'll implement search later)
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center">
            <img
              src="/icons/logo.png"
              alt="Top10"
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation + Search - Right Side */}
          <div className="flex items-center gap-6">
            {/* Featured Categories Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.id}`}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-red-600 transition"
              >
                About Us
              </Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-64 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
