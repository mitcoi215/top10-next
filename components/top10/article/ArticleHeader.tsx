'use client';

interface ArticleHeaderProps {
  title: string;
  authorName: string;
  authorImage: string;
  authorSlug: string;
  publishedDate: string;
  updatedDate?: string;
  featuredImage: string;
  featuredImageAlt?: string;
  breadcrumbs: Array<{
    label: string;
    href?: string;
  }>;
}

export default function ArticleHeader({
  title,
  authorName,
  authorImage,
  authorSlug,
  publishedDate,
  updatedDate,
  featuredImage,
  featuredImageAlt,
  breadcrumbs,
}: ArticleHeaderProps) {
  return (
    <div className="article-header-section" style={{
      width: '100%',
      padding: '16px 12px 0',
      backgroundColor: 'var(--color-background-alt, #F9F9F9)',
    }}>
      <div style={{
        maxWidth: '1174px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Desktop: Row layout */}
        <div className="article-header-content" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '72px',
        }}>
          {/* Left side: Breadcrumb, Title, Author */}
          <div style={{
            flex: 1,
            maxWidth: '710px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            justifyContent: 'center',
          }}>
            {/* Breadcrumb */}
            <nav className="breadcrumb-nav" style={{ display: 'none' }}>
              <ul style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                fontSize: '14px',
                lineHeight: '17px',
                color: '#717171',
              }}>
                {breadcrumbs.map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    textTransform: 'capitalize',
                  }}>
                    {item.href ? (
                      <a href={item.href} style={{
                        color: 'inherit',
                        textDecoration: 'none',
                      }}>
                        {item.label}
                      </a>
                    ) : (
                      <span style={{
                        maxWidth: '158px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {item.label}
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <span style={{ margin: '0 8px', color: '#717171' }}>/</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Title */}
            <h1 style={{
              fontSize: '28px',
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: 'left',
              color: 'var(--color-body-1, #191919)',
              margin: 0,
            }}>
              {title}
            </h1>

            {/* Author Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {/* Author Avatar */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundImage: `url(${authorImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />

                {/* Author Name & Date */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{
                      color: 'var(--color-body-3, #4C4C4C)',
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: '105%',
                      letterSpacing: '-0.1px',
                    }}>
                      By
                    </span>
                    <a href={`/authors/${authorSlug}`} style={{
                      color: 'var(--color-info, #106197)',
                      fontSize: '14px',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      letterSpacing: '-0.1px',
                      textDecoration: 'none',
                      cursor: 'pointer',
                    }}>
                      {authorName}
                    </a>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    fontSize: '12px',
                    color: 'var(--color-body-3, #4C4C4C)',
                    fontWeight: 400,
                    lineHeight: '150%',
                  }}>
                    <span>Published {publishedDate}</span>
                    {updatedDate && (
                      <>
                        <span>|</span>
                        <span>Updated {updatedDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Featured Image */}
          <div style={{
            width: '400px',
            aspectRatio: '16/9',
            borderRadius: '4px',
            backgroundImage: `url(${featuredImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            flexShrink: 0,
            alignSelf: 'center',
          }} />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1199px) {
          .article-header-content {
            flex-direction: column !important;
            gap: 20px !important;
          }
          .article-header-content > div:first-child {
            max-width: 100% !important;
          }
          .article-header-content > div:last-child {
            width: 100% !important;
            aspect-ratio: 16/9 !important;
          }
          h1 {
            font-size: 28px !important;
          }
        }
        @media (min-width: 768px) {
          h1 {
            font-size: 36px !important;
            line-height: 1.4 !important;
          }
        }
        @media (min-width: 1200px) {
          .breadcrumb-nav {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
