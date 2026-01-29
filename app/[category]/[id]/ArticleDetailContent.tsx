'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Article {
  id: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  author?: { name: string; slug?: string | null; avatar?: string | null } | null;
  category?: { name: string; slug: string } | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  ctaUrl?: string | null;
}

// Product CTA Box Component - matches reference design
function ProductCTABox({ product }: { product: Product }) {
  return (
    <div className="logo-and-ctas">
      <div className="logo-and-ctas__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.logoUrl || '/top10-images/placeholder.png'}
          alt={product.name}
          className="logo-and-ctas__logo"
        />
        <div className="logo-and-ctas__cta-wrapper">
          <a
            href={product.ctaUrl || '#'}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="logo-and-ctas__cta nilink"
          >
            <span>Visit Site</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Content renderer that supports {{product:slug}} syntax for inline CTAs
function ArticleContentRenderer({ content, products }: { content: string; products: Product[] }) {
  // Check if content contains product CTA markers
  const productCtaRegex = /\{\{product:([a-zA-Z0-9-]+)\}\}/g;
  const hasProductCtas = productCtaRegex.test(content);

  if (!hasProductCtas) {
    // No product CTAs, render normally
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    );
  }

  // Split content by product CTA markers and render with components
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  const regex = /\{\{product:([a-zA-Z0-9-]+)\}\}/g;

  while ((match = regex.exec(content)) !== null) {
    // Add markdown content before this match
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      parts.push(
        <ReactMarkdown key={`md-${lastIndex}`} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {textBefore}
        </ReactMarkdown>
      );
    }

    // Find product by slug
    const productSlug = match[1];
    const product = products.find(p => p.slug === productSlug);

    if (product) {
      parts.push(<ProductCTABox key={`cta-${match.index}`} product={product} />);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining content after last match
  if (lastIndex < content.length) {
    parts.push(
      <ReactMarkdown key={`md-${lastIndex}`} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content.slice(lastIndex)}
      </ReactMarkdown>
    );
  }

  return <>{parts}</>;
}

interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  featuredImage?: string | null;
}

