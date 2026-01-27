import '@/styles/category.css';

interface ProductCardProps {
  rank: number;
  name: string;
  tagline?: string;
  logo: string;
  score: number;
  scoreLabel: string;
  highlights: string[];
  ctaUrl: string;
  ctaText?: string;
  ribbon?: string;
  bestFor?: string;
  reviewUrl?: string;
}

// Check icon SVG
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#147DC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Arrow icon for CTA button
const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor"/>
  </svg>
);

// Star icon for ribbon
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z"/>
  </svg>
);

export default function ProductCard({
  rank,
  name,
  tagline,
  logo,
  score,
  scoreLabel,
  highlights,
  ctaUrl,
  ctaText = 'Visit Site',
  ribbon,
  bestFor,
  reviewUrl,
}: ProductCardProps) {
  const isTopProduct = rank === 1;
  const cardClass = isTopProduct ? 'css-zht04c' : 'css-cav3ah';

  return (
    <div className="css-109mh73">
      <div className="css-1nxf808">
        <div className={cardClass}>
          {/* Ribbon for top product */}
          {ribbon && (
            <div className="product-ribbon-xsite css-s57r0x">
              <StarIcon />
              <span className="css-54jqjv">{ribbon}</span>
            </div>
          )}

          {/* Logo and Rank Section */}
          <div className={isTopProduct ? 'css-wqm30u' : 'css-t666ws'}>
            <div className="css-16a96gi">
              {/* Rank Number */}
              <div data-name="index-counter" className="css-1fe80e3">
                {rank}
              </div>
              {/* Product Logo */}
              <div data-testid="hybrid-logo" className="css-167poo7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  className="product-logo light-logo css-1hinvb1"
                  data-testid="hybrid-logo-light"
                  alt={name}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="css-8ccc6v">
            {/* Product Name and Tagline */}
            <div className="css-176xys8">
              <span className="css-61six1">{name}</span>
              {tagline && <span className="css-kzec96">- {tagline}</span>}
              {reviewUrl && (
                <div className="css-1me64gx">
                  <a data-testid="link" href={reviewUrl} className="css-1ijsmci">
                    Read Review
                  </a>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="css-9ko16t">
              {highlights.map((highlight, index) => (
                <div key={index} className="css-1wkrhmh">
                  <CheckIcon />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Best For Badge */}
            {bestFor && (
              <div className="css-1s6dmfl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/top10-images/Vector.20250821173439.svg" alt="" className="css-12pzmwv" />
                <span className="css-1r9d90r">{bestFor}</span>
              </div>
            )}
          </div>

          {/* Score and CTA Section */}
          <div className="css-oq0r4z">
            {/* Score Badge */}
            <div data-role="product-score" className="css-1frkq1e">
              <div className="css-nkl1s3">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" fontSize="14">
                  <path d="M8.625 16.25a8.125 8.125 0 100-16.25 8.125 8.125 0 000 16.25z" fill="#106197"></path>
                  <path d="M5.05 8.545l.866-1.126L8.17 9.325l3.64-4.073 1.04.953-4.594 5.027L5.05 8.545z" fill="#F5F5F5"></path>
                </svg>
                <div className="css-101s3w3">
                  <span className="css-87z3mv">{score.toFixed(1)}</span>
                </div>
              </div>
              <div className="css-phmloz">
                <span data-role="score-wording" className="css-jis5ax">{scoreLabel}</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              data-testid="link"
              target="_blank"
              rel="noopener noreferrer sponsored"
              href={ctaUrl}
              className="css-1un23uh"
            >
              {ctaText}
              <div className="css-k15e0p">
                <ArrowIcon />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
