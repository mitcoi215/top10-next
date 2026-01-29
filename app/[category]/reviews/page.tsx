import '@/styles/category.css';
import '@/styles/review.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import SetoffBox from '@/components/top10/category/SetoffBox';
import Navbar from '@/components/top10/category/Navbar';
import Footer from '@/components/top10/category/Footer';

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
    return { title: 'Reviews Not Found' };
  }

  return {
    title: `In-Depth ${category.name} Reviews | Top10.com`,
    description: `Our ${category.name.toLowerCase()} reviews, researched and written by industry experts, give you all the information you need to make an informed decision.`,
  };
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="top5-prods__item__link__arrow" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg">
      <path d="m18.9166667 10.9166667-3.8333334 3.8333333-3.8333333-3.8333333-1.1666667 1.1666666 5 5 5-5z" fill="#fff" fillRule="evenodd" transform="matrix(0 1 1 0 -10.916667 -10.083333)"></path>
    </svg>
  );
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
              <li title="Reviews">
                <span data-role="breadcrumb-link">Reviews</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ product, categorySlug }: { product: any; categorySlug: string }) {
  const reviewHref = `/${categorySlug}/reviews/${product.slug}`;
  const ctaHref = product.ctaUrl || '#';

  return (
    <div className="review-row" data-row-index={product.id}>
      {/* Mobile Logo */}
      <div className="review-row__mobile">
        <a href={ctaHref} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" className="review-row__logo" src={product.logoUrl || '/top10-images/placeholder.png'} alt={product.name} />
        </a>
      </div>

      {/* Left Content */}
      <div className="review-row__left">
        <Link href={reviewHref} className="review-row__title">
          <h2>{product.name}</h2>
        </Link>
        <div className="review-row__date">
          {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : ''}
        </div>
        <div className="review-row__summary">{product.shortDescription || product.description || ''}</div>

        {/* Footer Buttons */}
        <div className="review-row__footer-section">
          <Link href={reviewHref} className="review-row__more">
            Read Review
          </Link>
          <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="review-row__visit">
            Visit Site
            <ArrowIcon />
          </a>
        </div>
      </div>

      {/* Right - Desktop Logo */}
      <div className="review-row__right">
        <a href={ctaHref} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" className="review-row__logo" src={product.logoUrl || '/top10-images/placeholder.png'} alt={product.name} />
        </a>
      </div>
    </div>
  );
}

function Top5Products({ products, categoryHref, categoryName }: { products: any[]; categoryHref: string; categoryName: string }) {
  const top5 = products.slice(0, 5);

  return (
    <div className="top5-prods">
      <div className="top5-prods__title">
        <Link href={categoryHref} className="top5-prods__title__text">Best {categoryName}</Link>
        <Link href={categoryHref} className="top5-prods__title__button" target="_blank" rel="noopener noreferrer">Compare All</Link>
      </div>
      <div className="top5-prods__items">
        {top5.map((product, index) => (
          <a
            key={index}
            href={product.ctaUrl || '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="top5-prods__item nilink"
            data-product-name={product.name.toLowerCase()}
          >
            <div className="top5-prods__item__icon-container" style={{ backgroundImage: `url(${product.logoUrl || '/top10-images/placeholder.png'})` }}>
              <div className="top5-prods__item__icon" style={{ backgroundImage: `url(${product.logoUrl || '/top10-images/placeholder.png'})` }}></div>
            </div>
            <div className="top5-prods__item__name">{product.name}</div>
            <span className="top5-prods__item__link">
              <ChevronRightIcon />
            </span>
          </a>
        ))}
      </div>
      <div className="top5-prods__button-container">
        <Link href={categoryHref} className="top5-prods__button">Compare All</Link>
      </div>
    </div>
  );
}

function WhyTop10Section() {
  return (
    <div className="why-top10">
      <div className="why-top10__title">
        Why <span className="why-top10__marked">Top10</span> your decisions
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Compare.</div>
          <div className="why-top10-stage-container__text">We find the 10 best options.</div>
        </div>
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Choose.</div>
          <div className="why-top10-stage-container__text">So you make decisions with ease.</div>
        </div>
      </div>
      <div className="why-top10-stage">
        <div className="why-top10-stage-container">
          <div className="why-top10-stage-container__title">Celebrate.</div>
          <div className="why-top10-stage-container__text">Simple, right?</div>
        </div>
        <div className="why-top10-stage__character">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/top10-images/stages-character.svg" alt="Why Top10" />
        </div>
      </div>
    </div>
  );
}

const tenSteps = [
  { title: 'Hope, dream, think', description: 'What need will the purchase solve?' },
  { title: 'Determine', description: 'What aspects of the product can be compared?' },
  { title: 'Research', description: 'Who are the leading brands? What do they offer?' },
  { title: 'Consider', description: 'Which features are most important to you?' },
  { title: 'Read, watch, consult', description: 'What do the reviews say? What do experts recommend?' },
  { title: 'Compare', description: 'How do the brands on your shortlist stack up head-to-head?' },
  { title: 'Check prices', description: 'What special deals can you take advantage of?' },
  { title: 'Read the fine print', description: 'Are you comfortable with the terms and conditions offered?' },
  { title: 'Choose confidently', description: "Once you've followed these steps - you should be ready to buy." },
  { title: 'Trust', description: 'You have made an educated decision that responds to your needs.' },
];

function TenStepsSection() {
  return (
    <div className="ten-steps">
      <h3 className="ten-steps__header">10 Steps for Shopping with Confidence</h3>
      <div className="ten-steps__items">
        {tenSteps.map((step, index) => (
          <div key={index} className="ten-steps__item">
            <div className="ten-steps__item__index">{String(index + 1).padStart(2, '0')}</div>
            <div className="ten-steps__item__content">
              <div className="ten-steps__item__header">{step.title}</div>
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function CategoryReviewsPage({ params }: PageProps) {
  const { category: categorySlug } = await params;

  // Fetch category and products
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

  return (
    <div className="review-list-page">
      {/* SetoffBox */}
      <SetoffBox />

      {/* Navbar */}
      <Navbar categorySlug={categorySlug} />

      {/* Breadcrumb */}
      <Breadcrumb categorySlug={categorySlug} categoryName={category.name} />

      {/* Page Header */}
      <div className="agg-reviews__header">
        <h1 className="page-title">In-Depth {category.name} Reviews</h1>
        <span className="page-subtitle">
          {category.reviewListIntro || `Our ${category.name.toLowerCase()} reviews, researched and written by industry experts, give you all the information you need to make an informed decision.`}
        </span>
      </div>

      {/* Horizontal Separator */}
      <div className="horiz-sep"></div>

      {/* Main Content with Sidebar */}
      <div className="page-with-sidebar">
        {/* Left - Main Content */}
        <div className="page">
          <section className="page__center">
            <div className="agg-reviews__items">
              {category.products.map((product) => (
                <ReviewRow key={product.id} product={product} categorySlug={categorySlug} />
              ))}
              {category.products.length === 0 && (
                <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No reviews available yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right - Sidebar */}
        <aside className="page__right-sidebar">
          <Top5Products
            products={category.products}
            categoryHref={`/${categorySlug}`}
            categoryName={category.name}
          />
          <WhyTop10Section />
          <TenStepsSection />
        </aside>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
