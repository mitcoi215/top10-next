import Link from 'next/link';

export default function Footer() {
  return (
    <footer data-testid="footer-wrapper" className="css-1m0vf1y" data-role="footer">
      <section className="css-1uchtww">
        {/* Logo */}
        <div className="css-1h0wnoe">
          <a href="/" data-testid="site-logo" className="ni-ov1ktg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="ni-15m83jm"
                src="/logo.png"
                alt="Top10"
                loading="lazy"
                width="320"
                height="50"
              />
              <div>Rating</div>
            </a>
        </div>

        {/* Copyright */}
        <div className="css-idpj16" data-testid="copyright">
          <p>Copyright © 2009 - 2026 Natural Intelligence Ltd. All Rights Reserved.</p>
          <p><strong>Mailing address:</strong></p>
          <p>4023 Kennett Pike #50055</p>
          <p>Wilmington, DE 19807</p>
        </div>

        {/* Don't Sell My Personal Information - Desktop */}
        <div data-type="application/hydration-marker">
          <button
            type="button"
            data-testid="dont-sell-my-information-button"
            data-role="dont-sell-my-information-button"
            className="css-boalg5"
          >
            Don&apos;t Sell My Personal Information
          </button>
        </div>
      </section>

      <section className="css-souzml">
        <section className="css-1vmov3b">
          {/* Disclosure */}
          <div data-testid="disclosure-container" className="css-1scy9uy">
            <div className="css-yj9kw3">
              <p>
                10rating is designed to help users make confident decisions online, this website contains information
                about a wide range of products and services. Certain details, including but not limited to prices and
                special offers, are provided to us directly from our partners and are dynamic and subject to change at
                any time without prior notice. Though based on meticulous research, the information we share does not
                constitute legal or professional advice or forecast, and should not be treated as such.
              </p>
              <p>Reproduction in whole or in part is strictly prohibited.</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav data-testid="navigation-menu" className="css-2xl7tm">
            <Link href="/about-us" data-testid="navigation-menu-link" className="css-art7qp">About Us</Link>
            <Link href="/cookie-policy" data-testid="navigation-menu-link" className="css-art7qp">Cookie Policy</Link>
            <Link href="/terms-of-use" data-testid="navigation-menu-link" className="css-art7qp">Terms of Use</Link>
            <Link href="/privacy-policy" data-testid="navigation-menu-link" className="css-art7qp">Privacy Policy</Link>
            <Link href="/sitemap" data-testid="navigation-menu-link" className="css-art7qp">Sitemap</Link>
            <Link href="/partner-with-us" data-testid="navigation-menu-link" className="css-art7qp">Partner With Us</Link>
            <Link href="/contact" data-testid="navigation-menu-link" className="css-art7qp">Contact</Link>
          </nav>
        </section>

        {/* Don't Sell My Personal Information - Mobile */}
        <section className="css-54xudk">
          <div data-type="application/hydration-marker">
            <button
              type="button"
              data-testid="dont-sell-my-information-button"
              data-role="dont-sell-my-information-button"
              className="css-6i4wti"
            >
              Don&apos;t Sell My Personal Information
            </button>
          </div>
        </section>
      </section>
    </footer>
  );
}
