interface NissimProductCardProps {
  position: number;
  name: string;
  slug: string;
  categorySlug: string;
  logoUrl?: string;
  bottomLine?: string;
  ribbon?: string;
  features?: string[];
  ctaUrl?: string;
  ctaText?: string;
  secondaryCtaText?: string;
  reviewCount?: string;
  overallScore?: number;
  scoreLabel?: string;
}

function ArrowIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 1L11.5 6L8.5 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 6H0.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StarsIcon({ score }: { score: number }) {
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.25;
  const totalFilled = fullStars + (hasHalf ? 1 : 0);
  const empty = 5 - totalFilled;
  const starWidth = 14.9;
  const gap = 0;

  return (
    <svg width="80" height="16" viewBox={`0 0 ${5 * starWidth} 12.5`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 5 }, (_, i) => {
        const x = i * (starWidth + gap);
        let fill = 'var(--color-warning)';
        if (i >= totalFilled) fill = '#E6E6E6';
        return (
          <path
            key={i}
            d={`M${x + 7.45} 0l2.3 4.67 5.15.75-3.73 3.63.88 5.13-4.6-2.42-4.6 2.42.88-5.13L${x} 5.42l5.15-.75z`}
            fill={fill}
          />
        );
      })}
    </svg>
  );
}

function getScoreLabel(score: number): string {
  if (score >= 9.5) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 7.5) return 'Very Good';
  if (score >= 6.5) return 'Good';
  if (score >= 5.0) return 'Fair';
  return 'Poor';
}

export default function NissimProductCard({
  position,
  name,
  slug,
  categorySlug,
  logoUrl,
  bottomLine,
  ribbon,
  features,
  ctaUrl,
  ctaText = 'Visit Site',
  secondaryCtaText,
  reviewCount,
  overallScore,
  scoreLabel,
}: NissimProductCardProps) {
  const isTopPick = position === 1;
  const displayScore = overallScore ?? 0;
  const displayLabel = scoreLabel || (displayScore > 0 ? getScoreLabel(displayScore) : '');
  const starScore = displayScore / 2; // convert 10-scale to 5-scale

  return (
    <div
      data-testid="nissim-product-card-container"
      data-role="nissim-card"
      data-product-name={slug}
      role="listitem"
      className="nissim-card"
    >
      <div className="nissim-card__inner">
        {/* Full-card overlay link */}
        <a
          className="nissim-card__overlay"
          href={ctaUrl || `/${categorySlug}/reviews/${slug}`}
          target="_blank"
          rel="noindex nofollow"
          aria-label={name}
        />

        <div className="nissim-card__padding">
          <div className="nissim-card__row">

            {/* COLUMN 1: Logo */}
            <div className="nissim-card__logo-col">
              {/* Ribbon / Badge */}
              <div data-testid="nissim-ribbon" className="nissim-ribbon">
                <div className="nissim-ribbon__addon">
                  <div data-testid="position" className="nissim-ribbon__position">
                    {position}
                  </div>
                  {(isTopPick || ribbon) && (
                    <div data-testid="addon-text" className="nissim-ribbon__text">
                      {isTopPick ? 'Our Top Pick' : ribbon}
                    </div>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="nissim-card__logo-wrap" data-testid="nissim-logo">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt={name} height={50} width={150} loading="lazy" />
                ) : (
                  <span className="nissim-card__logo-fallback">{name}</span>
                )}
              </div>

              <div style={{ flex: 1 }} />
            </div>

            {/* COLUMN 2: Content */}
            <div className="nissim-card__content-col">
              {/* Name + Reviews */}
              <div className="nissim-card__header">
                <div className="nissim-card__name">{name}</div>
                {reviewCount && (
                  <div className="nissim-card__reviews">
                    <a href={`/${categorySlug}/reviews/${slug}#visitors-reviews`}>{reviewCount} reviews</a>
                  </div>
                )}
              </div>

              {/* Bottom line + Bullet points */}
              <div>
                {bottomLine && (
                  <div data-testid="nissim-bottom-line" className="nissim-card__bottom-line">
                    {bottomLine}
                  </div>
                )}
                {features && features.length > 0 && (
                  <ul className="nissim-bullet-points" data-testid="product-attributes" role="list">
                    {features.map((feature, i) => (
                      <li key={i} data-testid="product-attribute" role="listitem">
                        <div>{feature}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* COLUMN 3: Score + CTA */}
            <div className="nissim-card__cta-col">
              {/* Score */}
              {displayScore > 0 && (
                <div data-testid="common-score-wrapper" className="nissim-score">
                  <div className="nissim-score__content">
                    <div data-testid="avg-score" className="nissim-score__number">
                      {displayScore.toFixed(1)}
                    </div>
                    <div className="nissim-score__stars-label">
                      <div className="nissim-score__stars">
                        <StarsIcon score={starScore} />
                      </div>
                      <span data-testid="top-label" className="nissim-score__label">
                        {displayLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA buttons */}
              <div className="nissim-card__cta-wrap">
                <a
                  className="nissim-cta-primary"
                  href={ctaUrl || `/${categorySlug}/reviews/${slug}`}
                  target="_blank"
                  rel="noindex nofollow"
                  data-role="cta-button"
                  data-product-name={slug}
                >
                  <span>{ctaText}</span>
                  <div className="endIcon">
                    <ArrowIcon color="#FFFFFF" />
                  </div>
                </a>
                {secondaryCtaText && (
                  <a
                    className="nissim-cta-secondary"
                    href={`/${categorySlug}/reviews/${slug}`}
                    data-testid="nissim-secondary-cta"
                  >
                    <span>{secondaryCtaText}</span>
                    <div className="endIcon">
                      <ArrowIcon color="#106197" />
                    </div>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