interface ArticleDetailContentProps {
  article: Article;
  categorySlug: string;
  relatedArticles: RelatedArticle[];
  topProducts: Product[];
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function ProductSidebar({ products, categorySlug }: { products: Product[]; categorySlug: string }) {
  if (products.length === 0) return null;

  return (
    <div className="article-sidebar">
      {products.map((product) => (
        <div key={product.id} className="sidebar-product">
          <div
            className="sidebar-product__logo"
            style={{ backgroundImage: `url(${product.logoUrl || '/top10-images/placeholder.png'})` }}
          />
          <div className="sidebar-product__info">
            <div className="sidebar-product__name">{product.name}</div>
            <div className="sidebar-product__links">
              <Link href={`/${categorySlug}/reviews/${product.slug}`} className="sidebar-product__link">
                Read Review
              </Link>
              <span className="sidebar-product__separator">|</span>
              <a
                href={product.ctaUrl || '#'}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="sidebar-product__link"
              >
                Visit Site
              </a>
            </div>
          </div>
        </div>
      ))}
      <Link href={`/${categorySlug}/reviews`} className="sidebar-read-all">
        Read All Reviews
      </Link>
    </div>
  );
}

export default function ArticleDetailContent({
  article,
  categorySlug,
  relatedArticles,
  topProducts,
}: ArticleDetailContentProps) {
  const categoryName = article.category?.name || categorySlug;

  return (
    <>
      {/* Hero Section - Exact match to reference */}
      <div className="hero-article-container">
        <div className="hero-article-inner">
          {/* Left Content */}
          <div className="hero-article-left">
            {/* Breadcrumb */}
            <div className="hero-breadcrumb-wrapper">
              <ul className="hero-breadcrumb">
                <li>
                  <Link href="/">Home</Link>
                  <span>/</span>
                </li>
                <li>
                  <Link href={`/${categorySlug}`}>{categoryName}</Link>
                  <span>/</span>
                </li>
                <li>
                  <div className="breadcrumb-current">
                    {article.title.length > 50 ? article.title.slice(0, 50) + '...' : article.title}
                  </div>
                </li>
              </ul>
            </div>

            {/* Title & Excerpt */}
            <div className="hero-titles-wrapper">
              <div className="hero-titles">
                <h1 className="hero-title">{article.title}</h1>
                {(article.excerpt || article.subtitle) && (
                  <p className="hero-excerpt">{article.excerpt || article.subtitle}</p>
                )}
              </div>
            </div>

            {/* Author Section */}
            <div className="hero-authors-wrapper">
              <div className="hero-authors">
                <div className="hero-authors-list">
                  <div className="author-item">
                    <div className="author-avatar-wrapper">
                      <div
                        className="author-avatar"
                        style={{ backgroundImage: `url(${article.author?.avatar || '/top10-images/default-avatar.png'})` }}
                      />
                    </div>
                    <div className="author-info">
                      <div className="author-info-inner">
                        <div className="author-label">Written by</div>
                        {article.author?.slug ? (
                          <Link href={`/authors/${article.author.slug}`} className="author-name">
                            {article.author?.name || 'Top10 Team'}
                          </Link>
                        ) : (
                          <span className="author-name">{article.author?.name || 'Top10 Team'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-date-wrapper">
                  <p className="hero-date">{formatDate(article.publishedAt || article.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Featured Image */}
          {article.featuredImage && (
            <div
              className="hero-article-image"
              style={{ backgroundImage: `url(${article.featuredImage})` }}
            />
          )}
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="article-main">
        <div className="article-content-wrapper">
          <article className="article-content">
            <div className="wysiwyg-content">
              <ArticleContentRenderer
                content={article.content || ''}
                products={topProducts}
              />
            </div>
          </article>
        </div>

        <aside className="article-sidebar-wrapper">
          <ProductSidebar
            products={topProducts}
            categorySlug={categorySlug}
          />
        </aside>
      </div>

      <style jsx global>{`
        /* Hero Container - matches reference exactly */
        .hero-article-container {
          display: flex;
          justify-content: center;
          background-color: #F7F7F7;
          margin-bottom: 40px;
        }

        .hero-article-inner {
          display: flex;
          flex-direction: row;
          gap: 72px;
          max-width: 1174px;
          width: 100%;
          padding: 24px 0;
        }

        /* Left Content */
        .hero-article-left {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 710px;
          flex: 1 1 0%;
          justify-content: center;
          align-items: flex-start;
        }

        /* Breadcrumb */
        .hero-breadcrumb-wrapper {
          display: block;
          width: 100%;
        }

        .hero-breadcrumb {
          display: flex;
          flex-direction: row;
          list-style: none;
          margin: 0;
          padding: 0;
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #FF4A64;
        }

        .hero-breadcrumb li {
          display: flex;
          flex-direction: row;
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #717171;
        }

        .hero-breadcrumb li a {
          display: block;
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #4C4C4C;
          text-decoration: none;
        }

        .hero-breadcrumb li a:hover {
          text-decoration: underline;
        }

        .hero-breadcrumb li span {
          display: flex;
          margin: 0 8px;
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #4C4C4C;
        }

        .breadcrumb-current {
          display: block;
          max-width: 158px;
          font-size: 14px;
          font-weight: 400;
          line-height: 17px;
          color: #4C4C4C;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Titles */
        .hero-titles-wrapper {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .hero-titles {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: flex-start;
        }

        .hero-title {
          display: block;
          margin: 0;
          font-size: 36px;
          font-weight: 700;
          line-height: 50.4px;
          color: #191919;
        }

        .hero-excerpt {
          display: block;
          margin: 0;
          font-size: 18px;
          font-weight: 400;
          line-height: 25.2px;
          color: #191919;
        }

        /* Author Section */
        .hero-authors-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 100%;
        }

        .hero-authors {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hero-authors-list {
          display: flex;
          flex-direction: row;
          gap: 12px;
        }

        .author-item {
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
        }

        .author-avatar-wrapper {
          display: flex;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #106197;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .author-avatar {
          display: block;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-size: cover;
          background-position: center;
        }

        .author-info {
          display: flex;
          flex-direction: column;
        }

        .author-info-inner {
          display: flex;
          flex-direction: row;
          gap: 4px;
          align-items: center;
        }

        .author-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          line-height: 14.7px;
          color: #4C4C4C;
        }

        .author-name {
          display: inline;
          font-size: 14px;
          font-weight: 600;
          line-height: 19.6px;
          color: #106197;
          text-decoration: none;
        }

        a.author-name:hover {
          text-decoration: underline;
        }

        .hero-date-wrapper {
          display: flex;
          flex-direction: row;
          gap: 4px;
        }

        .hero-date {
          display: block;
          margin: 0;
          font-size: 12px;
          font-weight: 400;
          line-height: 18px;
          color: #4C4C4C;
        }

        /* Hero Image */
        .hero-article-image {
          display: block;
          width: 400px;
          min-height: 324px;
          flex: 0 0 auto;
          background-size: cover;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          border-radius: 2px;
        }

        /* Main Content Layout */
        .article-main {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 20px 60px;
          display: flex;
          justify-content: space-between;
          gap: 48px;
          align-items: flex-start;
        }

        .article-content-wrapper {
          flex: 1;
          min-width: 0;
        }

        .article-sidebar-wrapper {
          width: 320px;
          flex-shrink: 0;
          position: sticky;
          top: 20px;
        }

        /* Article Content */
        .article-content {
          padding-bottom: 40px;
        }

        .wysiwyg-content {
          font-size: 16px;
          line-height: 1.7;
          color: #191919;
        }

        .wysiwyg-content h1,
        .wysiwyg-content h2,
        .wysiwyg-content h3,
        .wysiwyg-content h4 {
          margin-top: 32px;
          margin-bottom: 16px;
          font-weight: 700;
          color: #191919;
        }

        .wysiwyg-content h1 { font-size: 28px; }
        .wysiwyg-content h2 { font-size: 24px; }
        .wysiwyg-content h3 { font-size: 20px; }
        .wysiwyg-content h4 { font-size: 18px; }

        .wysiwyg-content p {
          margin-bottom: 16px;
        }

        .wysiwyg-content ul,
        .wysiwyg-content ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }

        .wysiwyg-content li {
          margin-bottom: 8px;
        }

        .wysiwyg-content a {
          color: #106197;
          text-decoration: underline;
        }

        .wysiwyg-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 24px 0;
        }

        .wysiwyg-content blockquote {
          border-left: 4px solid #106197;
          padding-left: 16px;
          margin: 24px 0;
          color: #4C4C4C;
          font-style: italic;
        }

        .wysiwyg-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }

        .wysiwyg-content th,
        .wysiwyg-content td {
          border: 1px solid #E5E5E5;
          padding: 12px;
          text-align: left;
        }

        .wysiwyg-content th {
          background: #F5F5F5;
          font-weight: 600;
        }

        /* Product CTA Box - inline in content */
        .logo-and-ctas {
          margin: 24px 0;
        }

        .logo-and-ctas__inner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #F7F7F7;
          border-radius: 8px;
        }

        .logo-and-ctas__logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .logo-and-ctas__cta-wrapper {
          margin-left: auto;
        }

        .logo-and-ctas__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: #FF4A64;
          color: #fff!important;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none!important;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .logo-and-ctas__cta:hover {
          background: #E8435A;
        }

        .logo-and-ctas__cta svg {
          flex-shrink: 0;
        }

        @media (max-width: 600px) {
          .logo-and-ctas__inner {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .logo-and-ctas__cta-wrapper {
            margin-left: 0;
          }

          .logo-and-ctas__cta {
            width: 100%;
            justify-content: center;
          }
        }

        /* Sidebar */
        .article-sidebar {
          background: #fff;
          border: 1px solid #E5E5E5;
          border-radius: 2px;
          padding: 16px;
        }

        .sidebar-product {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #EEEEEE;
        }

        .sidebar-product:first-child {
          padding-top: 0;
        }

        .sidebar-product:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .sidebar-product__logo {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          flex-shrink: 0;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #f5f5f5;
        }

        .sidebar-product__info {
          flex: 1;
          min-width: 0;
        }

        .sidebar-product__name {
          font-size: 15px;
          font-weight: 600;
          color: #191919;
          margin-bottom: 4px;
        }

        .sidebar-product__links {
          font-size: 13px;
        }

        .sidebar-product__link {
          color: #106197;
          text-decoration: none;
        }

        .sidebar-product__link:hover {
          text-decoration: underline;
        }

        .sidebar-product__separator {
          color: #CCCCCC;
          margin: 0 8px;
        }

        .sidebar-read-all {
          display: block;
          text-align: center;
          padding: 12px;
          margin-top: 12px;
          color: #106197;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          border-top: 1px solid #EEEEEE;
        }

        .sidebar-read-all:hover {
          text-decoration: underline;
        }

        /* Mobile Responsive */
        @media (max-width: 900px) {
          .hero-article-inner {
            flex-direction: column;
            gap: 24px;
            padding: 16px 0 32px;
          }

          .hero-article-image {
            width: 100%;
            min-height: 200px;
            order: -1;
          }

          .hero-article-left {
            max-width: 100%;
          }

          .hero-title {
            font-size: 28px;
            line-height: 1.3;
          }

          .hero-excerpt {
            font-size: 16px;
            line-height: 1.5;
          }

          .article-main {
            flex-direction: column;
            gap: 32px;
            padding: 0 16px 40px;
          }

          .article-content-wrapper {
            max-width: 100%;
          }

          .article-sidebar-wrapper {
            width: 100%;
            position: static;
          }
        }
      `}</style>
    </>
  );
}
