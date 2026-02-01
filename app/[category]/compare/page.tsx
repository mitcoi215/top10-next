import '@/styles/compare.css';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/db';
import NissimProductCard from '@/components/top10/compare/NissimProductCard';
import Navbar from '@/components/top10/category/Navbar';
import Breadcrumb from '@/components/top10/category/Breadcrumb';
import Footer from '@/components/top10/category/Footer';
import FAQSection from '@/components/top10/category/FAQSection';

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

  const displayName = category.heroTitle || `Best ${category.name} Comparison`;

  return (
    <>
      <Navbar categorySlug={categorySlug} />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category.name, href: `/${categorySlug}` },
          { label: 'Compare' },
        ]}
      />

      {/* Hero Section */}
      <div className="compare-hero" data-testid="hero-container">
        <div className="compare-updated" data-testid="last-updated">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
        <h1>{displayName}</h1>
        <p className="compare-subtitle">
          {category.metaDescription || `Compare the top ${category.name.toLowerCase()} side by side to find the best fit for your needs.`}
        </p>
      </div>

      {/* Main Chart Body */}
      <main data-role="chart" className="compare-chart-body">
        <div data-role="chart-body" data-pli-name="Comparison">
          {/* Product Cards Grid */}
          <div className="nissim-card-grid" role="list">
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
              />
            ))}
          </div>
        </div>

        {/* Comparison Summary Table */}
        {products.length > 0 && (
          <div className="compare-content-sections">
            <h2>Comparing Our Top {category.name} Providers</h2>
            <table className="compare-summary-table" data-testid="wysiwyg-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Why We Recommend It</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.slug}>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.bestFor || product.bottomLine || product.tagline || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="compare-content-sections">
            <FAQSection items={faqs.map((f: any) => ({ question: f.question || f.q || '', answer: f.answer || f.a || '' }))} />
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
