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
      },
    },
  });

  if (!category) {
    notFound();
  }

  const cat = category as any;
  const faqs = (category.faqs as any[]) || [];

  // Apply custom comparison ordering if configured, otherwise use rank order
  const comparisonProductOrder: string[] = cat.comparisonProductOrder || [];
  let products = category.products;
  if (comparisonProductOrder.length > 0) {
    const ordered = comparisonProductOrder
      .map((id: string) => category.products.find((p: any) => p.id === id))
      .filter(Boolean) as typeof category.products;
    // Append any products not in the custom order
    const remaining = category.products.filter((p: any) => !comparisonProductOrder.includes(p.id));
    products = [...ordered, ...remaining];
  }
  // Deduplicate by product id (comparison data may have duplicates)
  const seen = new Set<string>();
  products = products.filter((p: any) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
  // Limit to 10 products for display
  products = products.slice(0, 10);

  // Fetch articles for the sidebar "Must Reads"
  const articles = await prisma.article.findMany({
    where: { categoryId: category.id, status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: { slug: true, title: true, publishedAt: true },
  });

  // Parse features for comparison page - prefer comparisonFeatures over review features
  function getProductFeatures(product: typeof products[0]): string[] {
    const p = product as any;

    // Priority 1: Use comparison-specific features if available
    const compFeatures = p.comparisonFeatures as string[] | null;
    if (Array.isArray(compFeatures) && compFeatures.length > 0) {
      return compFeatures.slice(0, 5);
    }

    // Fallback: Use review features
    const features = p.features as Record<string, string | boolean> | string[] | null;
    if (Array.isArray(features)) {
      return features.slice(0, 5).map((f: any) => String(typeof f === 'object' ? f.text : f));
    }
    if (features && typeof features === 'object') {
      return Object.entries(features)
        .filter(([, v]) => v && v !== 'false')
        .slice(0, 5)
        .map(([k, v]) => (typeof v === 'string' && v !== 'true' ? v : k.replace(/([A-Z])/g, ' $1').trim()));
    }
    return [];
  }

  // Hero settings
  const displayName = cat.comparisonTitle || category.heroTitle || `Best ${category.name} Comparison`;
  const heroSubtitle = cat.comparisonSubtitle || category.metaDescription || `Compare the top ${category.name.toLowerCase()} side by side to find the best fit for your needs.`;
  const heroImage = cat.comparisonHeroImage || cat.heroImage || null;

  // ============ Top 3 Products Bar ============
  const top3Enabled = cat.comparisonTop3Enabled === true;
  const top3ProductIds: string[] = cat.comparisonTop3ProductIds || [];
  const top3Ribbon: string = cat.comparisonTop3Ribbon || 'Our Recommendation';
  const top3Title: string = cat.comparisonTop3Title || `Top 3 ${category.name} Services`;

  const top3ProductData: any[] = (cat.comparisonTop3ProductData as any[]) || [];

  let top3ForBar: any[] = [];
  if (top3Enabled) {
    const sourceProducts = top3ProductIds.length > 0
      ? top3ProductIds.map((id: string) => products.find((p: any) => p.id === id)).filter(Boolean)
      : products.slice(0, 3);

    top3ForBar = sourceProducts.map((p: any, idx: number) => {
      // Use category-level Top3 overrides if available, fallback to product data
      const override = top3ProductData.find((d: any) => d.id === p.id);
      return {
        name: p.name,
        slug: p.slug,
        logoUrl: p.logoUrl || undefined,
        ctaUrl: override?.ctaUrl || p.ctaUrl || undefined,
        ctaText: override?.ctaText || p.ctaText || 'Visit Site',
        overallScore: override?.overallScore ?? p.overallScore ?? undefined,
        scoreLabel: override?.scoreLabel || p.scoreLabel || undefined,
        bottomLine: override?.bottomLine || p.bottomLine || p.tagline || undefined,
        ribbon: override?.ribbon || (idx === 0 ? top3Ribbon : undefined),
      };
    });
  }

  // ============ Left Sidebar ============
  const leftSidebarEnabled = cat.comparisonLeftSidebarEnabled !== false;
  const socialProofCount = cat.comparisonSocialProofCount || undefined;
  const scoreBreakdown = (cat.comparisonScoreBreakdown as any[]) || undefined;

  // ============ Below FAQ Content ============
  const belowFaqContent = cat.comparisonBelowFaqContent || null;

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

      {/* Top 3 Products Bar (above chart) - only if enabled and configured */}
      {top3Enabled && top3ForBar.length > 0 && (
        <Top3ProductsBar
          title={top3Title}
          ribbon={top3Ribbon}
          products={top3ForBar}
          categorySlug={categorySlug}
        />
      )}

      {/* Main Content */}
      <main data-role="chart" className="compare-main">
        <div className="compare-main__row">
          <div className="compare-main__center">

            {/* Chart Body - Product Cards (vertical stack) */}
            <div data-role="chart-body" data-pli-name="Comparison" className="compare-chart-body">
              <div role="list" className="compare-card-list">
                {products.map((product: any, idx: number) => (
                  <NissimProductCard
                    key={product.id}
                    position={idx + 1}
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

          {/* Sidebar: social proof, score disclaimer, must reads, reviews */}
          {leftSidebarEnabled && (
            <aside className="compare-sidebar">
              <ComparisonSidebar
                categoryName={category.name}
                categorySlug={categorySlug}
                socialProofCount={socialProofCount}
                articles={articles}
                reviewProducts={reviewProducts}
                scoreBreakdown={scoreBreakdown}
              />
            </aside>
          )}
        </div>

        {/* Below chart sections */}
        <div className="compare-below-chart">
          {/* FAQ Section */}
          {faqs.length > 0 && (
            <div className="compare-content-sections">
              <FAQSection items={faqs.map((f: any) => ({ question: f.question || f.q || '', answer: f.answer || f.a || '' }))} />
            </div>
          )}

          {/* Below FAQ Rich Text Content */}
          {belowFaqContent && (
            <div className="compare-content-sections">
              <div className="compare-below-faq-content" dangerouslySetInnerHTML={{ __html: belowFaqContent }} />
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
