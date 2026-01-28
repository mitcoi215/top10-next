interface ProductCTAProps {
  logo: string;
  name: string;
  ctaText: string;
  ctaHref: string;
}

export default function ProductCTA({ logo, name, ctaText, ctaHref }: ProductCTAProps) {
  return (
    <div style={{
      width: '100%',
      minHeight: 'initial',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0px 8px 16px 0px rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      padding: '16px',
      border: '1px solid var(--color-border-1, #D5D5D5)',
      backgroundColor: '#FFFFFF',
      marginBottom: '16px',
    }}>
      {/* Product Logo */}
      <img
        src={logo}
        alt={name}
        style={{
          maxWidth: '130px',
          maxHeight: '80px',
          width: '100%',
          display: 'block',
          objectFit: 'contain',
          margin: 0,
        }}
      />

      {/* CTA Button */}
      <div style={{
        display: 'flex',
        gap: '8px',
        justifyContent: 'center',
        flexDirection: 'column',
        width: 'auto',
      }}>
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          data-role="product-cta"
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            outline: 'none',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 600,
            color: 'white',
            textDecoration: 'none',
            backgroundColor: 'var(--color-cta, #FF4A64)',
            transition: 'background-color 0.3s',
            minHeight: '40px',
            width: '100%',
            minWidth: '154px',
            padding: '0 16px',
          }}
        >
          {ctaText}
          <span style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            marginTop: '2px',
            marginLeft: '8px',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.405 6.613l-4.022 3.89a.718.718 0 000 1.039.779.779 0 001.074 0l5.32-5.144a.718.718 0 000-1.039L6.458.215A.771.771 0 005.92 0a.771.771 0 00-.537.215.718.718 0 000 1.04l4.022 3.889H.76c-.42 0-.76.329-.76.734 0 .406.34.735.76.735h8.645z" fill="white"/>
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
