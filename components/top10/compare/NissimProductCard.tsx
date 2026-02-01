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
  reviewCount?: string;
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor" />
    </svg>
  );
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
  reviewCount,
}: NissimProductCardProps) {
  const isTopPick = position === 1;

  return (
    <div
      data-testid="nissim-product-card-container"
      data-role="nissim-card"
      data-product-name={name}
      role="listitem"
      className="nissim-card"
    >
      {/* Ribbon / Badge */}
      <div className="nissim-ribbon" data-testid="nissim-ribbon">
        <div className="nissim-position" data-testid="position">
          {position}
        </div>
        {(isTopPick || ribbon) && (
          <div className={`nissim-addon-text${isTopPick ? ' top-pick' : ''}`} data-testid="addon-text">
            {isTopPick ? 'Our Top Pick' : ribbon}
          </div>
        )}
      </div>

      {/* Logo */}
      <div className="nissim-logo" data-testid="nissim-logo">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={name} height={50} width={150} loading="lazy" />
        ) : (
          <span style={{ fontSize: 20, fontWeight: 700, color: '#333' }}>{name}</span>
        )}
      </div>

      {/* Bottom Line / Tagline */}
      {bottomLine && (
        <div className="nissim-bottom-line" data-testid="nissim-bottom-line">
          {bottomLine}
        </div>
      )}

      {/* Review Count */}
      {reviewCount && (
        <div className="nissim-reviews">
          <a href={`/${categorySlug}/reviews/${slug}`}>{reviewCount} reviews</a>
        </div>
      )}

      {/* Features */}
      {features && features.length > 0 && (
        <ul className="nissim-bullet-points" data-testid="product-attributes" role="list">
          {features.map((feature, i) => (
            <li key={i} data-testid="product-attribute" role="listitem">
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTA Button */}
      <div className="nissim-cta">
        <a
          href={ctaUrl || `/${categorySlug}/reviews/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          data-role="product-cta"
          data-product-name={name}
        >
          <span>{ctaText}</span>
          <span className="cta-arrow"><ArrowIcon /></span>
        </a>
      </div>
    </div>
  );
}
