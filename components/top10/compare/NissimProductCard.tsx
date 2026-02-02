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

function TrustpilotLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="23" fill="none" viewBox="0 0 100 25" className="nissim-trustpilot-logo">
      <g clipPath="url(#tp-logo-a)">
        <path fill="currentColor" d="M24.704 8.182h9.517v1.776H30.48v9.982h-2.058V9.958h-3.726V8.182h.009zm9.11 3.244h1.76v1.643h.033c.058-.232.166-.456.324-.672.158-.216.348-.423.572-.597a3.03 3.03 0 01.747-.44c.274-.108.556-.166.838-.166.216 0 .374.008.457.017.083.008.166.025.257.033v1.809a5.992 5.992 0 00-.407-.058 3.445 3.445 0 00-.406-.025c-.316 0-.614.066-.896.19a2.065 2.065 0 00-.73.557 2.822 2.822 0 00-.498.912c-.125.366-.183.78-.183 1.253v4.05h-1.876v-8.506h.009zm13.61 8.514H45.58v-1.186h-.033a2.557 2.557 0 01-1.029 1.028c-.456.258-.92.39-1.394.39-1.12 0-1.933-.273-2.431-.83-.498-.555-.747-1.393-.747-2.514v-5.402h1.875v5.22c0 .747.142 1.278.432 1.585.282.307.689.464 1.203.464.398 0 .722-.058.988-.182a1.68 1.68 0 00.639-.49 1.88 1.88 0 00.356-.73 3.6 3.6 0 00.108-.921v-4.937h1.876v8.505zm3.194-2.73c.058.548.266.93.623 1.154.365.215.796.331 1.303.331.174 0 .373-.016.597-.041.224-.025.44-.083.63-.158.2-.074.357-.19.49-.34.125-.15.183-.34.174-.58a.802.802 0 00-.265-.59 1.869 1.869 0 00-.63-.373 6.325 6.325 0 00-.88-.241c-.332-.066-.664-.141-1.004-.216a9.559 9.559 0 01-1.013-.282 3.094 3.094 0 01-.871-.448 1.97 1.97 0 01-.614-.714c-.158-.29-.233-.647-.233-1.078 0-.465.117-.847.34-1.162.225-.315.515-.564.855-.755.349-.191.73-.324 1.154-.407a7.03 7.03 0 011.211-.116c.44 0 .863.05 1.262.141.398.091.763.24 1.087.456.323.208.589.482.805.814.215.332.348.738.406 1.211h-1.958c-.091-.448-.29-.755-.614-.904a2.515 2.515 0 00-1.112-.233c-.133 0-.29.009-.473.034a2.588 2.588 0 00-.514.124c-.158.058-.291.15-.407.266a.642.642 0 00-.166.456.71.71 0 00.24.556c.158.141.366.257.623.357.257.091.548.174.88.24.331.067.672.142 1.02.216.34.075.672.174 1.004.282.332.108.623.257.88.448s.465.424.622.706c.158.282.24.639.24 1.054 0 .506-.115.929-.348 1.286a2.76 2.76 0 01-.896.854c-.365.216-.78.382-1.228.482-.448.1-.896.15-1.336.15a5.67 5.67 0 01-1.494-.183 3.638 3.638 0 01-1.186-.548 2.716 2.716 0 01-.789-.921c-.19-.365-.29-.805-.307-1.311h1.892v-.017zm6.19-5.784h1.42V8.871h1.875v2.555h1.693v1.403h-1.693v4.547c0 .2.008.365.025.515a.948.948 0 00.116.365c.058.1.15.174.274.224.124.05.282.074.498.074.133 0 .265 0 .398-.008s.266-.025.398-.058v1.452c-.207.025-.414.042-.605.067a4.85 4.85 0 01-.606.033c-.498 0-.896-.05-1.195-.141-.299-.092-.54-.233-.705-.415a1.44 1.44 0 01-.349-.68c-.058-.274-.1-.59-.108-.938v-5.02h-1.419v-1.42h-.016zm6.316 0h1.775v1.154h.033c.266-.498.631-.847 1.104-1.062.473-.216.98-.324 1.535-.324.672 0 1.253.116 1.751.357.498.232.913.556 1.245.97.332.416.572.897.738 1.445.166.547.25 1.136.25 1.759 0 .572-.075 1.128-.225 1.66a4.444 4.444 0 01-.672 1.427 3.3 3.3 0 01-1.145.987c-.465.25-1.004.373-1.635.373-.274 0-.547-.024-.821-.074a3.61 3.61 0 01-.789-.24 2.845 2.845 0 01-.697-.424 2.628 2.628 0 01-.539-.598h-.033v4.25h-1.875v-11.66zm6.555 4.266c0-.382-.05-.755-.15-1.12a2.983 2.983 0 00-.448-.963 2.283 2.283 0 00-.738-.672 2.07 2.07 0 00-1.02-.258c-.79 0-1.386.274-1.785.822-.398.548-.597 1.278-.597 2.19 0 .432.05.83.157 1.196.108.365.258.68.473.945.208.266.457.473.747.623.29.158.63.232 1.013.232.431 0 .788-.091 1.087-.265a2.32 2.32 0 00.73-.68c.19-.283.332-.598.415-.955.074-.357.116-.722.116-1.095zm3.31-7.51h1.876v1.776H72.99V8.182zm0 3.244h1.876v8.514H72.99v-8.514zm3.552-3.244h1.876V19.94H76.54V8.182zm7.626 11.99c-.68 0-1.286-.116-1.817-.34a4.012 4.012 0 01-1.353-.93 4.048 4.048 0 01-.838-1.418 5.476 5.476 0 01-.29-1.809c0-.647.1-1.245.29-1.792a4.058 4.058 0 01.838-1.42 3.82 3.82 0 011.353-.929c.531-.224 1.137-.34 1.817-.34.68 0 1.286.116 1.817.34.532.224.98.54 1.353.93.365.398.647.871.838 1.419.191.547.29 1.145.29 1.792 0 .655-.099 1.261-.29 1.809a4.048 4.048 0 01-.838 1.419 3.82 3.82 0 01-1.353.93c-.53.223-1.136.34-1.817.34zm0-1.485c.415 0 .78-.091 1.087-.265.307-.175.556-.407.755-.69.2-.281.34-.605.44-.962a4.42 4.42 0 00.141-1.095c0-.365-.05-.722-.14-1.087a2.838 2.838 0 00-.44-.963 2.175 2.175 0 00-1.842-.946c-.416 0-.78.092-1.088.266a2.384 2.384 0 00-.755.68c-.2.283-.34.598-.44.963a4.44 4.44 0 00-.14 1.087c0 .373.049.738.14 1.095.092.357.24.68.44.963.2.282.448.514.755.689.307.182.672.265 1.087.265zm4.846-7.26h1.42V8.87h1.875v2.555H94v1.403h-1.692v4.547c0 .2.008.365.024.515a.946.946 0 00.117.365.53.53 0 00.273.224c.125.05.283.074.498.074.133 0 .266 0 .399-.008.132-.008.265-.025.398-.058v1.452c-.207.025-.415.042-.605.067a4.85 4.85 0 01-.606.033c-.498 0-.896-.05-1.195-.141-.299-.092-.54-.233-.705-.415a1.44 1.44 0 01-.348-.68c-.058-.274-.1-.59-.108-.938v-5.02h-1.42v-1.42h-.016z" />
        <path fill="#00B67A" d="M22.512 8.182h-8.596L11.26 0 8.597 8.182 0 8.174l6.962 5.061-2.664 8.174 6.962-5.054 6.954 5.054-2.655-8.174 6.954-5.053z" />
        <path fill="#fff" d="M16.156 15.086l-.598-1.85-4.298 3.12 4.896-1.27z" />
      </g>
      <defs>
        <clipPath id="tp-logo-a">
          <path fill="#fff" d="M0 0h94v23.085H0z" />
        </clipPath>
      </defs>
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
                    <div className="nissim-card__reviews-by">
                      <span>by</span>
                      <TrustpilotLogo />
                    </div>
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
