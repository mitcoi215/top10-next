'use client';

import '@/styles/category.css';

interface Article {
  title: string;
  image: string;
  url: string;
  category?: string;
}

interface RelatedArticlesProps {
  title?: string;
  articles: Article[];
}

export default function RelatedArticles({ title = 'Related Articles', articles }: RelatedArticlesProps) {
  return (
    <section className="charticle__bottom">
      <h2 className="charticle__body--bottom-title">{title}</h2>
      <div className="related-articles-grid">
        {articles.map((article, index) => (
          <a key={index} href={article.url} className="card">
            <div className="card-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.image} alt={article.title} loading="lazy" />
            </div>
            <div className="card-content">
              {article.category && <span className="card-category">{article.category}</span>}
              <h3 className="card-title">{article.title}</h3>
            </div>
          </a>
        ))}
      </div>

      <style jsx>{`
        .related-articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }
        .card {
          text-decoration: none;
          color: inherit;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        .card-image {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }
        .card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-content {
          padding: 16px;
        }
        .card-category {
          font-size: 12px;
          color: #FF4A64;
          text-transform: uppercase;
          font-weight: 600;
        }
        .card-title {
          margin: 8px 0 0;
          font-size: 16px;
          font-weight: 600;
          line-height: 1.4;
          color: #383838;
        }
      `}</style>
    </section>
  );
}
