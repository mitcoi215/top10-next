'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';

interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  exploreHref?: string;
}

interface Article {
  id: string;
  slug: string;
  title: string;
  featuredImage?: string;
  articleType: string;
  author?: {
    name: string;
  };
  category?: {
    slug: string;
    name: string;
  };
  updatedAt: string;
}

interface TrendingArticle {
  title: string;
  href: string;
  image: string;
  author: string;
  date: string;
  isReview?: boolean;
}

interface TrendingItem {
  rank: number;
  title: string;
  href: string;
  image: string;
  description: string;
  date: string;
  articles: TrendingArticle[];
}

export default function TrendingAdminPage() {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [originalItems, setOriginalItems] = useState<TrendingItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [articleSearch, setArticleSearch] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check for unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(trendingItems) !== JSON.stringify(originalItems);
  }, [trendingItems, originalItems]);

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes, articlesRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/articles?limit=500'),
      ]);

      const settings = await settingsRes.json();
      const cats = await categoriesRes.json();
      const arts = await articlesRes.json();

      const items = settings.trendingItems || [];
      setTrendingItems(items);
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      setCategories(Array.isArray(cats) ? cats : []);
      setArticles(arts.articles || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setNotification({ type: 'error', message: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trendingItems }),
      });

      if (res.ok) {
        setOriginalItems(JSON.parse(JSON.stringify(trendingItems)));
        setNotification({ type: 'success', message: 'Saved successfully!' });
      } else {
        const error = await res.json();
        setNotification({ type: 'error', message: error.error || 'Failed to save' });
      }
    } catch (error) {
      console.error('Save failed:', error);
      setNotification({ type: 'error', message: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const addTrendingItem = () => {
    const newRank = trendingItems.length + 1;
    setTrendingItems([
      ...trendingItems,
      {
        rank: newRank,
        title: '',
        href: '',
        image: '',
        description: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        articles: [],
      },
    ]);
    setExpandedItem(newRank);
  };

  const removeTrendingItem = (rank: number) => {
    if (!confirm('Are you sure you want to remove this item?')) return;
    const updated = trendingItems
      .filter((item) => item.rank !== rank)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
    setTrendingItems(updated);
  };

  const updateTrendingItem = (rank: number, field: keyof TrendingItem, value: any) => {
    setTrendingItems(
      trendingItems.map((item) =>
        item.rank === rank ? { ...item, [field]: value } : item
      )
    );
  };

  const selectCategoryForItem = (rank: number, categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    setTrendingItems(
      trendingItems.map((item) =>
        item.rank === rank
          ? {
              ...item,
              title: category.name,
              href: category.exploreHref || `/${category.slug}`,
            }
          : item
      )
    );
  };

  const addArticleToItem = (rank: number, articleId: string) => {
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;

    const item = trendingItems.find((i) => i.rank === rank);
    if (!item) return;

    if (item.articles.some((a) => a.href.includes(article.slug))) {
      setNotification({ type: 'error', message: 'Article already added' });
      return;
    }

    const categorySlug = article.category?.slug || '';
    const isReview = article.articleType === 'review' || article.title.toLowerCase().includes('review');

    const newArticle: TrendingArticle = {
      title: article.title,
      href: categorySlug ? `/${categorySlug}/${isReview ? 'reviews/' : ''}${article.slug}` : `/${article.slug}`,
      image: article.featuredImage || '',
      author: article.author?.name || '',
      date: new Date(article.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isReview,
    };

    setTrendingItems(
      trendingItems.map((i) =>
        i.rank === rank ? { ...i, articles: [...i.articles, newArticle] } : i
      )
    );
    setArticleSearch('');
  };

  const removeArticleFromItem = (rank: number, articleIndex: number) => {
    setTrendingItems(
      trendingItems.map((item) =>
        item.rank === rank
          ? { ...item, articles: item.articles.filter((_, idx) => idx !== articleIndex) }
          : item
      )
    );
  };

  const moveArticle = (rank: number, articleIndex: number, direction: 'up' | 'down') => {
    const item = trendingItems.find((i) => i.rank === rank);
    if (!item) return;

    const newArticles = [...item.articles];
    const newIndex = direction === 'up' ? articleIndex - 1 : articleIndex + 1;

    if (newIndex < 0 || newIndex >= newArticles.length) return;

    [newArticles[articleIndex], newArticles[newIndex]] = [newArticles[newIndex], newArticles[articleIndex]];
    updateTrendingItem(rank, 'articles', newArticles);
  };

  const uploadImage = async (rank: number, file: File) => {
    const uploadKey = `item-${rank}`;
    setUploadingImage(uploadKey);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder + '/trending');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (res.ok) {
        const data = await res.json();
        updateTrendingItem(rank, 'image', data.secure_url);
        setNotification({ type: 'success', message: 'Image uploaded!' });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification({ type: 'error', message: 'Upload failed' });
    } finally {
      setUploadingImage(null);
    }
  };

  const moveItem = (rank: number, direction: 'up' | 'down') => {
    const index = trendingItems.findIndex((i) => i.rank === rank);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === trendingItems.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newItems = [...trendingItems];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, moved);

    setTrendingItems(newItems.map((item, idx) => ({ ...item, rank: idx + 1 })));
  };

  // Filter articles for search
  const filteredArticles = useMemo(() => {
    if (!articleSearch.trim()) return articles.slice(0, 50);
    const search = articleSearch.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.category?.name?.toLowerCase().includes(search)
    ).slice(0, 50);
  }, [articles, articleSearch]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 400px;
            color: #6b7280;
            gap: 12px;
          }
          .loading-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e5e7eb;
            border-top-color: #FE4A64;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="trending-admin">
      {/* Notification Toast */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="breadcrumb">
        <Link href="/admin">Bảng điều khiển</Link>
        <span>/</span>
        <span>Xu hướng</span>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Phần "Top 10 Trending List" trên trang chủ - danh sách các danh mục/sản phẩm đang hot kèm bài viết liên quan
      </div>

      <div className="page-header">
        <div>
          <h1>
            Danh mục xu hướng
            {hasChanges && <span className="unsaved-badge">Chưa lưu</span>}
          </h1>
          <p className="subtitle">Quản lý danh sách Top 10 Trending trên trang chủ ({trendingItems.length} mục)</p>
        </div>
        <div className="header-actions">
          <button onClick={addTrendingItem} className="btn-add">
            + Thêm mục
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="btn-save"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>

      <div className="items-list">
        {trendingItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📈</div>
            <h3>Chưa có mục xu hướng nào</h3>
            <p>Thêm danh mục để hiển thị trong phần trending trên trang chủ.</p>
            <button onClick={addTrendingItem} className="btn-add">
              + Thêm mục đầu tiên
            </button>
          </div>
        ) : (
          trendingItems.map((item) => (
            <div key={item.rank} className={`trending-card ${expandedItem === item.rank ? 'expanded' : ''}`}>
              <div
                className="card-header"
                onClick={() => setExpandedItem(expandedItem === item.rank ? null : item.rank)}
              >
                <div className="rank-controls">
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(item.rank, 'up'); }}
                    disabled={item.rank === 1}
                    className="btn-move"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <span className="rank">#{item.rank}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); moveItem(item.rank, 'down'); }}
                    disabled={item.rank === trendingItems.length}
                    className="btn-move"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                {item.image && (
                  <div className="card-thumbnail">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}

                <div className="card-title">
                  <strong>{item.title || 'Chưa đặt tên'}</strong>
                  <span className="card-description">{item.description ? item.description.substring(0, 60) + '...' : 'Chưa có mô tả'}</span>
                </div>

                <div className="card-stats">
                  <span className="article-count">{item.articles.length} bài viết</span>
                  <span className="date-info">{item.date}</span>
                </div>

                <div className="card-actions">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTrendingItem(item.rank); }}
                    className="btn-delete"
                    title="Delete item"
                  >
                    ✕
                  </button>
                  <span className="chevron">{expandedItem === item.rank ? '▼' : '▶'}</span>
                </div>
              </div>

              {expandedItem === item.rank && (
                <div className="card-body">
                  <div className="form-grid">
                    <div className="form-section">
                      <h3>Danh mục & Thông tin cơ bản</h3>

                      <div className="form-group">
                        <label>Chọn danh mục</label>
                        <select
                          value={categories.find((c) => c.name === item.title)?.id || ''}
                          onChange={(e) => selectCategoryForItem(item.rank, e.target.value)}
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon && !cat.icon.startsWith('/') ? cat.icon + ' ' : ''}{cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Tiêu đề</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateTrendingItem(item.rank, 'title', e.target.value)}
                            placeholder="VD: Hosting"
                          />
                        </div>
                        <div className="form-group">
                          <label>Ngày</label>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => updateTrendingItem(item.rank, 'date', e.target.value)}
                            placeholder="Th10, 2024"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Đường dẫn (href)</label>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => updateTrendingItem(item.rank, 'href', e.target.value)}
                          placeholder="/hosting"
                        />
                      </div>

                      <div className="form-group">
                        <label>Mô tả (Tiêu đề chính)</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateTrendingItem(item.rank, 'description', e.target.value)}
                          placeholder="Top 10 Best Web Hosting Providers & Companies in 2026"
                        />
                      </div>

                      <div className="form-group">
                        <label>Ảnh bìa</label>
                        <div className="image-upload">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="preview-image" />
                          ) : (
                            <div className="no-preview">Chưa có ảnh</div>
                          )}
                          <div className="upload-controls">
                            <input
                              type="text"
                              value={item.image}
                              onChange={(e) => updateTrendingItem(item.rank, 'image', e.target.value)}
                              placeholder="URL ảnh hoặc tải lên"
                            />
                            <label className="btn-upload">
                              {uploadingImage === `item-${item.rank}` ? 'Đang tải...' : 'Tải lên'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) uploadImage(item.rank, file);
                                }}
                                hidden
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <div className="section-header">
                        <h3>Bài viết liên quan ({item.articles.length})</h3>
                      </div>

                      <div className="add-article">
                        <input
                          type="text"
                          placeholder="Tìm kiếm bài viết..."
                          value={articleSearch}
                          onChange={(e) => setArticleSearch(e.target.value)}
                          className="article-search"
                        />
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addArticleToItem(item.rank, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        >
                          <option value="">-- Thêm bài viết --</option>
                          {filteredArticles.map((art) => (
                            <option key={art.id} value={art.id}>
                              {art.category?.name ? `[${art.category.name}] ` : ''}{art.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="articles-list">
                        {item.articles.length === 0 ? (
                          <div className="no-articles">
                            Chưa có bài viết nào. Chọn bài viết từ dropdown phía trên.
                          </div>
                        ) : (
                          item.articles.map((article, idx) => (
                            <div key={idx} className="article-item">
                              <div className="article-order">
                                <button
                                  onClick={() => moveArticle(item.rank, idx, 'up')}
                                  disabled={idx === 0}
                                  className="btn-move-article"
                                  title="Move up"
                                >
                                  ▲
                                </button>
                                <span className="order-num">{idx + 1}</span>
                                <button
                                  onClick={() => moveArticle(item.rank, idx, 'down')}
                                  disabled={idx === item.articles.length - 1}
                                  className="btn-move-article"
                                  title="Move down"
                                >
                                  ▼
                                </button>
                              </div>
                              <div className="article-image">
                                {article.image ? (
                                  <img src={article.image} alt={article.title} />
                                ) : (
                                  <div className="no-image">Không có ảnh</div>
                                )}
                              </div>
                              <div className="article-info">
                                <div className="article-title">{article.title}</div>
                                <div className="article-meta">
                                  {article.author && <span className="author">{article.author}</span>}
                                  <span className="date">{article.date}</span>
                                  {article.isReview && <span className="review-badge">Review</span>}
                                </div>
                                <input
                                  type="text"
                                  value={article.href}
                                  onChange={(e) => {
                                    const newArticles = [...item.articles];
                                    newArticles[idx] = { ...newArticles[idx], href: e.target.value };
                                    updateTrendingItem(item.rank, 'articles', newArticles);
                                  }}
                                  className="href-input"
                                  placeholder="Đường dẫn bài viết"
                                />
                              </div>
                              <button
                                onClick={() => removeArticleFromItem(item.rank, idx)}
                                className="btn-remove"
                                title="Remove article"
                              >
                                ×
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .trending-admin {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px;
          position: relative;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        .notification.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .notification.error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .info-box {
          padding: 12px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 16px;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #6b7280;
        }

        .breadcrumb a {
          color: #FE4A64;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .unsaved-badge {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          background: #fef3c7;
          color: #92400e;
          border-radius: 12px;
        }

        .subtitle {
          color: #6b7280;
          margin: 0;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn-add {
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-add:hover {
          background: #059669;
        }

        .btn-save {
          padding: 10px 20px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-save:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          color: #6b7280;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .trending-card {
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: box-shadow 0.2s;
        }

        .trending-card.expanded {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .card-header {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          gap: 16px;
        }

        .card-header:hover {
          background: #f9fafb;
        }

        .rank-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .rank {
          font-weight: 700;
          color: #FE4A64;
          font-size: 16px;
        }

        .btn-move {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 10px;
          padding: 2px 4px;
        }

        .btn-move:hover:not(:disabled) {
          color: #374151;
        }

        .btn-move:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .card-thumbnail {
          width: 60px;
          height: 45px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .card-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-title {
          flex: 1;
          min-width: 0;
        }

        .card-title strong {
          font-size: 16px;
          display: block;
          margin-bottom: 2px;
        }

        .card-description {
          font-size: 12px;
          color: #6b7280;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }

        .article-count {
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .date-info {
          font-size: 11px;
          color: #9ca3af;
        }

        .card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-delete {
          width: 28px;
          height: 28px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-delete:hover {
          background: #fecaca;
        }

        .chevron {
          color: #9ca3af;
          font-size: 12px;
        }

        .card-body {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          background: #fafafa;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .form-section {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .form-section h3 {
          font-size: 15px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #1a1a1a;
          padding-bottom: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h3 {
          margin-bottom: 16px;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .image-upload {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .preview-image {
          width: 140px;
          height: 90px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .no-preview {
          width: 140px;
          height: 90px;
          background: #f3f4f6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: #9ca3af;
        }

        .upload-controls {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .upload-controls input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .btn-upload {
          padding: 10px 16px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          text-align: center;
          font-weight: 500;
        }

        .btn-upload:hover {
          background: #e5e7eb;
        }

        .add-article {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }

        .article-search {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .add-article select {
          flex: 2;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .articles-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .no-articles {
          padding: 24px;
          text-align: center;
          color: #9ca3af;
          font-size: 13px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .article-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .article-order {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .order-num {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
        }

        .btn-move-article {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 8px;
          padding: 2px;
        }

        .btn-move-article:hover:not(:disabled) {
          color: #374151;
        }

        .btn-move-article:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .article-image {
          width: 70px;
          height: 50px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .article-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .no-image {
          width: 100%;
          height: 100%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #9ca3af;
        }

        .article-info {
          flex: 1;
          min-width: 0;
        }

        .article-title {
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .article-meta {
          display: flex;
          gap: 8px;
          font-size: 11px;
          color: #6b7280;
          margin-bottom: 6px;
        }

        .review-badge {
          background: #dbeafe;
          color: #1d4ed8;
          padding: 1px 6px;
          border-radius: 3px;
        }

        .href-input {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          font-size: 12px;
        }

        .btn-remove {
          width: 26px;
          height: 26px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          flex-shrink: 0;
          align-self: center;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        @media (max-width: 1024px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 16px;
          }

          .card-header {
            flex-wrap: wrap;
          }

          .card-thumbnail {
            display: none;
          }

          .add-article {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
