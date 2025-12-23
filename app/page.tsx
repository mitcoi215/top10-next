import { Metadata } from 'next';
import prisma from '@/lib/db';
import HomeClientSSR from '@/components/HomeClientSSR';

// Types
interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

// Static metadata for home page
export const metadata: Metadata = {
  title: 'Top10 Rating - Compare & Shop the Best Services & Products',
  description: 'Find and compare the top 10 best services and products across multiple categories. Make informed decisions with our expert reviews and ratings.',
  keywords: ['top 10', 'best products', 'reviews', 'comparison', 'ratings', 'services'],
  openGraph: {
    title: 'Top10 Rating - Compare & Shop the Best',
    description: 'Find and compare the top 10 best services and products across multiple categories.',
    type: 'website',
    siteName: 'Top10 Rating',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top10 Rating - Compare & Shop the Best',
    description: 'Find and compare the top 10 best services and products across multiple categories.',
  },
};

// Fetch categories from database
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

// Fetch products by category slug
async function getProductsByCategory(categorySlug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) return [];

    const products = await prisma.product.findMany({
      where: { categoryId: category.id },
      include: { category: true },
      orderBy: { rank: 'asc' },
    });
    return products;
  } catch {
    return [];
  }
}

// Server Component - renders on server with full HTML
export default async function HomePage({ searchParams }: PageProps) {
  const { category: categoryParam } = await searchParams;

  // Fetch categories on server
  const categories = await getCategories();

  // Determine initial category
  const initialCategory = categoryParam || (categories.length > 0 ? categories[0].slug : 'lifestyle');

  // Fetch initial products on server
  const initialProducts = await getProductsByCategory(initialCategory);

  return (
    <>
      {/* Header Section - Static content for SEO */}
      <section className="w-full bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Compare and shop the <span className="text-red-600">10rating</span> best services & products for you
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Expert reviews and comparisons to help you make the best choice
          </p>
        </div>
      </section>

      {/* Home Client with SSR data */}
      <HomeClientSSR
        initialCategory={initialCategory}
        initialCategories={categories}
        initialProducts={initialProducts}
      />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Top10 Rating',
            description: 'Compare and shop the best services & products',
            url: 'https://top10rating.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://top10rating.com/?category={search_term}',
              'query-input': 'required name=search_term',
            },
          }),
        }}
      />
    </>
  );
}
