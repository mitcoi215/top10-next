import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import prisma from '@/lib/db';

// Types
interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Type for product with category
interface ProductWithCategory {
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
  category: {
    id: string;
    slug: string;
    name: string;
  } | null;
}

// Fetch product from database
async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    return product;
  } catch {
    return null;
  }
}

// Fetch related products
async function getRelatedProducts(categoryId: string, excludeId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
      },
      include: { category: true },
      orderBy: { rank: 'asc' },
      take: 6,
    });
    return products;
  } catch {
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found - Top10 Rating',
      description: 'The requested product could not be found.',
    };
  }

  const description = product.description.slice(0, 160);

  return {
    title: `${product.title} - Top10 Rating`,
    description,
    keywords: [product.title, product.category?.name || '', 'review', 'comparison', 'top 10'].filter(Boolean),
    openGraph: {
      title: product.title,
      description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: 'article',
      siteName: 'Top10 Rating',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `/${product.category?.slug || 'product'}/${product.id}`,
    },
  };
}

// Server Component - renders on server with full HTML
export default async function ItemDetailPage({ params }: PageProps) {
  const { category, id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);
  const categorySlug = product.category?.slug || category;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-red-600 hover:underline inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Title - H1 for SEO */}
        <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {product.title}
        </h1>

        {/* Featured Image with alt text for SEO */}
        <div className="mb-12">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Detailed Description - Markdown Rendering */}
        <article className="markdown-content prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {product.detailedDescription || product.description}
          </ReactMarkdown>
        </article>

        {/* Visit Site Button */}
        {product.affiliateLink && (
          <div className="mt-8">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Visit Site
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </main>

      {/* Related Items */}
      {relatedProducts.length > 0 && (
        <section className="bg-white border-t border-gray-200 py-16 mt-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Other Top Picks in This Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedItem: ProductWithCategory) => (
                <Link
                  key={relatedItem.id}
                  href={`/${categorySlug}/${relatedItem.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-red-300 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <img
                        src={relatedItem.image}
                        alt={relatedItem.title}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-bold text-red-600 mb-1">#{relatedItem.rank}</div>
                        <h3 className="font-semibold text-base text-gray-900 group-hover:text-red-600 transition line-clamp-2">
                          {relatedItem.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            description: product.description,
            image: product.image,
            review: {
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: product.rating || 5,
                bestRating: 5,
              },
              author: {
                '@type': 'Organization',
                name: 'Top10 Rating',
              },
            },
          }),
        }}
      />
    </div>
  );
}
