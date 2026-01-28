interface AuthorBoxProps {
  name: string;
  image: string;
  slug: string;
  title?: string;
  bio?: string;
}

export default function AuthorBox({ name, image, slug, title, bio }: AuthorBoxProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '24px',
      backgroundColor: 'var(--color-background-alt, #F9F9F9)',
      borderRadius: '4px',
      marginTop: '40px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
        }} />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--color-body-3, #4C4C4C)',
            fontWeight: 400,
          }}>
            Written by
          </span>
          <a
            href={`/authors/${slug}`}
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-body-1, #191919)',
              textDecoration: 'none',
            }}
          >
            {name}
          </a>
          {title && (
            <span style={{
              fontSize: '14px',
              color: 'var(--color-body-3, #4C4C4C)',
              fontWeight: 400,
            }}>
              {title}
            </span>
          )}
        </div>
      </div>
      {bio && (
        <p style={{
          fontSize: '14px',
          lineHeight: 1.5,
          color: 'var(--color-body-2, #383838)',
          margin: 0,
        }}>
          {bio}
        </p>
      )}
    </div>
  );
}
