'use client';

// Footer links - exact from original HTML
const footerLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/cookie', label: 'Cookie Policy' },
  { href: '/terms-of-use', label: 'Terms of Use' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/sitemap', label: 'Sitemap' },
  { href: '/partner-with-us', label: 'Partner With Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Top10Footer() {
  return (
    <div data-role="footer-container">
      <footer data-testid="footer-wrapper" className="ni-1m0vf1y" data-role="footer">
        {/* Left Column - Logo, Copyright, DSMPI */}
        <section className="ni-1uchtww">
          <div className="ni-1h0wnoe">
            <a href="/" data-testid="site-logo" className="ni-ov1ktg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ni-15m83jm"
                src="/top10-images/logo.20230326195623.20230518090244.20230706064308.svg"
                alt="Top10"
                loading="lazy"
                width="320"
                height="50"
              />
            </a>
          </div>

          <div className="ni-idpj16" data-testid="copyright">
            <p>Copyright © 2009 - 2026 Natural Intelligence Ltd. All Rights Reserved.</p>
            <p><strong>Mailing address:</strong></p>
            <p>4023 Kennett Pike #50055</p>
            <p>Wilmington, DE 19807</p>
          </div>

          <div>
            <button
              type="button"
              data-testid="dont-sell-my-information-button"
              data-role="dont-sell-my-information-button"
              className="ni-1yqqrly"
            >
              Don&apos;t Sell My Personal Information
            </button>
          </div>
        </section>

        {/* Right Column - Disclosure & Nav */}
        <section className="ni-souzml">
          <div className="ni-1vmov3b">
            {/* Disclosure */}
            <div className="ni-zsrdnm">
              <div className="ni-yj9kw3">
                <p>
                  Top10.com is designed to help users make confident decisions online,
                  this website contains information about a wide range of products and services.
                  Certain details, including but not limited to prices and special offers,
                  are provided to us directly from our partners and are dynamic and subject to change
                  at any time without prior notice. Though based on meticulous research, the information
                  we share does not constitute legal or professional advice or forecast, and should not
                  be treated as such.
                </p>
                <p>Reproduction in whole or in part is strictly prohibited.</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="ni-gmc94n">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href} className="ni-art7qp">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Mobile DSMPI Button */}
          <div className="ni-54xudk">
            <button
              type="button"
              data-role="dont-sell-my-information-button"
              className="ni-d4kaco"
            >
              Don&apos;t Sell My Personal Information
            </button>
          </div>
        </section>
      </footer>
    </div>
  );
}
