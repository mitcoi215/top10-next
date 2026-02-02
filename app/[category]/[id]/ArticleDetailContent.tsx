'use client';
import '@/styles/win.css';

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
        
      `}</style>
    </>
  );
}
