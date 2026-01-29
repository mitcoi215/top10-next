import '@/styles/category.css';
import '@/styles/review.css';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';
import ArticleDetailContent from './ArticleDetailContent';

export const dynamic = 'force-dynamic';

// Types
interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Fetch article by slug
async function getArticle(slug: string, categorySlug: string) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        slug,
        category: { slug: categorySlug },
        status: 'published',
      },
      include: {
        category: true,
        author: true,
      },
    });
    return article;
  } catch {
    return null;
  }
}

// Fetch product by ID (legacy support)
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

// Fetch related articles
async function getRelatedArticles(categoryId: string, excludeSlug: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        categoryId,
        slug: { not: excludeSlug },
        status: 'published',
        articleType: { not: 'charticle' },
      },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });
    return articles;
  } catch {
    return [];
  }
}

// Fetch top products for sidebar
async function getTopProducts(categoryId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        status: 'published',
      },
      orderBy: { rank: 'asc' },
      take: 5,
    });
    return products;
  } catch {
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, id } = await params;

  // Try to find article first
  const article = await getArticle(id, category);
  if (article) {
    const description = article.excerpt || article.title;
    return {
      title: `${article.title} | Top10.com`,
      description: description.slice(0, 160),
      openGraph: {
        title: article.title,
        description: description.slice(0, 160),
        images: article.featuredImage ? [{ url: article.featuredImage }] : [],
        type: 'article',
      },
    };
  }

  // Try product by ID
  const product = await getProduct(id);
  if (product) {
    const description = product.description?.slice(0, 160) || '';
    return {
      title: `${product.name} - Top10 Rating`,
      description,
    };
  }

  return {
    title: 'Not Found - Top10.com',
    description: 'The requested page could not be found.',
  };
}


// Server Component
export default async function ArticleDetailPage({ params }: PageProps) {
  const { category: categorySlug, id: slug } = await params;

  // Try to find article first
  const article = await getArticle(slug, categorySlug);

  if (article) {
    const relatedArticles = await getRelatedArticles(article.categoryId, article.slug);
    const topProducts = await getTopProducts(article.categoryId);

    // Serialize data for client component
    const serializedArticle = {
      id: article.id,
      title: article.title,
      subtitle: article.subtitle,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      featuredImageAlt: article.featuredImageAlt,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      author: article.author ? { name: article.author.name, slug: article.author.slug, avatar: article.author.avatar } : null,
      category: article.category ? { name: article.category.name, slug: article.category.slug } : null,
    };

    const serializedRelatedArticles = relatedArticles.map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      featuredImage: a.featuredImage,
    }));

    const serializedTopProducts = topProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      logoUrl: p.logoUrl,
      ctaUrl: p.ctaUrl,
    }));

    return (
      <div className="review-list-page article-detail-page">
        <SetoffBox />
        <Navbar categorySlug={categorySlug} />
        <ArticleDetailContent
          article={serializedArticle}
          categorySlug={categorySlug}
          relatedArticles={serializedRelatedArticles}
          topProducts={serializedTopProducts}
        />
        <Footer />
      </div>
    );
  }

  // Fallback: Try product by ID (legacy)
  const product = await getProduct(slug);
  if (product) {
    return (
      <div className="min-h-screen bg-gray-50">
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
        <main className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
            {product.name}
          </h1>
          <article className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {product.description || ''}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    );
  }

  notFound();
}
