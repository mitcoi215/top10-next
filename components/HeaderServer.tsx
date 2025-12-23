import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';
import SearchBar from './SearchBar';

// Type for category
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  featured: boolean;
  order?: number;
}

interface HeaderServerProps {
  categories: Category[];
}

// Server Component - renders on server with full HTML
export default function HeaderServer({ categories }: HeaderServerProps) {
  // Filter featured categories, or take first 4 if none are featured
  const featuredCategories = categories.filter(cat => cat.featured);
  const displayCategories = featuredCategories.length > 0 ? featuredCategories : categories.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left Side */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/icons/logo.png"
              alt="10rating"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-gray-900">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Navigation + Search - Right Side */}
          <div className="flex items-center gap-6">
            {/* Featured Categories Navigation - Server Rendered for SEO */}
            <nav className="hidden md:flex items-center gap-4">
              {displayCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
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

            {/* Search Bar - Client Component for interactivity */}
            <SearchBar />

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
