// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import HeaderServer from '@/components/HeaderServer';
import FooterServer from '@/components/FooterServer';
import prisma from '@/lib/db';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '10rating Best Services & Products Comparison',
  description:
    'Compare and shop the 10rating best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
  openGraph: {
    title: '10rating Best Services & Products Comparison',
    description:
      'Compare and shop the 10rating best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
    url: 'https://www.10rating.com',
    type: 'website',
    images: ['/10rating/1.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '10rating Best Services & Products Comparison',
    description:
      'Compare and shop the 10rating best services & products for you. Hosting, VPN, Health & Wellness, and more categories with expert reviews.',
    images: ['/10rating/1.jpg'],
  },
  metadataBase: new URL('https://www.10rating.com'),
};

// Fetch categories on server for Header and Footer
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
    });
    return categories;
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch categories once for both Header and Footer
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderServer categories={categories} />
        <main>{children}</main>
        <FooterServer categories={categories} />
      </body>
    </html>
  );
}
