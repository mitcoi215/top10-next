import '@/styles/category.css';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Breadcrumb from '@/components/top10/category/Breadcrumb';
import CharticleHeader from '@/components/top10/category/CharticleHeader';
import IntroContent from '@/components/top10/category/IntroContent';
import BestOfList from '@/components/top10/category/BestOfList';
import ProductList from '@/components/top10/category/ProductList';
import FAQSection from '@/components/top10/category/FAQSection';
import Sidebar from '@/components/top10/category/Sidebar';
import Footer from '@/components/top10/category/Footer';
import MethodologySection from '@/components/top10/category/MethodologySection';
import CloserLook from '@/components/top10/category/CloserLook';
import { BottomContentRenderer } from '@/components/admin/bottom-content-editor';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Generate SEO metadata from database
interface MetadataProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { category: categorySlug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    select: {
      name: true,
      metaTitle: true,
      metaDescription: true,
      ogImage: true,
      heroImage: true,
    },
  });

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = category.metaTitle || `Best ${category.name} 2026 - Compare Top 10 | Top10`;
  const description = category.metaDescription || `Compare the best ${category.name.toLowerCase()} of 2026. Expert reviews, detailed comparisons, and recommendations.`;
  const image = category.ogImage || category.heroImage || '/top10-images/default-og.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

