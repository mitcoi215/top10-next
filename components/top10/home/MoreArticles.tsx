// Default articles data
const defaultArticles = [
  {
    title: 'Best Places To Buy Gold and Silver Online',
    slug: 'sites-to-buy-gold-and-silver',
    featuredImage: '/top10-images/Places-to-Buy-Gold-and-Silver-Online.jpg',
    category: { slug: 'shopping' },
  },
  {
    title: 'Best Cell Phone Service Providers',
    slug: 'cell-phone-companies',
    featuredImage: '/top10-images/cell-phone-companies.jpg',
    category: { slug: 'cell-phone-companies' },
  },
  {
    title: 'In-Depth Analysis of Shopping Trends',
    slug: 'research-before-purchase-survey',
    featuredImage: '/top10-images/Research-before-making-online-decisions-hero-red1.jpg',
    category: { slug: 'best-lists' },
  },
  {
    title: 'Best Shows on Disney+ to Watch Right Now',
    slug: '10-best-shows-on-disney-to-watch',
    featuredImage: '/top10-images/disney-plus-shows.jpg',
    category: { slug: 'tv-services' },
  },
  {
    title: '10 Reasons Why Younger Guys Like Older Women',
    slug: '10-reasons-why-younger-guys-want-an-older-woman',
    featuredImage: '/top10-images/Mature_Dating.jpg',
    category: { slug: 'dating' },
  },
  {
    title: "Mediterranean Food Choices That Won't Ruin Your Diet",
    slug: 'mediterranean-fast-food-choices-that-wont-ruin-your-diet',
    featuredImage: '/top10-images/mediterranean-food.jpg',
    category: { slug: 'meal-delivery' },
  },
];

interface Article {
  id?: string;
  title: string;
  slug: string;
  featuredImage?: string | null;
  category?: { slug: string } | null;
}

interface MoreArticlesProps {
  articles?: Article[] | null;
}

export default function MoreArticles({ articles }: MoreArticlesProps) {
  const displayArticles = articles && articles.length > 0 ? articles : defaultArticles;

  const getArticleHref = (article: Article) => {
    if (article.category?.slug) {
      return `/${article.category.slug}/${article.slug}`;
    }
    return `/${article.slug}`;
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px',
        boxSizing: 'border-box',
        fontFamily: 'hurmegeometricsans_no3_6, Gilroy, Almarai, Arial, sans-serif',
      }}
    >
      <hr style={{ border: 'none', borderTop: '1px solid #e3e3e2', margin: '40px 0 0' }} />
      <h2
        style={{
          marginTop: '40px',
          marginBottom: '0',
          fontSize: '22px',
          fontWeight: 700,
          color: '#2D2D2D',
        }}
      >
        More from Top10:
      </h2>

      <div
        className="scrolling-wrapper"
        style={{
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          width: '100%',
          maxWidth: '1170px',
          marginTop: '16px',
          paddingBottom: '10px',
          scrollbarWidth: 'thin',
        }}
      >
        {displayArticles.map((article, idx) => (
          <a
            key={article.slug || idx}
            href={getArticleHref(article)}
            className="scrolling-card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-block',
              width: '196.8px',
              marginRight: '10px',
              flex: '0 0 auto',
            }}
          >
            <div
              className="card"
              style={{
                height: '380px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                border: '1px solid #e3e3e2',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff',
              }}
            >
              <div
                className="card-image"
                style={{ height: '170px', width: '100%', overflow: 'hidden' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.featuredImage || '/top10-images/placeholder.jpg'}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                  alt={article.title}
                />
              </div>

              <div
                className="card-content"
                style={{
                  flexGrow: 1,
                  padding: '14px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '1.4',
                    color: '#2D2D2D',
                  }}
                >
                  {article.title}
                </h3>
              </div>

              <div
                className="card-button"
                style={{ padding: '14px 20px', display: 'flex', justifyContent: 'center' }}
              >
                <button
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '6px',
                    border: 'none',
                    backgroundColor: '#ff4a64',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Read Now
                </button>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
