import '@/styles/category.css';
import '@/styles/review.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';
import TopReadsContent from './TopReadsContent';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string }>;
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true },
  });

  if (!category) {
    return { title: 'Articles Not Found' };
  }

  return {
    title: `${category.name} Guides and Comparisons | 10rating`,
    description: `Discover which ${category.name.toLowerCase()} options can help you make an informed decision.`,
  };
}

function Breadcrumb({ categorySlug, categoryName }: { categorySlug: string; categoryName: string }) {
  return (
    <div className="page-header">
      <div className="page-header__container">
        <div className="page-header__left">
          <div className="page-header__breadcrumb-offset">
            <ul className="breadcrumb">
              <li title="Home">
                <Link href="/" data-role="breadcrumb-link">Home</Link>
              </li>
              <li title={categoryName}>
                <Link href={`/${categorySlug}`} data-role="breadcrumb-link">{categoryName}</Link>
              </li>
              <li title="Top-reads">
                <span data-role="breadcrumb-link">Top-reads</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function CategoryTopReadsPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Fetch category with articles and products (exclude review articles)
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      articles: {
        where: {
          status: 'published',
          articleType: { not: 'charticle' }  // Exclude review articles
        },
        orderBy: { publishedAt: 'desc' },
      },
      products: {
        where: { status: 'published' },
        orderBy: { rank: 'asc' },
        take: 5,
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Serialize data for client component
  const serializedArticles = category.articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    subtitle: article.subtitle,
    excerpt: article.excerpt,
    featuredImage: article.featuredImage,
    featuredImageAlt: article.featuredImageAlt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
  }));

  const serializedProducts = category.products.map(product => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    logoUrl: product.logoUrl,
    ctaUrl: product.ctaUrl,
  }));

  return (
    <div className="review-list-page top-reads-page">
      {/* SetoffBox */}
      <SetoffBox />

      {/* Navbar */}
      <Navbar categorySlug={categorySlug} />

      {/* Breadcrumb */}
      <Breadcrumb categorySlug={categorySlug} categoryName={category.name} />
      {/* Client Content with styles */}
      <TopReadsContent
        categorySlug={categorySlug}
        categoryName={category.name}
        articles={serializedArticles}
        products={serializedProducts}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
