'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  slug: string;
  articleType: string;
  status: string;
  featuredImage?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  updatedAt: string;
  publishedAt?: string;
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  charticle: 'Charticle',
  blog: 'Blog',
  guide: 'Guide',
};

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterType, setFilterType] = useState<'all' | 'charticle' | 'blog' | 'guide'>('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchesType = filterType === 'all' || a.articleType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="articles-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Articles</h1>
          <span className="count">{articles.length} total</span>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          + New Article
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="charticle">Charticle</option>
          <option value="blog">Blog</option>
          <option value="guide">Guide</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-state">
          <p>No articles found.</p>
          <Link href="/admin/articles/new" className="btn-primary">
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map((article) => (
            <div key={article.id} className="article-card">
              {article.featuredImage && (
                <div className="article-image">
                  <img src={article.featuredImage} alt={article.title} />
                </div>
              )}
              <div className="article-content">
                <div className="article-meta">
                  <span className={`type-badge ${article.articleType}`}>
                    {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
                  </span>
                  <span className={`status-badge ${article.status}`}>
                    {article.status}
                  </span>
                </div>
                <Link href={`/admin/articles/${article.id}`} className="article-title">
                  {article.title}
                </Link>
                <div className="article-info">
                  {article.category && (
                    <span className="category">
                      {article.category.icon} {article.category.name}
                    </span>
                  )}
                  {article.author && (
                    <span className="author">by {article.author.name}</span>
                  )}
                </div>
                <div className="article-date">
                  Updated {new Date(article.updatedAt).toLocaleDateString()}
                </div>
                <div className="article-actions">
                  <Link href={`/admin/articles/${article.id}`} className="btn-edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .articles-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-left h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .count {
          font-size: 14px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 16px;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          text-decoration: none;
        }

        .btn-primary:hover {
          background: #e5435b;
        }

        .filters {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          max-width: 300px;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-select {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state p {
          margin-bottom: 16px;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .article-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .article-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .article-image {
          height: 180px;
          overflow: hidden;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-content {
          padding: 16px;
        }

        .article-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .type-badge, .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .type-badge.charticle {
          background: #dbeafe;
          color: #1e40af;
        }

        .type-badge.blog {
          background: #fef3c7;
          color: #92400e;
        }

        .type-badge.guide {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.published {
          background: #d1fae5;
          color: #065f46;
        }

        .article-title {
          display: block;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .article-title:hover {
          color: #FE4A64;
        }

        .article-info {
          display: flex;
          gap: 12px;
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .article-date {
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 12px;
        }

        .article-actions {
          display: flex;
          gap: 8px;
        }

        .btn-edit, .btn-delete {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
        }

        .btn-edit {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-edit:hover {
          background: #e5e7eb;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
          border: none;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        @media (max-width: 768px) {
          .articles-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
