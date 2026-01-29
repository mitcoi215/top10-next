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
    <>
      <div className="product-logo-cta" data-testid="logo-and-ctas">
        {/* Logo on Left */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={productName} className="product-logo" />
        {/* Button on Right */}
        <div className="cta-container">
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-link"
          >
            <button className="cta-button" data-testid="visit-site">
              <span>{ctaText}</span>
              <div className="cta-icon">
                <ExternalLinkIcon />
              </div>
            </button>
          </a>
        </div>
      </div>
      <style jsx>{`
        .product-logo-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px;
          margin: 24px 0;
          background-color: #f8f9fa;
          border-radius: 8px;
          gap: 24px;
        }

        .cta-container {
          flex-shrink: 0;
        }

        .cta-link {
          text-decoration: none;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background-color: #FF4A64;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .cta-button:hover {
          background-color: #B53547;
        }

        .cta-icon {
          display: flex;
          align-items: center;
        }

        .product-logo {
          max-width: 120px;
          max-height: 60px;
          object-fit: contain;
        }

        @media (max-width: 480px) {
          .product-logo-cta {
            flex-direction: column;
            text-align: center;
          }

          .product-logo {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </>
  );
}
