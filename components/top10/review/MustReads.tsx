'use client';

import Link from 'next/link';

interface MustReadsArticle {
  title: string;
  image: string;
  href: string;
}

interface MustReadsProps {
  title?: string;
  articles: MustReadsArticle[];
  seeAllHref?: string;
}

export default function MustReads({
  title = 'Must Reads',
  articles,
  seeAllHref = '/dating/top-reads',
}: MustReadsProps) {
  return (
    <div className="related-articles must-reads-widget" data-testid="related-articles" data-articles-type="article">
      <div className="must-reads__title">{title}</div>
      <div className="must-reads__list">
        {articles.map((article, index) => (
          <Link
            key={index}
            href={article.href}
            data-testid="link"
            className="related-articles__item must-reads__item"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.title}
              height="76"
              width="76"
              loading="lazy"
              className="must-reads__item__image"
            />
            <div className="must-reads__item__content">
              <div className="must-reads__item__title">{article.title}</div>
              <div className="related-articles__item__link must-reads__item__link">Read more</div>
            </div>
          </Link>
        ))}
      </div>
      <Link href={seeAllHref} data-testid="link" className="related-articles__read-all must-reads__see-all">
        See all articles
      </Link>
    </div>
  );
}
