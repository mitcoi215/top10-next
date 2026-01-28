import Link from 'next/link';

interface NavbarProps {
  categorySlug?: string;
}

export default function Navbar({ categorySlug = 'tv-services' }: NavbarProps) {
  return (
    <header>
      <div className="navbar" data-role="navbar">
        <div className="css-14g7q0x">
          <nav className="css-1ylgh7i">
            <div className="css-rqm9z0">
              <Link href="/" className="css-1lh1pzd" data-testid="site-logo">
                <div data-testid="hybrid-logo" className="css-167poo7">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/top10-images/top10-logo.svg"
                    className="light-logo css-7mr6p5"
                    data-testid="hybrid-logo-light"
                    alt="Site Logo"
                    loading="lazy"
                  />
                </div>
              </Link>
            </div>
            <div data-testid="nav-bar-right-side" className="css-1jw7vo5">
              <input
                type="checkbox"
                id="hamburger-menu"
                data-testid="nav-bar-hamburger-checkbox"
                className="css-1hlbggb"
              />
              <label htmlFor="hamburger-menu" data-testid="nav-bar-hamburger-label" className="css-mqlevd">
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hamburger-menu css-14zb0el"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 19.5A1.5 1.5 0 002.5 21h19a1.5 1.5 0 000-3h-19A1.5 1.5 0 001 19.5zM1 12a1.5 1.5 0 001.5 1.5h19a1.5 1.5 0 000-3h-19A1.5 1.5 0 001 12zm1.5-9a1.5 1.5 0 100 3h19a1.5 1.5 0 000-3h-19z"
                    fill="currentColor"
                  />
                </svg>
              </label>
              <label htmlFor="hamburger-menu" className="backdrop css-1twskg0" data-testid="nav-bar-backdrop" />
              <ul className="nav-bar-link-list css-q8f278" data-testid="nav-bar-link-list">
                <label htmlFor="hamburger-menu" data-testid="nav-bar-exit-label-button" className="css-5s1gij">
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="css-vd4kw7"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 1.2L10.8 0 6 4.8 1.2 0 0 1.2 4.8 6 0 10.8 1.2 12 6 7.2l4.8 4.8 1.2-1.2L7.2 6 12 1.2z"
                    />
                  </svg>
                </label>
                <li className="css-18ojb17">
                  <Link href={`/${categorySlug}/comparison`} className="css-1u50saz">
                    Compare
                  </Link>
                </li>
                <li className="css-18ojb17">
                  <Link href={`/${categorySlug}/reviews`} className="css-1u50saz">
                    Reviews
                  </Link>
                </li>
                <li className="css-18ojb17">
                  <Link href={`/${categorySlug}/top-reads`} className="css-1u50saz">
                    Articles
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
