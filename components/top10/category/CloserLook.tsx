import Link from 'next/link';

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
}

interface CloserLookProps {
  title: string;
  items: CloserLookItem[];
}

export default function CloserLook({ title, items }: CloserLookProps) {
  return (
    <section className="charticle__closer-look under-wysiwyg">
      <div className="css-1ej1u3r">
        <h2 className="css-closer-look-title">{title}</h2>
        <div className="css-closer-look-list">
          {items.map((item) => (
            <div key={item.position} className="css-mini-review" data-product-name={item.name}>
              <div className="css-mini-review-header">
                <span className="css-mini-review-position">{item.position}</span>
                <h3 className="css-mini-review-name">{item.name}</h3>
              </div>
              <div className="css-mini-review-content">
                <div className="css-mini-review-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logo} alt={item.name} loading="lazy" />
                </div>
                <div className="css-mini-review-info">
                  <p className="css-mini-review-tagline">{item.tagline}</p>
                  <Link href={item.reviewHref} className="css-mini-review-read">
                    Read {item.name} Review
                  </Link>
                  <a href={item.ctaHref} className="css-mini-review-cta" target="_blank" rel="nofollow noreferrer">
                    Visit Site
                  </a>
                </div>
                <div className="css-mini-review-details">
                  <div className="css-mini-review-detail">
                    <span className="css-detail-label">Best for</span>
                    <span className="css-detail-value">{item.bestFor}</span>
                  </div>
                  <div className="css-mini-review-detail">
                    <span className="css-detail-label">Base price</span>
                    <span className="css-detail-value">{item.basePrice}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
