'use client';

import Link from 'next/link';

interface BulletPoint {
  icon?: string;
  label: string;
  value: string;
}

interface CloserLookItem {
  position: number;
  name: string;
  slug: string;
  logo: string;
  tagline: string;
  bestFor: string;
  basePrice: string;
  reviewHref: string;
  ctaHref: string;
  ctaText?: string;
  // Extended fields for full mini-review
  overallScore?: number;
  scoreLabel?: string;
  description?: string;
  bulletPoints?: BulletPoint[];
  pros?: string[];
  cons?: string[];
  images?: string[];
  // Additional fields from template
  highlightText?: string;
  iconImage?: string;
}

interface CloserLookProps {
  title: string;
  items: CloserLookItem[];
}

function MiniReviewItem({ item }: { item: CloserLookItem }) {
  const hasDescription = item.description && item.description.length > 0;
  const hasPros = item.pros && item.pros.length > 0;
  const hasCons = item.cons && item.cons.length > 0;
  const hasImages = item.images && item.images.length > 0;
  const hasBulletPoints = item.bulletPoints && item.bulletPoints.length > 0;

  return (
    <li
      className="mini-reviews__item false"
      data-index={item.position - 1}
      data-category="Quick Review"
      data-mini-review-position={item.position}
      data-visable-always="true"
    >
      {/* Header Section */}
      <header className="mini-reviews__header" data-role="mini-reviews-header">
        <div className="mini-reviews__header-desktop">
          <div className="mini-reviews__header-desktop--top">
            {/* Position Counter */}
            <span>
              <div className="index-counter line-separator css-1kxyc3m" data-testid="index-counter">
                {item.position}
              </div>
            </span>

            {/* Logo Link */}
            <a
              href={item.ctaHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              data-role="mini-review-product-logo"
              data-product-name={item.name}
            >
              <div data-auto-name="logo-image" className="mini-reviews__logo-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  loading="lazy"
                  className="mini-reviews__logo-image"
                  src={item.logo}
                  alt={item.name}
                />
              </div>
            </a>

            {/* Product Title */}
            <div className="mini-reviews__header-desktop__details">
              <div className="mini-reviews__header__title-container">
                <div className="mini-reviews__header-title">
                  <h2 className="mini-reviews__product-name" data-toc-anchor={item.position - 1}>
                    {item.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          {hasImages && (
            <div className="container">
              <div
                data-auto-name="image-carousel"
                className="carousel--single-image"
                data-role="carousel-single-image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-role="lazy-load-gallery-img"
                  alt={`${item.name} platform`}
                  title={`${item.name} platform`}
                  className="carousel--image image-element loaded"
                  src={item.images![0]}
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Links Section */}
          <div className="mini-reviews__header-desktop__links">
            <div className="mini-reviews__left-section">
              {item.highlightText && (
                <div className="mini-reviews__product-highlight">
                  <span>{item.highlightText}</span>
                </div>
              )}
              <Link
                className="mini-reviews__review-link"
                data-role="read-review"
                href={item.reviewHref}
                data-product-name={item.slug}
              >
                <span className="mini-reviews__review-link--text">Read {item.name} Review</span>
              </Link>
            </div>
            <a
              className="cta-button mini-reviews__cta-button secondary nilink"
              href={item.ctaHref}
              rel="nofollow noopener"
              target="_blank"
              data-auto-name="product-link"
              title="Visit Site"
              data-product-name={item.slug}
            >
              <span className="cta-button__text" data-product-name={item.slug}>
                {item.ctaText || 'Visit Site'}
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Body Section */}
      <div className="mini-reviews__body">
        {/* Bullet Points */}
        {hasBulletPoints && (
          <ul className="mini-reviews__bullet-points">
            {item.bulletPoints!.map((bp, idx) => (
              <li key={idx} className="mini-reviews__bullet-points__item">
                <svg className="mini-reviews__bullet-points__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#1789d5"/>
                </svg>
                <div className="mini-reviews__bullet-points__content">
                  <span className="mini-reviews__bullet-points__display-name" style={{ fontWeight: 600, color: '#2d2d2d' }}>{bp.label}</span>
                  <span className="mini-reviews__bullet-points__value" style={{ fontWeight: 400, color: '#6b7280' }}>{bp.value}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Content - Always visible, no show more/less */}
        <div className="mini-reviews__content-wrapper">
          {/* Description */}
          {hasDescription && (
            <section data-role="wysiwyg">
              <div
                className="mini-reviews__product-description charticle__wysiwyg"
                dangerouslySetInnerHTML={{ __html: item.description! }}
              />
            </section>
          )}

          {/* Pros & Cons */}
          {(hasPros || hasCons) && (
            <div className="pros-and-cons">
              {hasPros && (
                <div className="pros-and-cons__section">
                  <div className="pros-and-cons__title">Pros</div>
                  <ul className="pros-and-cons__list">
                    {item.pros!.map((pro, idx) => (
                      <li key={idx} className="pros-and-cons__pro">
                        <svg className="pros-and-cons__icon pro-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#1789d5"/>
                        </svg>
                        <div className="pros-and-cons__text">{pro}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hasCons && (
                <div className="pros-and-cons__section">
                  <div className="pros-and-cons__title">Cons</div>
                  <ul className="pros-and-cons__list">
                    {item.cons!.map((con, idx) => (
                      <li key={idx} className="pros-and-cons__con">
                        <svg className="pros-and-cons__icon con-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#1789d5"/>
                        </svg>
                        <div className="pros-and-cons__text">{con}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="wide-cta-button__footer multi-buttons">
            <div className="wide-cta-button__footer__product-content">
              <div data-auto-name="icon-image" className="wide-cta-button__icon-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="wide-cta-button__icon-image"
                  src={item.iconImage || item.logo}
                  alt={item.name}
                />
              </div>
              <h2 className="wide-cta-button__product-name">{item.name}</h2>
            </div>
            <div className="wide-cta-button__footer__buttons">
              <a
                className="cta-button wide-cta-button__cta-button secondary nilink"
                href={item.ctaHref}
                rel="nofollow noopener"
                target="_blank"
                data-auto-name="product-link"
                title="Visit Site"
                data-product-name={item.slug}
              >
                <span className="cta-button__text" data-product-name={item.slug}>
                  {item.ctaText || 'Visit Site'}
                </span>
              </a>
            </div>
          </footer>
        </div>
      </div>
    </li>
  );
}

export default function CloserLook({ title, items }: CloserLookProps) {
  return (
    <section className="charticle__closer-look charticle__mini-reviews-container under-wysiwyg">
      <div className="mini-reviews__container">
        <h2 className="mini-reviews__title">{title}</h2>
        <ul className="mini-reviews__items">
          {items.map((item) => (
            <MiniReviewItem key={item.position} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}
