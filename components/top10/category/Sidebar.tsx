import Link from 'next/link';

interface RelatedArticle {
  title: string;
  href: string;
  image: string;
}

interface SidebarProps {
  peopleCount: string;
  categoryName: string;
  articles: RelatedArticle[];
  seeAllHref: string;
}

export default function Sidebar({ peopleCount, categoryName, articles, seeAllHref }: SidebarProps) {
  return (
    <aside className="charticle__right">
      {/* Site Proof Dynamic */}
      <div className="site-proof-dynamic charticle__site-proof">
        <div className="site-proof-dynamic__text-wrapper">
          <h3 className="site-proof-dynamic__title">{peopleCount} people</h3>
          <p className="site-proof-dynamic__description">shopped for a {categoryName} this month</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="site-proof-dynamic__icon"
          src="/top10-images/RegularNINJA.20230308133145.svg"
          alt=""
          title=""
        />
      </div>

      {/* Related Articles Widget */}
      <div className="" data-name="ninja-related-articles-widget" data-version="2.0.44" data-type="widgets" style={{ width: '100%' }}>
        <div data-testid="related-articles" className="css-1ej1u3r">
          <div className="css-ay73wp">Must Reads</div>
          <div className="css-uh9nop">
            {articles.map((article, index) => (
              <Link
                key={index}
                data-testid="link"
                href={article.href}
                className="related-articles__item css-6k4edl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.image}
                  alt={article.title}
                  height={76}
                  width={76}
                  loading="lazy"
                  className="css-h6pnhp"
                />
                <div className="css-3xzcx7">
                  <div className="css-6ub3mr">{article.title}</div>
                  <div className="css-f4u9ac">Read more</div>
                </div>
              </Link>
            ))}
          </div>
          <Link href={seeAllHref} className="css-1ijsmci" style={{ marginTop: '16px', display: 'inline-block' }}>
            See all articles
          </Link>
        </div>
      </div>
    </aside>
  );
}
