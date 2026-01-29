import '@/styles/category.css';
import '@/styles/review.css';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';
import FAQSection from '@/components/top10/category/FAQSection';
import {
  ReviewHero,
  Highlights,
  ProsAndCons,
  ScoreTable,
  ReviewContent,
  ShortChart,
  MustReads,
  SummarySection,
  ProductLogoCTA,
  TrustSection,
  AuthorBio,
  VideoEmbed,
} from '@/components/top10/review';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
      category: { slug: categorySlug },
    },
    select: {
      name: true,
      reviewTitle: true,
      reviewSubtitle: true,
    },
  });

  if (!product) {
    return { title: 'Review Not Found' };
  }

  return {
    title: product.reviewTitle || `${product.name} Review | Top10.com`,
    description: product.reviewSubtitle || `Read our in-depth review of ${product.name}`,
  };
}

export default async function ProductReviewPage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;

  // Fetch product with category and author
  const product = await prisma.product.findFirst({
    where: {
      slug,
      category: { slug: categorySlug },
      status: 'published',
    },
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
          slug: true,
          bio: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products for sidebar (top 5 from same category)
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.category.id,
      status: 'published',
    },
    orderBy: { rank: 'asc' },
    take: 5,
    select: {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      tagline: true,
      ctaUrl: true,
      rank: true,
    },
  });

  // Fetch must-read articles for the category
  const mustReadArticles = await prisma.article.findMany({
    where: {
      categoryId: product.category.id,
      status: 'published',
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
    },
  });

  // Parse scores from JSON - can be object or array
  const scoresData = product.scores as Record<string, number> | any[] | null;
  const scores = scoresData
    ? Array.isArray(scoresData)
      ? scoresData
      : Object.entries(scoresData).map(([key, value]) => ({
          category: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          score: value,
        }))
    : [];
  const faqs = (product.faqs as any[]) || [];
  const highlights = product.highlights as Record<string, string> | null;

  // Convert highlights object to array format for Highlights component
  const highlightItems = highlights
    ? Object.entries(highlights).map(([key, value]) => ({
        title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: value,
      }))
    : [];

  return (
    <div className="review-page ni-1le0256">
      {/* SetoffBox */}
      <SetoffBox />

      {/* Navbar */}
      <Navbar categorySlug={categorySlug} />

      {/* Review Hero */}
      <ReviewHero
        productName={product.name}
        title={product.reviewTitle || `${product.name} Review`}
        subtitle={product.reviewSubtitle || product.tagline || ''}
        rating={product.rating || 0}
        reviewCount={product.reviewCount || ''}
        authorName={product.author?.name || 'Top10 Team'}
        authorImage={product.author?.avatar || '/top10-images/default-avatar.png'}
        authorSlug={product.author?.slug || ''}
        updatedDate={product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }) : ''}
        readTime={product.readTime || '5 min'}
        productLogo={product.logoUrl || '/top10-images/placeholder.png'}
        ctaHref={product.ctaUrl || '#'}
        ctaText={product.ctaText || 'Visit Site'}
      />

      {/* Main Content Area */}
      <div className="review-main-content">
        {/* Left Column - Main Content */}
        <div className="review-main-left">
          {/* Highlights */}
          {highlightItems.length > 0 && (
            <Highlights items={highlightItems} />
          )}

          {/* Summary Section - "Is X Worth Signing Up For?" */}
          {product.heroSummary && (
            <SummarySection
              title={product.summaryTitle || `Is ${product.name} Worth Signing Up For?`}
              content={product.heroSummary}
            />
          )}

          {/* Video Embed */}
          {product.videoUrl && (
            <VideoEmbed url={product.videoUrl} />
          )}

          {/* Pros and Cons */}
          {(product.pros.length > 0 || product.cons.length > 0) && (
            <ProsAndCons
              pros={product.pros}
              cons={product.cons}
            />
          )}

          {/* Product Logo & CTA */}
          <ProductLogoCTA
            logo={product.logoUrl || '/top10-images/placeholder.png'}
            productName={product.name}
            ctaText={product.ctaText || 'Visit Site'}
            ctaHref={product.ctaUrl || '#'}
          />

          {/* Score Table */}
          {scores.length > 0 && (
            <ScoreTable
              title={`${product.name} at a Glance`}
              overallScore={product.overallScore || 0}
              items={scores.map((s: any) => ({
                category: s.category || s.name,
                score: s.score || s.value || 0,
                description: s.description,
              }))}
            />
          )}

          {/* Review Content */}
          {product.mainContent && (
            <ReviewContent content={product.mainContent} />
          )}

          {/* Trust Section */}
          <TrustSection />

          {/* Product Logo & CTA (repeated) */}
          <ProductLogoCTA
            logo={product.logoUrl || '/top10-images/placeholder.png'}
            productName={product.name}
            ctaText={product.ctaText || 'Visit Site'}
            ctaHref={product.ctaUrl || '#'}
          />

          {/* Author Bio */}
          {product.author && (
            <AuthorBio
              name={product.author.name}
              avatar={product.author.avatar || undefined}
              bio={product.author.bio || undefined}
              slug={product.author.slug || undefined}
            />
          )}

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <FAQSection
              items={faqs.map((faq: any) => ({
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          )}
        </div>

        {/* Right Column - Sidebar */}
        <aside className="review-sidebar">
          {/* Short Chart - Editorial Reviews */}
          <ShortChart
            title="Editorial Reviews"
            products={relatedProducts.map((p, index) => ({
              position: index + 1,
              name: p.name,
              logo: p.logoUrl || '/top10-images/placeholder.png',
              tagline: p.tagline || '',
              reviewHref: `/${categorySlug}/reviews/${p.slug}`,
              ctaHref: p.ctaUrl || '#',
            }))}
          />
        </aside>
      </div>

      {/* Must Reads Section */}
      {mustReadArticles.length > 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 16px 48px',
        }}>
          <MustReads
            title="Must Reads"
            articles={mustReadArticles.map(article => ({
              title: article.title,
              image: article.featuredImage || '/top10-images/placeholder.png',
              href: `/${categorySlug}/articles/${article.slug}`,
            }))}
          />
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
