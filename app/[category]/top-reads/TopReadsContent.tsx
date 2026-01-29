'use client';

import Link from 'next/link';

interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  ctaUrl?: string | null;
}

interface TopReadsContentProps {
  categorySlug: string;
  categoryName: string;
  articles: Article[];
  products: Product[];
  heroTitle?: string;
  heroSubtitle?: string;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${month}. ${day}, ${year}`;
}

function truncateText(text: string | null | undefined, maxLength: number = 120): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function ArticleItem({ article, categorySlug, index }: { article: Article; categorySlug: string; index: number }) {
  const articleHref = `/${categorySlug}/${article.slug}`;

  return (
    <Link
      href={articleHref}
      className="agg-articles__item"
      data-index={index}
      data-role="article-row"
    >
      <div className="agg-articles__item__left">
        <h2 className="agg-articles__item__title">{article.title}</h2>
        <div className="agg-articles__item__summary">
          {truncateText(article.excerpt || article.subtitle, 120)}
        </div>
        <div className="agg-articles__item__date">
          {formatDate(article.publishedAt || article.updatedAt)}
        </div>
      </div>
      <div className="agg-articles__item__right">
        <div className="agg-articles__item__image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading={index > 5 ? 'lazy' : 'eager'}
            className="agg-articles__item__image__bg"
            src={article.featuredImage || '/top10-images/placeholder.png'}
            alt={article.featuredImageAlt || article.title}
          />
        </div>
      </div>
    </Link>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="top5-prods__item__link__arrow" viewBox="0 0 7 10" xmlns="http://www.w3.org/2000/svg">
      <path d="m18.9166667 10.9166667-3.8333334 3.8333333-3.8333333-3.8333333-1.1666667 1.1666666 5 5 5-5z" fill="#fff" fillRule="evenodd" transform="matrix(0 1 1 0 -10.916667 -10.083333)"></path>
    </svg>
  );
}

function Top5Products({ products, categoryHref, categoryName }: { products: Product[]; categoryHref: string; categoryName: string }) {
  const top5 = products.slice(0, 5);

  if (top5.length === 0) return null;

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

export default function TopReadsContent({
  categorySlug,
  categoryName,
  articles,
  products,
  heroTitle,
  heroSubtitle
}: TopReadsContentProps) {
  const defaultTitle = `${categoryName} Guides and Comparisons`;
  const defaultSubtitle = `Discover which ${categoryName.toLowerCase()} options can help you grow your web presence.`;

  return (
    <>
      {/* Simple Hero Header */}
      <div className="top-reads-header">
        <h1 className="top-reads-header__title">{heroTitle || defaultTitle}</h1>
        <p className="top-reads-header__subtitle">{heroSubtitle || defaultSubtitle}</p>
      </div>
      <div className="horiz-sep"></div>
      {/* Main Content with Sidebar */}
      <div className="page-with-sidebar">
        {/* Left - Main Content */}
        <div className="page">
          <section className="page__center">
            <div className="agg-articles__items">
              {articles.map((article, index) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  categorySlug={categorySlug}
                  index={index}
                />
              ))}
              {articles.length === 0 && (
                <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  No articles available yet.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right - Sidebar */}
        <aside className="page__right-sidebar">
          <Top5Products
            products={products}
            categoryHref={`/${categorySlug}`}
            categoryName={categoryName}
          />
          <WhyTop10Section />
        </aside>
      </div>

      {/* Styles */}
      <style jsx global>{`
        /* Simple Hero Header */
        .top-reads-header {
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .top-reads-header__title {
          font-size: 28px;
          font-weight: 700;
          color: #191919;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .top-reads-header__subtitle {
          font-size: 16px;
          color: #717171;
          margin: 0;
          line-height: 1.5;
        }

        /* Articles List */
        .agg-articles__items {
          display: flex;
          flex-direction: column;
        }

        .agg-articles__item {
          display: flex;
          align-items: flex-start;
          padding: 24px 0;
          border-bottom: 1px solid #EEEEEE;
          text-decoration: none;
          color: inherit;
        }

        .agg-articles__item:hover .agg-articles__item__image__bg {
          filter: brightness(0.85);
        }

        .agg-articles__item:last-child {
          border-bottom: none;
        }

        .agg-articles__item__left {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-right: 24px;
          min-width: 0;
        }

        .agg-articles__item__title {
          font-size: 18px;
          font-weight: 700;
          color: #191919;
          margin: 0 0 12px 0;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }


        .agg-articles__item__summary {
          font-size: 15px;
          color: #4C4C4C;
          line-height: 1.5;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .agg-articles__item__date {
          font-size: 14px;
          color: #717171;
        }

        .agg-articles__item__right {
          flex-shrink: 0;
          width: 200px;
        }

        .agg-articles__item__image {
          width: 100%;
          height: 130px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #f5f5f5;
        }

        .agg-articles__item__image__bg {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.2s ease;
        }

        /* Mobile Responsive */
        @media (max-width: 767px) {
          .top-reads-header {
            padding: 0 16px 20px;
          }

          .top-reads-header__title {
            font-size: 22px;
          }

          .top-reads-header__subtitle {
            font-size: 14px;
          }

          .agg-articles__item {
            flex-direction: column-reverse;
            padding: 20px 0;
          }

          .agg-articles__item__left {
            padding-right: 0;
          }

          .agg-articles__item__right {
            width: 100%;
            margin-bottom: 16px;
          }

          .agg-articles__item__image {
            height: 180px;
            border-radius: 8px;
          }

          .agg-articles__item__title {
            font-size: 16px;
          }

          .agg-articles__item__summary {
            font-size: 14px;
          }
        }
          
      `}</style>
    </>
  );
}
