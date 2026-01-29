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
  reviewCount?: string;
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

// TrustPilot logo icon
function TrustPilotIcon() {
  return (
    <svg width="74" height="18" viewBox="0 0 74 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.54 7.29H0v1.24h2.89v8.89h1.76v-8.89h2.89V7.29z" fill="#191919"/>
      <path d="M10.27 10.07v1.38c-.13-.06-.27-.1-.42-.14-.15-.03-.31-.05-.48-.05-.38 0-.67.12-.87.35-.2.23-.3.56-.3.98v4.83h-1.6v-7.35h1.52v.83c.16-.28.38-.51.66-.69.28-.17.62-.26 1.02-.26.12 0 .24.01.35.03.11.02.2.05.27.08l-.15.01zM16.5 17.42h-1.6v-.83c-.21.29-.48.52-.8.69-.32.17-.7.26-1.14.26-.68 0-1.22-.22-1.63-.66-.4-.44-.61-1.03-.61-1.78V10.07h1.6v4.53c0 .48.11.84.34 1.08.22.24.54.37.94.37.45 0 .8-.15 1.05-.44.26-.3.38-.71.38-1.25v-4.29h1.6v7.35h-.13zM22.94 13.07c-.09-.25-.22-.46-.38-.62a1.59 1.59 0 00-.56-.38c-.21-.09-.44-.13-.69-.13-.5 0-.91.16-1.22.49-.31.32-.49.78-.52 1.36h3.73a2.8 2.8 0 00-.36-.72zm-3.4 1.87c0 .6.15 1.07.45 1.41.3.34.72.5 1.25.5.36 0 .66-.08.91-.24.24-.16.43-.39.56-.68l1.38.56c-.25.49-.6.88-1.05 1.16-.45.29-1.03.43-1.74.43-.52 0-.99-.09-1.41-.27a3.05 3.05 0 01-1.07-.77 3.5 3.5 0 01-.68-1.17 4.32 4.32 0 01-.24-1.47c0-.52.08-1 .24-1.46.16-.45.39-.85.69-1.18.3-.33.66-.59 1.08-.77.42-.19.89-.28 1.41-.28.5 0 .95.09 1.34.27.39.18.72.43 1 .76.27.33.48.72.62 1.17.15.46.22.96.22 1.52v.51h-5.05l.09-.02zM29.97 12.11c-.1-.06-.24-.12-.42-.17a1.98 1.98 0 00-.52-.07c-.27 0-.51.05-.72.14-.2.09-.38.22-.53.38-.15.16-.26.35-.33.57-.08.22-.11.46-.11.72 0 .54.14.97.43 1.29.29.32.68.48 1.18.48.19 0 .37-.02.54-.06.17-.04.31-.1.42-.16v1.3c-.13.07-.3.12-.5.17-.2.04-.42.07-.65.07-.46 0-.87-.08-1.24-.24a2.7 2.7 0 01-.96-.68 3.04 3.04 0 01-.6-1.04 4.03 4.03 0 01-.21-1.33c0-.49.07-.95.22-1.38.14-.42.36-.79.64-1.1.28-.31.62-.56 1.02-.73.4-.18.85-.27 1.35-.27.24 0 .47.02.69.07.22.05.4.12.55.2v1.33l-.25-.49zM34.86 17.42c-.14.05-.31.09-.51.12-.2.03-.4.05-.6.05-.63 0-1.1-.17-1.43-.5-.32-.33-.49-.81-.49-1.43v-4.2h-1.08v-1.2h1.08V8.49h1.6v1.77h1.59v1.2h-1.59v3.7c0 .33.06.56.19.7.13.14.32.21.59.21.12 0 .24-.01.36-.04.12-.02.22-.06.29-.1v1.49zM36.53 9.56V7.79h1.6v1.77h-1.6zm0 7.86v-7.35h1.6v7.35h-1.6zM40 17.42V7.29h1.6v10.13H40zM49.9 13.83c0-.29-.05-.56-.15-.82-.1-.26-.24-.49-.42-.69a1.91 1.91 0 00-.66-.47 2.05 2.05 0 00-.86-.17c-.31 0-.6.06-.87.17-.26.11-.49.28-.68.49-.19.21-.34.46-.44.74a2.7 2.7 0 00-.15.91c0 .32.05.62.15.91.1.28.25.53.44.74.19.21.41.37.67.49.26.12.55.17.86.17.31 0 .6-.06.87-.17.27-.12.49-.28.67-.49.18-.21.33-.46.43-.74.1-.29.15-.58.15-.9v-.17h.01-.02zm1.6 3.59h-1.52v-.83c-.24.31-.54.55-.91.73-.37.18-.8.27-1.28.27-.5 0-.96-.09-1.37-.28a3.14 3.14 0 01-1.04-.77 3.5 3.5 0 01-.66-1.17 4.34 4.34 0 01-.23-1.43c0-.51.08-.99.24-1.44.16-.45.38-.84.68-1.17.29-.33.65-.59 1.05-.78.41-.19.86-.28 1.36-.28.46 0 .87.08 1.22.25.36.17.66.42.91.74v-.88h1.55v7.04z" fill="#191919"/>
      <path d="M53.24 17.42V7.29h1.6v10.13h-1.6zM61.2 13.83c0-.29-.05-.56-.15-.82-.1-.26-.24-.49-.42-.69a1.91 1.91 0 00-.66-.47 2.05 2.05 0 00-.86-.17c-.31 0-.6.06-.87.17-.26.11-.49.28-.68.49-.19.21-.34.46-.44.74a2.7 2.7 0 00-.15.91c0 .32.05.62.15.91.1.28.25.53.44.74.19.21.41.37.67.49.26.12.55.17.86.17.31 0 .6-.06.87-.17.27-.12.49-.28.67-.49.18-.21.33-.46.43-.74.1-.29.15-.58.15-.9v-.17h.01-.02zm1.6 3.59h-1.52v-.83c-.24.31-.54.55-.91.73-.37.18-.8.27-1.28.27-.5 0-.96-.09-1.37-.28a3.14 3.14 0 01-1.04-.77 3.5 3.5 0 01-.66-1.17 4.34 4.34 0 01-.23-1.43c0-.51.08-.99.24-1.44.16-.45.38-.84.68-1.17.29-.33.65-.59 1.05-.78.41-.19.86-.28 1.36-.28.46 0 .87.08 1.22.25.36.17.66.42.91.74v-.88h1.55v7.04z" fill="#191919"/>
      <path d="M67.08 10.07v1.38c-.13-.06-.27-.1-.42-.14-.15-.03-.31-.05-.48-.05-.38 0-.67.12-.87.35-.2.23-.3.56-.3.98v4.83h-1.6v-7.35h1.52v.83c.16-.28.38-.51.66-.69.28-.17.62-.26 1.02-.26.12 0 .24.01.35.03.11.02.2.05.27.08l-.15.01z" fill="#191919"/>
      <path d="M73.14 10.97l-.92 1.42-1.1-1.42h-1.86l2.15 2.77-2.35 3.08h1.9l1.12-1.56 1.14 1.56h1.86l-2.4-3.1 2.16-2.75h-1.7z" fill="#191919"/>
      <path d="M69.5 0l1.28 3.91H74l-2.65 1.93 1.01 3.12L69.5 6.94l-2.87 2.02 1.01-3.12-2.65-1.93h3.23L69.5 0z" fill="#00B67A"/>
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
  reviewCount,
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
                  <Link data-testid="link" href={`${reviewHref}#visitors-reviews`} className="css-1ijsmci">
                    {reviewCount ? `${reviewCount} reviews` : 'Read review'}
                  </Link>
                  {reviewCount && (
                    <div data-testid="trust-pilot-logo" className="css-uxbj5y">
                      by
                      <TrustPilotIcon />
                    </div>
                  )}
                </span>
              </div>

              {/* Features List - Show first 4 features */}
              <ul data-testid="product-attributes" className="css-9ko16t">
                {features.slice(0, 4).map((feature, index) => (
                  <li key={index} data-testid="product-attribute" className="css-1wkrhmh">
                    <CheckIcon />
                    <div className="css-s6uv9c">
                      <span>{feature.bold ? <strong>{feature.text}</strong> : feature.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
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
  );
}
