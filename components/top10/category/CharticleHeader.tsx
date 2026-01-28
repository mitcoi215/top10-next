import Link from 'next/link';

interface CharticleHeaderProps {
  title: string;
  authorName: string;
  authorImage: string;
  authorSlug: string;
  lastUpdated: string;
  heroImage: string;
  heroImageAlt: string;
}

export default function CharticleHeader({
  title,
  authorName,
  authorImage,
  authorSlug,
  lastUpdated,
  heroImage,
  heroImageAlt,
}: CharticleHeaderProps) {
  return (
    <section className="charticle__header">
      <div className="container">
        <div className="info">
          <h1 className="title" title="">{title}</h1>
          <div className="details">
            <div className="by-author">
              <div className="by-author__author-credentials">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  width="35"
                  height="35"
                  className="by-author__image"
                  src={authorImage}
                  alt={`${authorName} Author image`}
                  title={`${authorName} Author image`}
                />
                <div className="by-author__author-metadata">
                  <div className="by-author__author-name">
                    <Link
                      href={`/authors/${authorSlug}`}
                      data-role="charticle-author-top"
                      data-role-id="link"
                      className="by-author__author"
                    >
                      {authorName}
                    </Link>
                  </div>
                  <div data-testid="last-updated" className="by-author__pubdate css-1eneqdx">
                    <span className="css-1nuluvx">Last Updated:</span>
                    <span className="css-66vicj"> {lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
            <ul className="social-share">
              <li className="btn-facebook social-share__button" data-name="social-share-buttons" data-role-id="facebookShare">
                <svg className="social-share__icon">
                  <use xlinkHref="#facebook" />
                </svg>
              </li>
              <li className="btn-twitter social-share__button" data-name="social-share-buttons" data-role-id="twitterShare">
                <svg className="social-share__icon">
                  <use xlinkHref="#twitter" />
                </svg>
              </li>
            </ul>
          </div>
        </div>
        <div className="placeholder"></div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img" src={heroImage} alt={heroImageAlt} title="" />
      </div>
    </section>
  );
}
