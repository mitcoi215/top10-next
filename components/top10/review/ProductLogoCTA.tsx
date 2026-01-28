'use client';

interface ProductLogoCTAProps {
  logo: string;
  productName: string;
  ctaText?: string;
  ctaHref: string;
}

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.667 10.667H1.333V1.333H6V0H1.333C0.593 0 0 0.6 0 1.333v9.334C0 11.4 0.593 12 1.333 12h9.334c.733 0 1.333-.6 1.333-1.333V6h-1.333v4.667zM7.333 0v1.333h2.394L3.173 7.887l.94.94 6.554-6.554v2.394H12V0H7.333z" fill="currentColor"/>
    </svg>
  );
}

export default function ProductLogoCTA({
  logo,
  productName,
  ctaText = 'Visit Site',
  ctaHref,
}: ProductLogoCTAProps) {
  return (
    <div className="ni-14shd" data-testid="logo-and-ctas">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={productName} className="ni-1uzmobf" />
      <div className="ni-wm7fk9">
        <div className="ni-fndg26">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="nilink ni-1irj517"
          >
            <button className="ni-1f5lmo" data-testid="visit-site">
              {ctaText}
              <div className="endIcon ni-k15e0p">
                <ExternalLinkIcon />
              </div>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