// SVG Sprite definitions (hidden)
function SvgSprite() {
  return (
    <div style={{ visibility: 'hidden', fontSize: 0, height: 0, width: 0, display: 'none' }}>
      <svg id="facebook" viewBox="0 0 9 20" xmlns="http://www.w3.org/2000/svg">
        <path
          className="facebook__bg"
          d="M8.583 3.456V.013L5.717 0C2.262 0 1.723 2.575 1.723 4.223V6.28H.11v4.035h1.614V20h4.439v-9.684h2.553l.303-4.035H6.162V4.432c0-.784.178-.976.546-.976h1.875z"
          fill="inherit"
          fillRule="evenodd"
        />
      </svg>
      <svg id="twitter" viewBox="0 0 25 20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.889 19.723c6.72 0 12.717-5.02 13.74-11.72.109-.71-.101-2.065.227-2.642.213-.374.92-.743 1.24-1.068a9.86 9.86 0 001.116-1.363 9.847 9.847 0 01-2.806.756 4.836 4.836 0 002.15-2.66c-.14.428-1.904.865-2.305.977-.958.27-1.071-.185-1.87-.64-1.583-.902-3.577-.839-5.122.116-1.695 1.048-2.5 3.133-2.128 5.077-3.692.309-7.825-2.276-10.082-5.002.003.004-.585 1.498-.616 1.703a4.795 4.795 0 00.393 2.749c.225.482 1.053 1.948 1.685 1.968-.8-.024-2.273-.24-2.273-.6v.06c0 1.123.482 2.226 1.208 3.075.61.711 1.763 1.796 2.788 1.65-.226.059-2.065.388-2.169.072.654 1.994 2.43 2.669 4.237 3.316-1.394 1.048-2.606 1.754-4.366 1.985-.606.079-2.002.367-2.536.03a14.005 14.005 0 007.489 2.161z"
          fill="inherit"
          fillRule="evenodd"
        />
      </svg>
      <svg id="linkedIn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
        <path
          d="M1.807.012a1.83 1.83 0 011.807 1.807c0 1.033-.877 1.833-1.807 1.807C.852 3.652.001 2.852.001 1.819-.025.813.8.012 1.807.012m1.007 14.713H.75a.518.518 0 01-.516-.516V5.175c0-.284.206-.516.49-.516h2.091c.284 0 .516.232.516.516v9.06c0 .258-.232.49-.516.49m12.131-6.917c0-1.91-1.42-3.408-3.33-3.408h-.542c-1.033 0-2.04.49-2.581 1.291l-.259.258V4.917c0-.104-.154-.258-.258-.258h-2.58c-.104 0-.259.103-.259.232v9.628c0 .103.155.206.258.206h2.84c.103 0 .258-.103.258-.206V8.943c0-.955.722-1.755 1.677-1.78.49 0 .93.18 1.265.515.31.31.439.749.439 1.24v5.549c0 .103.155.258.258.258h2.581c.103 0 .258-.155.258-.258v-6.66h-.025z"
          fill="inherit"
        />
      </svg>
    </div>
  );
}

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Fetch category with author, products and articles
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      author: true, // Category's assigned author
      products: {
        where: { status: 'published' },
        orderBy: { rank: 'asc' },
        take: 10,
        include: {
          author: true,
        },
      },
      articles: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Redirect to comparison page if enabled
  if (category.comparisonRedirectEnabled) {
    redirect(`/${categorySlug}/comparison`);
  }

  // Fetch all authors for the BottomContentRenderer (experts section)
  const allAuthors = await prisma.author.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      avatar: true,
      title: true,
    },
  });

  // Use category's author, or fallback to first product's author, or default
  const authorName = category.author?.name || category.products[0]?.author?.name || 'Top10 Team';
  const authorImage = category.author?.avatar || category.products[0]?.author?.avatar || '/top10-images/default-author.jpg';
  const authorSlug = category.author?.slug || category.products[0]?.author?.slug || 'top10-team';

  // Format last updated date
  const lastUpdated = category.lastUpdated
    ? new Date(category.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  // Parse JSON fields safely
  const faqs = (category.faqs as Array<{ question: string; answer: string }>) || [];
  const methodologyCriteria = (category.methodologyCriteria as Array<{ title: string; description: string }>) || [];
  const exploreCards = (category.exploreCards as Array<{ title: string; href: string; image: string }>) || [];
  const highlightDefinitions = (category.highlightDefinitions as Array<{ key: string; label: string }>) || [];

  // Prepare best of list items
  const bestOfItems = category.products.map((product, idx) => ({
    name: product.name,
    href: product.reviewHref || `/${categorySlug}/reviews/${product.slug}`,
    description: product.ribbon || product.bestFor || `#${idx + 1} choice`,
  }));

  // Prepare sidebar articles
  const sidebarArticles = category.articles.map((article) => ({
    title: article.title,
    href: `/${categorySlug}/${article.slug}`,
    image: article.featuredImage || '/top10-images/default-article.jpg',
  }));

  // Prepare closer look items with extended mini-review data
  const closerLookItems = category.products.map((product, idx) => {
    // Build bullet points from highlights
    const highlights = product.highlights as Record<string, string> | null;
    const bulletPoints = highlights
      ? Object.entries(highlights).map(([key, value]) => ({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
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
      // Extended fields for mini-review
      overallScore: product.overallScore || undefined,
      scoreLabel: product.scoreLabel || undefined,
      description: product.heroSummary || undefined,
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
      pros: product.pros.length > 0 ? product.pros : undefined,
      cons: product.cons.length > 0 ? product.cons : undefined,
      images: product.images.length > 0 ? product.images : undefined,
      // Additional fields from template
      highlightText: product.tagline || product.bestFor || undefined,
      iconImage: product.logoUrl || undefined,
    };
  });

  return (
    <div className="category-page">
      <SvgSprite />

      <SetoffBox />

      <Navbar categorySlug={categorySlug} />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: category.name },
        ]}
      />

      <CharticleHeader
        title={category.heroTitle || `Top 10 Best ${category.name} of 2026 - Reviews & Comparison`}
        authorName={authorName}
        authorImage={authorImage}
        authorSlug={authorSlug}
        lastUpdated={lastUpdated}
        heroImage={category.heroImage || '/top10-images/default-hero.jpg'}
        heroImageAlt={`Top 10 Best ${category.name}`}
      />

      <IntroContent
        content={category.introContent || `<p>Compare the best ${category.name.toLowerCase()} services and find the right one for your needs.</p>`}
        tocItems={closerLookItems.map(item => ({ position: item.position, name: item.name }))}
        sidebar={
          <Sidebar
            peopleCount={category.sidebarPeopleCount || '10,000+'}
            categoryName={category.name}
            articles={sidebarArticles}
            seeAllHref={`/${categorySlug}/articles`}
          />
        }
      >
        {bestOfItems.length > 0 && (
          <BestOfList
            title={category.bestOfListTitle || `Our Top 10 Best ${category.name}:`}
            items={bestOfItems}
          />
        )}

        <div className="chart" data-role="chart">
          <div className="chart__body" data-role="chart-body">
            <ProductList
              products={category.products.map((product) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                logoUrl: product.logoUrl,
                bottomLine: product.bottomLine,
                features: (product.features as Array<{ text: string; bold?: boolean }>) || [],
                quote: product.quote as { text: string; source: string; date: string } | null,
                ctaText: product.ctaText,
                ctaUrl: product.ctaUrl,
                ribbon: product.ribbon,
                reviewHref: product.reviewHref,
                reviewCount: product.reviewCount,
              }))}
              categorySlug={categorySlug}
              initialShow={3}
            />
          </div>
        </div>

        <MethodologySection
          compareTitle={category.compareBoxTitle || 'Compare With 10rating, Choose the Best for You'}
          compareDescription={category.compareBoxDescription || 'Our team of experts evaluates each service to help you make an informed decision.'}
          stats={category.compareBoxStats || `${category.products.length} Services Evaluated`}
          methodologyTitle={category.methodologyTitle || `Our Methodology: How We Reviewed the Best ${category.name}`}
          methodologyIntro={category.methodologyIntro || ''}
          criteriaTitle={category.criteriaTitle || 'Here are some of the criteria we evaluated:'}
          criteria={methodologyCriteria}
          exploreTitle={category.exploreTitle || `Explore More ${category.name}:`}
          exploreCards={exploreCards}
        />

        {closerLookItems.length > 0 && (
          <CloserLook
            title={category.closerLookTitle || `A Closer Look at the Top 10 ${category.name}`}
            items={closerLookItems}
          />
        )}

        {/* Bottom Content - Comparison table, experts section, etc. */}
        {category.bottomContent && (
          <section className="charticle__bottom-content under-wysiwyg">
            <BottomContentRenderer
              content={category.bottomContent}
              authors={allAuthors}
            />
          </section>
        )}

        {/* Additional Content - Below Bottom Content */}
        {category.additionalContent && (
          <section className="charticle__additional-content under-wysiwyg">
            <BottomContentRenderer
              content={category.additionalContent}
              authors={allAuthors}
            />
          </section>
        )}

        {faqs.length > 0 && (() => {
          const socialLinks = category.author?.socialLinks as { twitter?: string; linkedin?: string; website?: string } | null;
          return (
            <FAQSection
              items={faqs}
              author={category.author ? {
                name: category.author.name,
                slug: category.author.slug,
                avatar: category.author.avatar || '/top10-images/default-author.jpg',
                bio: category.author.bio || undefined,
                blogUrl: socialLinks?.website || undefined,
                twitterUrl: socialLinks?.twitter || undefined,
                linkedInUrl: socialLinks?.linkedin || undefined,
              } : undefined}
              lastUpdated={lastUpdated}
            />
          );
        })()}
      </IntroContent>

      <Footer />
    </div>
  );
}

// Generate static params for known categories (optional optimization)
export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  return categories.map((cat) => ({
    category: cat.slug,
  }));
}
