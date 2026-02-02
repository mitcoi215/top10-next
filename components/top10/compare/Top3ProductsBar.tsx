interface Top3Product {
  name: string;
  slug: string;
  logoUrl?: string;
  ctaUrl?: string;
  ctaText?: string;
  overallScore?: number;
  scoreLabel?: string;
  bottomLine?: string;
  ribbon?: string;
}

interface Top3ProductsBarProps {
  title: string;
  products: Top3Product[];
  categorySlug: string;
}

function StarsIcon({ score }: { score: number }) {
  const starWidth = 14.9;
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.25;
  const totalFilled = fullStars + (hasHalf ? 1 : 0);

  return (
    <svg width="80" height="16" viewBox={`0 0 ${5 * starWidth} 12.5`} xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 5 }, (_, i) => {
        const x = i * starWidth;
        let fill = 'var(--color-warning)';
        if (i >= totalFilled) fill = '#BDBDBD';
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

function TrophyIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.452 1.442c.047-.48.047-.913.047-1.442H2.885c0 .53 0 .962.047 1.442H0v.48c0 4.28 5.433 7.309 6.731 7.981v1.635c0 .818-.626 1.443-1.443 1.443h-.962v1.922h6.731v-1.922h-.962a1.416 1.416 0 01-1.442-1.443V9.904c1.298-.673 6.731-3.702 6.731-7.98v-.48l-2.932-.002zM1.01 2.404h2.019c.192 2.164.721 3.702 1.298 4.808C2.788 6.01 1.202 4.327 1.01 2.404zm10.096 4.808c.577-1.107 1.106-2.644 1.298-4.808h2.02c-.242 1.923-1.828 3.606-3.318 4.808z" fill="currentColor" />
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

export default function Top3ProductsBar({ title, products, categorySlug }: Top3ProductsBarProps) {
  if (products.length === 0) return null;

  return (
    <div className="top3-bar" data-testid="top3-products" data-component="top3-products">
      <div className="top3-bar__title-row">
        <div className="top3-bar__title" data-testid="top3-products-title">{title}</div>
      </div>
      <div className="top3-bar__cards">
        <div className="top3-bar__cards-inner">
          {products.map((product, idx) => {
            const isFirst = idx === 0;
            const displayScore = product.overallScore ?? 0;
            const displayLabel = product.scoreLabel || (displayScore > 0 ? getScoreLabel(displayScore) : '');
            const starScore = displayScore / 2;
            const hasTrophy = displayScore >= 9.5;

            return (
              <a
                key={product.slug}
                className="top3-card"
                href={product.ctaUrl || `/${categorySlug}/reviews/${product.slug}`}
                target="_blank"
                rel="nofollow noreferrer"
                data-product-name={product.name}
              >
                {/* Ribbon for first product */}
                {isFirst && (
                  <div className="top3-card__ribbon" data-testid="product-ribbon">
                    <div className="top3-card__ribbon-text">Our Recommendation</div>
                  </div>
                )}

                <div className={`top3-card__body${isFirst ? ' top3-card__body--first' : ''}`}>
                  <div style={{width:"100%",display:"flex", alignItems: "center", justifyContent:"space-between"}}>
                    {/* Icon logo */}
                 <div style={{display:"flex", alignItems:"center"}}>
                   <div className="top3-card__icon">
                    {product.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.logoUrl} alt={product.name} width={30} height={30} loading="lazy" />
                    ) : (
                      <span className="top3-card__icon-fallback">{product.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* Product name */}
                  <div style={{margin: "0 0 0 15px"}} className="top3-card__name" data-testid="product-name">{product.name}</div>

                 </div>
                  {/* Score */}
                  {displayScore > 0 && (
                    <div className="top3-card__score" style={{width:"auto"}}>
                      <div className="top3-card__score-widget" data-role="product-score" data-with-trophy={hasTrophy ? 'true' : 'false'}>
                        <div className="top3-card__score-wording">
                          <span className="top3-card__score-label">{displayLabel}</span>
                          <div className="top3-card__score-stars">
                            <StarsIcon score={starScore} />
                          </div>
                        </div>
                        <div className="top3-card__score-value-wrap">
                          {hasTrophy && (
                            <span className="top3-card__trophy">
                              <TrophyIcon />
                            </span>
                          )}
                          <div className="top3-card__score-value">{displayScore.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Bottom line + CTA */}
                  <div className="top3-card__footer">
                    {product.bottomLine && (
                      <div className="top3-card__bottom-line" data-testid="top3-products-bottom-line">
                        <div>{product.bottomLine}</div>
                      </div>
                    )}
                    <div className="top3-card__cta">
                      <div className="top3-card__cta-text">{'Get Started'}</div>
                      <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: '11px' }}>
                        <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
