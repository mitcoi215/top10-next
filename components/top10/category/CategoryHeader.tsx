import '@/styles/category.css';

interface CategoryHeaderProps {
  title: string;
  description?: string;
  author: {
    name: string;
    image: string;
    credentials?: string;
  };
  lastUpdated: string;
  heroImage: string;
  breadcrumb: { label: string; href: string }[];
}

export default function CategoryHeader({
  title,
  author,
  lastUpdated,
  heroImage,
  breadcrumb,
}: CategoryHeaderProps) {
  return (
    <>
      {/* Disclosure Notice */}
      <div className="css-1lgr5sy elnea280">
        <div className="css-19i7pex" data-testid="set-off-box-wrapper">
          <div className="css-1pc6w80">
            <div data-testid="set-off-box-text" className="css-7e8ctb">
              We earn commissions from brands listed on this site, which influences how listings are presented.
            </div>
            <div className="css-16cmgru">
              <div data-testid="advertising-disclosure" className="css-1dgld9d">
                <button className="css-1ax3l46">Advertising Disclosure</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="css-14g7q0x">
        <nav className="css-1ylgh7i">
          <div className="css-rqm9z0">
            <a target="_self" data-testid="site-logo" href="/" className="css-1lh1pzd">
              <div data-testid="hybrid-logo" className="css-167poo7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/top10-images/top10-logo.20200318063536.20200826085102.20220810134609.20240721131710.20250331125911.svg"
                  className="light-logo css-7mr6p5"
                  data-testid="hybrid-logo-light"
                  alt="Site Logo"
                  loading="lazy"
                />
              </div>
            </a>
          </div>
          <div data-testid="nav-bar-right-side" className="css-1jw7vo5">
            <input type="checkbox" id="hamburger-menu" data-testid="nav-bar-hamburger-checkbox" className="css-1hlbggb" />
            <label htmlFor="hamburger-menu" data-testid="nav-bar-hamburger-label" className="css-mqlevd">
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hamburger-menu css-14zb0el">
                <path fillRule="evenodd" clipRule="evenodd" d="M1 19.5A1.5 1.5 0 002.5 21h19a1.5 1.5 0 000-3h-19A1.5 1.5 0 001 19.5zM1 12a1.5 1.5 0 001.5 1.5h19a1.5 1.5 0 000-3h-19A1.5 1.5 0 001 12zm1.5-9a1.5 1.5 0 100 3h19a1.5 1.5 0 000-3h-19z" fill="currentColor"></path>
              </svg>
            </label>
            <label htmlFor="hamburger-menu" className="backdrop css-1twskg0" data-testid="nav-bar-backdrop"></label>
            <ul className="nav-bar-link-list css-q8f278" data-testid="nav-bar-link-list">
              <label htmlFor="hamburger-menu" data-testid="nav-bar-exit-label-button" className="css-5s1gij">
                <svg width="1em" height="1em" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="css-vd4kw7">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 1.2L10.8 0 6 4.8 1.2 0 0 1.2 4.8 6 0 10.8 1.2 12 6 7.2l4.8 4.8 1.2-1.2L7.2 6 12 1.2z"></path>
                </svg>
              </label>
              <li className="css-18ojb17">
                <a className="css-1u50saz" href="/compare">Compare</a>
              </li>
              <li className="css-18ojb17">
                <a className="css-1u50saz" href="/reviews">Reviews</a>
              </li>
              <li className="css-18ojb17">
                <a className="css-1u50saz" href="/guides">Guides</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Category Header Section */}
      <section className="charticle__header">
        {/* Breadcrumb */}
        <ul className="breadcrumb">
          {breadcrumb.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.label}</a>
              {index < breadcrumb.length - 1 && <span className="separator">/</span>}
            </li>
          ))}
        </ul>

        {/* Title */}
        <h1 className="charticle__article__title">{title}</h1>

        {/* Author Info */}
        <div className="by-author">
          <div className="by-author__image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={author.image} alt={author.name} />
          </div>
          <div className="by-author__author-metadata">
            <div className="by-author__by">
              <span>By</span>
              <a className="by-author__author-name" href="#">{author.name}</a>
            </div>
            {author.credentials && (
              <div className="by-author__author-credentials">{author.credentials}</div>
            )}
          </div>
          <div data-testid="last-updated" className="by-author__pubdate css-1eneqdx">
            <span className="css-1nuluvx">Last Updated:</span>
            <span className="css-66vicj">{lastUpdated}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="placeholder"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img" src={heroImage} alt={title} title="" />
      </section>
    </>
  );
}
