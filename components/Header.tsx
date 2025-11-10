// 📍 File: components/Header.tsx
import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="flex items-center space-x-2">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <span className="text-xl font-bold text-white">10</span>
          </div>
          {/* Site Name */}
          <span className="text-xl font-bold text-gray-900">
            {SITE_CONFIG.name}
          </span>
        </Link>
      </div>
    </header>
  );
}
