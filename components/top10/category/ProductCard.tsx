import Link from 'next/link';

interface ProductFeature {
  text: string;
  bold?: boolean;
}

interface ProductQuote {
  text: string;
  source: string;
  date: string;
}

interface ProductCardProps {
  position: number;
  productId: string;
  name: string;
  slug: string;
  logo: string;
  bottomLine: string;
  features: ProductFeature[];
  quote?: ProductQuote;
  ctaText: string;
  ctaHref: string;
  ribbon?: string;
  reviewHref: string;
}

// Checkmark SVG icon
function CheckIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" fontSize="12px" data-testid="valid-icon">
      <path d="M1 6.002l4.6 4.6a.093.093 0 00.133 0L15 1.335" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Quote icon
function QuoteIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" fontSize="15px">
      <path fillRule="evenodd" clipRule="evenodd" d="M23 12c0 6.075-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1s11 4.925 11 11zm-9.64 3.206c.498.537 1.126.825 1.884.864.847.045 1.509-.193 1.983-.713a2.91 2.91 0 00.768-1.866c.036-.679-.135-1.255-.513-1.729-.377-.474-.884-.829-1.52-1.067-.308-.107-.515-.202-.622-.288-.108-.085-.156-.24-.143-.467.022-.43.286-.774.791-1.03.48-.25.999-.413 1.535-.482l-.077-1.094c-1.347.112-2.456.677-3.326 1.699-.87 1.02-1.342 2.245-1.417 3.67-.058 1.132.16 1.966.657 2.503zm-6.899-.046c.498.537 1.125.825 1.884.865.847.045 1.508-.193 1.982-.713.475-.52.731-1.142.77-1.866.035-.68-.136-1.256-.514-1.73-.377-.473-.885-.829-1.52-1.067-.308-.106-.516-.202-.623-.287-.107-.085-.155-.241-.143-.467.023-.43.286-.774.792-1.031.48-.25.999-.412 1.535-.481l-.077-1.094C9.199 7.4 8.09 7.966 7.22 8.987c-.87 1.021-1.342 2.245-1.417 3.671-.059 1.132.16 1.966.657 2.502z" fill="currentColor" />
    </svg>
  );
}

// Arrow icon for CTA
function ArrowIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="currentColor" />
    </svg>
  );
}

// Thumbs up icon for ribbon
function ThumbsUpIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.25 6.452c-.068 1.896-.795 5.592-2.304 5.991-1.622.43-2.796.47-5.605-.142-.582-.089-1.169-.137-1.758-.143a.196.196 0 01-.191-.197V6a.188.188 0 01.075-.154c.382-.272.611-.985 1.023-1.353.774-.692 1.365-.899 1.884-1.29.892-.674 1.056-1.529 1.339-2.2.232-.55.614-.942 1.186-.687.577.258 1.179 1.306.456 2.796-.21.433-.511.748-.788 1.512-.063.177-.078.458.125.445a20.274 20.274 0 013.401.03 1.313 1.313 0 011.157 1.353zM3.642 12.086V5.585a.392.392 0 00-.393-.392H1.142a.392.392 0 00-.392.392v6.501a.395.395 0 00.392.393H3.25a.395.395 0 00.393-.393z" fill="currentColor" />
    </svg>
  );
}

export default function ProductCard({
  position,
  productId,
  name,
  slug,
  logo,
  bottomLine,
  features,
  quote,
  ctaText,
  ctaHref,
  ribbon,
  reviewHref,
}: ProductCardProps) {
  return (
    <div
      className="chart-product-text nilink"
      data-role="chart-product"
      data-filterable="true"
      data-product-name={name}
      data-product-id={productId}
      data-product-type="regular"
      data-product-position={position}
      data-visible="true"
      data-view-type="text"
      data-available="true"
    >
      <div data-type="application/hydration-marker">
        <div data-role="chart-product-card-wrapper" data-product-name={name} data-product-id={productId} className="css-109mh73">
          <div data-testid="chart-product-card" data-role="chart-product-card" data-product-position={position} data-product-id={productId} className="css-1nxf808">
            <div className="css-zht04c">
              {/* Ribbon */}
              {ribbon && (
                <div className="product-ribbon-xsite css-s57r0x" data-testid="product-ribbon">
                  <ThumbsUpIcon />
                  <div className="css-54jqjv">{ribbon}</div>
                </div>
              )}

              {/* Logo Section */}
              <div className="css-wqm30u">
                <div className="css-16a96gi">
                  <div className="css-1fe80e3" data-testid="index-counter" data-name="index-counter">{position}</div>
                  <div data-testid="hybrid-logo" className="css-167poo7">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo}
                      className="product-logo light-logo css-1hinvb1"
                      data-testid="hybrid-logo-light"
                      data-role="product-logo-image"
                      alt={name}
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="css-8ccc6v">
                {/* Bottom Line */}
                <div data-testid="product-bottom-line" className="css-176xys8">
                  <span data-testid="bottom-line-product-name" className="css-61six1">
                    <span>{name}</span> -
                  </span>
                  <span data-testid="bottom-line-text" className="css-kzec96">
                    <span>{bottomLine}</span>
                  </span>
                  <span data-testid="bottom-line-review-link" className="css-1me64gx">
                    <Link data-testid="link" href={reviewHref} className="css-1ijsmci">Read review</Link>
                  </span>
                </div>

                {/* Features List */}
                <ul data-testid="product-attributes" className="css-9ko16t">
                  {features.map((feature, index) => (
                    <li key={index} data-testid="product-attribute" className="css-1wkrhmh">
                      <CheckIcon />
                      <div className="css-s6uv9c">
                        <span>{feature.bold ? <strong>{feature.text}</strong> : feature.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Quote Section */}
                {quote && (
                  <div data-testid="product-soa" className="css-1myhh97">
                    <div data-testid="product-soa-title" className="css-nkl1s3">
                      <QuoteIcon />
                      <div className="css-101s3w3">
                        <strong className="css-87z3mv">{quote.source}</strong> highlights {name}
                      </div>
                    </div>
                    <div className="css-phmloz">
                      <p data-testid="product-soa-citation-text" className="css-jis5ax">
                        &quot;{quote.text}&quot;
                        <span data-testid="product-soa-date" className="css-ncmbik">({quote.date})</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Section */}
              <div className="css-oq0r4z">
                <div className="css-1frkq1e">
                  <a
                    data-testid="popover-trigger"
                    data-role="product-cta"
                    data-product-id={productId}
                    data-product-name={name}
                    rel="nofollow noreferrer"
                    className="nilink css-1un23uh"
                    href={ctaHref}
                    target="_blank"
                    data-review-link={reviewHref}
                  >
                    <span>{ctaText}</span>
                    <div className="endIcon css-k15e0p">
                      <ArrowIcon />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
