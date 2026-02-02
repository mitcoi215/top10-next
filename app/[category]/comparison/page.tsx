import '@/styles/compare.css';
import '@/styles/category.css';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/db';
import NissimProductCard from '@/components/top10/compare/NissimProductCard';
import Top3ProductsBar from '@/components/top10/compare/Top3ProductsBar';
import ComparisonSidebar from '@/components/top10/compare/ComparisonSidebar';
import Navbar from '@/components/top10/category/Navbar';
import Breadcrumb from '@/components/top10/category/Breadcrumb';
import Footer from '@/components/top10/category/Footer';
import FAQSection from '@/components/top10/category/FAQSection';
import CloserLook from '@/components/top10/category/CloserLook';

export const dynamic = 'force-dynamic';

interface MetadataProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: { name: true, metaTitle: true, metaDescription: true, ogImage: true },
  });

  if (!category) {
    return { title: 'Compare - Not Found' };
  }

  const title = `Compare Best ${category.name} 2026 | Top10`;
  const description = category.metaDescription || `Compare the best ${category.name.toLowerCase()} side by side. Features, pricing, and expert recommendations.`;

  return {
    title,
    description,
    openGraph: { title, description, images: category.ogImage ? [category.ogImage] : [] },
  };
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function ComparePage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        where: { status: 'published' },
        orderBy: { rank: 'asc' },
        take: 10,
      },
    },
  });

  if (!category) {
    notFound();
  }

  const products = category.products;
  const faqs = (category.faqs as any[]) || [];

  // Fetch articles for the sidebar "Must Reads"
  const articles = await prisma.article.findMany({
    where: { categoryId: category.id, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { slug: true, title: true, publishedAt: true },
  });

  // Parse features from product highlights or features JSON
  function getProductFeatures(product: typeof products[0]): string[] {
    const features = product.features as Record<string, string | boolean> | string[] | null;
    if (Array.isArray(features)) {
      return features.slice(0, 5).map(f => String(f));
    }
    if (features && typeof features === 'object') {
      return Object.entries(features)
        .filter(([, v]) => v && v !== 'false')
        .slice(0, 5)
        .map(([k, v]) => (typeof v === 'string' && v !== 'true' ? v : k.replace(/([A-Z])/g, ' $1').trim()));
    }
    // Fallback to highlights
    const highlights = product.highlights as Record<string, string> | null;
    if (highlights) {
      return Object.entries(highlights)
        .slice(0, 5)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}`);
    }
    return [];
  }

  const cat = category as any;
  const displayName = cat.comparisonTitle || category.heroTitle || `Best ${category.name} Comparison`;
  const heroSubtitle = cat.comparisonSubtitle || category.metaDescription || `Compare the top ${category.name.toLowerCase()} side by side to find the best fit for your needs.`;
  const heroImage = cat.comparisonHeroImage || cat.heroImage || null;

  // Best overall = first product (highest ranked)
  const bestProduct = products[0] || null;

  // Top 3 products data for the bar above chart
  const top3ForBar = products.slice(0, 3).map((p: any) => ({
    name: p.name,
    slug: p.slug,
    logoUrl: p.logoUrl || undefined,
    ctaUrl: p.ctaUrl || undefined,
    ctaText: p.ctaText || 'Visit Site',
    overallScore: p.overallScore || undefined,
    scoreLabel: p.scoreLabel || undefined,
    bottomLine: p.bottomLine || p.tagline || undefined,
    ribbon: p.ribbon || undefined,
  }));

  // Top 3 picks for CloserLook / mini-reviews section
  const top3Products = products.slice(0, 3);
  const closerLookItems = top3Products.map((product: any, idx: number) => {
    const highlights = product.highlights as Record<string, string> | null;
    const bulletPoints = highlights
      ? Object.entries(highlights).map(([key, value]) => ({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()).trim(),
          value: value,
        }))
      : [];

    return {
      position: idx + 1,
      name: product.name,
      slug: product.slug,
      logo: product.logoUrl || '/top10-images/default-logo.png',
      tagline: product.tagline || product.bottomLine || '',
      bestFor: product.bestFor || '',
      basePrice: product.basePrice || 'Contact for pricing',
      reviewHref: product.reviewHref || `/${categorySlug}/reviews/${product.slug}`,
      ctaHref: product.ctaUrl || '#',
      ctaText: product.ctaText || 'Visit Site',
      overallScore: product.overallScore || undefined,
      scoreLabel: product.scoreLabel || undefined,
      description: product.heroSummary || undefined,
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
      pros: product.pros.length > 0 ? product.pros : undefined,
      cons: product.cons.length > 0 ? product.cons : undefined,
      images: product.images.length > 0 ? product.images : undefined,
      highlightText: product.tagline || product.bestFor || undefined,
      iconImage: product.logoUrl || undefined,
    };
  });

  // Review products for sidebar
  const reviewProducts = products.slice(0, 3).map((p: any) => ({
    slug: p.slug,
    name: p.name,
    logoUrl: p.logoUrl || null,
  }));

  return (
    <>
      <Navbar categorySlug={categorySlug} />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category.name, href: `/${categorySlug}` },
          { label: 'Comparison' },
        ]}
      />

      {/* Hero Section */}
      <div className="compare-hero" data-testid="hero-container">
        <div className="compare-hero__image-container">
          <div
            className="compare-hero__bg"
            style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
          />
          <div className="compare-hero__content">
            {/* Last Updated badge */}
            <div className="compare-hero__updated" data-testid="last-updated">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.3 5.3l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L6.75 8.7l3.47-3.47a.75.75 0 011.06 1.06z" />
              </svg>
              <span>Last Updated:</span>
              <span> {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
            <h1>{displayName}</h1>
            <p className="compare-hero__subtitle">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Top 3 Products Bar (above chart) */}
      {top3ForBar.length > 0 && (
        <Top3ProductsBar
          title={`Top 3 ${category.name} Services`}
          products={top3ForBar}
          categorySlug={categorySlug}
        />
      )}

      {/* Main Content: 3-column layout (left sidebar | center chart | right sidebar) */}
      <main data-role="chart" className="compare-main">
        <div className="compare-main__row">
          <div className="compare-main__center">

            {/* Chart Body - Product Cards (vertical stack) */}
            <div data-role="chart-body" data-pli-name="Comparison" className="compare-chart-body">
              <div role="list" className="compare-card-list">
                {products.map((product: any) => (
                  <NissimProductCard
                    key={product.slug}
                    position={product.rank || 0}
                    name={product.name}
                    slug={product.slug}
                    categorySlug={categorySlug}
                    logoUrl={product.logoUrl || undefined}
                    bottomLine={product.bottomLine || product.tagline || undefined}
                    ribbon={product.ribbon || undefined}
                    features={getProductFeatures(product)}
                    ctaUrl={product.ctaUrl || undefined}
                    ctaText={product.ctaText || 'Visit Site'}
                    reviewCount={product.reviewCount || undefined}
                    overallScore={product.overallScore || undefined}
                    scoreLabel={product.scoreLabel || undefined}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Best Overall Sidebar (desktop only, right side) */}
          <aside className="compare-sidebar">
            {/* Left Sidebar (social proof, score disclaimer, must reads, reviews) */}
          <ComparisonSidebar
            categoryName={category.name}
            categorySlug={categorySlug}
            articles={articles}
            reviewProducts={reviewProducts}
          />
            {/* {bestProduct && (
              <div className="compare-best-overall">
                <div className="compare-best-overall__title">
                  Our Best {category.name} Provider
                </div>
                <div className="nissim-card--highlighted">
                  <div className="nissim-card--highlighted__banner">
                    {(bestProduct as any).bestFor || 'Best Overall'}
                  </div>
                  <NissimProductCard
                    position={(bestProduct as any).rank || 1}
                    name={(bestProduct as any).name}
                    slug={(bestProduct as any).slug}
                    categorySlug={categorySlug}
                    logoUrl={(bestProduct as any).logoUrl || undefined}
                    bottomLine={(bestProduct as any).bottomLine || (bestProduct as any).tagline || undefined}
                    features={getProductFeatures(bestProduct as any)}
                    ctaUrl={(bestProduct as any).ctaUrl || undefined}
                    ctaText={(bestProduct as any).ctaText || 'Visit Site'}
                    overallScore={(bestProduct as any).overallScore || undefined}
                    scoreLabel={(bestProduct as any).scoreLabel || undefined}
                  />
                </div>
              </div>
            )} */}
          </aside>
        </div>

        {/* Below chart sections */}
        <div className="compare-below-chart">
          {/* FAQ Section */}
          {faqs.length > 0 && (
            <div className="compare-content-sections">
              <FAQSection items={faqs.map((f: any) => ({ question: f.question || f.q || '', answer: f.answer || f.a || '' }))} />
            </div>
          )}

          {/* Our Top 3 Picks - reuses CloserLook component from category page */}
          {closerLookItems.length > 0 && (
            <div className="compare-content-sections">
              <CloserLook
                title="Our Top 3 Picks"
                items={closerLookItems}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
