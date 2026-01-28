'use client';

interface RelatedProduct {
  name: string;
  logo: string;
  description: string;
  href: string;
}

interface ArticleSidebarProps {
  title: string;
  products: RelatedProduct[];
  seeAllHref?: string;
  seeAllText?: string;
}

export default function ArticleSidebar({
  title,
  products,
  seeAllHref,
  seeAllText = 'See All',
}: ArticleSidebarProps) {
  return (
    <aside className="article-sidebar" style={{
      display: 'none',
      minWidth: '300px',
      flexDirection: 'column',
      position: 'relative',
      gap: '32px',
    }}>
      <div style={{
        color: '#000000',
        padding: '32px',
        border: '1px solid #EEEEEE',
        borderRadius: '4px',
      }}>
        <h3 style={{
          fontSize: '22px',
          lineHeight: 1.33,
          fontWeight: 700,
          margin: 0,
          marginBottom: '24px',
        }}>
          {title}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          {products.map((product, index) => (
            <a
              key={index}
              href={product.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '50px',
                gap: '16px',
                textDecoration: 'none',
                marginTop: index > 0 ? '26px' : 0,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}>
                <img
                  src={product.logo}
                  alt={product.name}
                  style={{
                    border: '1px solid #EEEEEE',
                    borderRadius: '50%',
                    width: '50px',
                    maxHeight: '50px',
                    backgroundColor: '#FFFFFF',
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}>
                <span style={{
                  color: '#000000',
                  fontSize: '16px',
                  fontWeight: 700,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {product.name}
                </span>
                <span style={{
                  color: '#000000',
                  fontSize: '14px',
                  fontWeight: 400,
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {product.description}
                </span>
              </div>
            </a>
          ))}
        </div>

        {seeAllHref && (
          <div style={{ marginTop: '24px' }}>
            <a
              href={seeAllHref}
              style={{
                fontSize: '14px',
                color: 'var(--color-info, #106197)',
                fontWeight: 600,
                lineHeight: '13px',
                textDecoration: 'none',
              }}
            >
              {seeAllText} →
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (min-width: 1200px) {
          .article-sidebar {
            display: flex !important;
          }
        }
      `}</style>
    </aside>
  );
}
