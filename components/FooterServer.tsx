import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

// Type for category
interface Category {
  id: string;
  slug: string;
  name: string;
}

interface FooterServerProps {
  categories: Category[];
}

// Server Component - renders on server with full HTML for SEO
export default function FooterServer({ categories }: FooterServerProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Company Info */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {SITE_CONFIG.name}
            </h3>
            <p className="text-sm text-gray-600">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Categories - Server Rendered for SEO */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/?category=${category.slug}`}
                    className="text-sm text-gray-600 hover:text-red-600"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-red-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-red-600">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-red-600">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-red-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-red-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-gray-600">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
