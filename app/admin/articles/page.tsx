'use client';

import { useState, useEffect, useMemo } from 'react';
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
  createdAt?: string;
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  charticle: 'Charticle',
  blog: 'Blog',
  guide: 'Hướng dẫn',
};

type SortField = 'title' | 'updatedAt' | 'status' | 'articleType';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

const ITEMS_PER_PAGE = 12;

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterType, setFilterType] = useState<'all' | 'charticle' | 'blog' | 'guide'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Get unique categories from articles
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string; icon: string }>();
    articles.forEach(a => {
      if (a.category) {
        cats.set(a.category.id, a.category);
      }
    });
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [articles]);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType, filterCategory, sortField, sortDirection]);

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
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const updateArticleStatus = async (id: string, status: 'draft' | 'published') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setArticles(articles.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedArticles.map(a => a.id)));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} article(s)?`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setArticles(articles.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete articles:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (status: 'draft' | 'published') => {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/articles/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          })
        )
      );
      setArticles(articles.map(a => selectedIds.has(a.id) ? { ...a, status } : a));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update articles:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedArticles = useMemo(() => {
    let result = articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesType = filterType === 'all' || a.articleType === filterType;
      const matchesCategory = filterCategory === 'all' || a.category?.id === filterCategory;
      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'articleType':
          comparison = a.articleType.localeCompare(b.articleType);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [articles, searchTerm, filterStatus, filterType, filterCategory, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredAndSortedArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="articles-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Bài viết</h1>
          <span className="count">{filteredAndSortedArticles.length} / {articles.length}</span>
        </div>
        <Link href="/admin/articles/new" className="btn-primary">
          + Thêm bài viết
        </Link>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Trang danh mục (phần bài viết), trang Trending, sidebar sản phẩm, blog listing
      </div>

      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="filter-select"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="published">Đã xuất bản</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="filter-select"
          >
            <option value="all">Tất cả loại</option>
            <option value="charticle">Charticle</option>
            <option value="blog">Blog</option>
            <option value="guide">Hướng dẫn</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.icon && !cat.icon.startsWith('/') ? cat.icon + ' ' : ''}{cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="view-actions">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Xem dạng bảng"
            >
              ☰
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Xem dạng lưới"
            >
              ⊞
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bulk-actions-bar">
          <span className="selected-count">Đã chọn {selectedIds.size}</span>
          <div className="bulk-buttons">
            <button
              onClick={() => handleBulkStatusChange('published')}
              disabled={bulkActionLoading}
              className="bulk-btn publish"
            >
              Xuất bản
            </button>
            <button
              onClick={() => handleBulkStatusChange('draft')}
              disabled={bulkActionLoading}
              className="bulk-btn unpublish"
            >
              Gỡ xuất bản
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="bulk-btn delete"
            >
              Xóa
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="bulk-btn cancel"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Đang tải bài viết...</div>
      ) : filteredAndSortedArticles.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy bài viết nào.</p>
          <Link href="/admin/articles/new" className="btn-primary">
            Tạo bài viết đầu tiên
          </Link>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="table-container">
          <table className="articles-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedArticles.length && paginatedArticles.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="sortable" onClick={() => handleSort('title')}>
                  Tiêu đề <SortIcon field="title" />
                </th>
                <th className="sortable" onClick={() => handleSort('articleType')}>
                  Loại <SortIcon field="articleType" />
                </th>
                <th>Danh mục</th>
                <th className="sortable" onClick={() => handleSort('status')}>
                  Trạng thái <SortIcon field="status" />
                </th>
                <th>Tác giả</th>
                <th className="sortable" onClick={() => handleSort('updatedAt')}>
                  Cập nhật <SortIcon field="updatedAt" />
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedArticles.map((article) => (
                <tr key={article.id} className={selectedIds.has(article.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(article.id)}
                      onChange={() => handleSelect(article.id)}
                    />
                  </td>
                  <td className="title-cell">
                    <Link href={`/admin/articles/${article.id}`} className="article-link">
                      {article.featuredImage && (
                        <img src={article.featuredImage} alt="" className="thumbnail" />
                      )}
                      <span className="title-text">{article.title}</span>
                    </Link>
                  </td>
                  <td>
                    <span className={`type-badge ${article.articleType}`}>
                      {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
                    </span>
                  </td>
                  <td>
                    {article.category && (
                      <span className="category-badge">
                        {article.category.icon && !article.category.icon.startsWith('/') ? article.category.icon + ' ' : ''}
                        {article.category.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${article.status}`}
                      onClick={() => updateArticleStatus(article.id, article.status === 'published' ? 'draft' : 'published')}
                      title={`Click to ${article.status === 'published' ? 'unpublish' : 'publish'}`}
                    >
                      {article.status}
                    </button>
                  </td>
                  <td>
                    {article.author && (
                      <span className="author-name">{article.author.name}</span>
                    )}
                  </td>
                  <td className="date-cell">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/articles/${article.id}`} className="action-btn edit" title="Edit">
                      ✎
                    </Link>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="action-btn delete"
                      title="Delete"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="articles-grid">
          {paginatedArticles.map((article) => (
            <div key={article.id} className={`article-card ${selectedIds.has(article.id) ? 'selected' : ''}`}>
              <div className="card-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.has(article.id)}
                  onChange={() => handleSelect(article.id)}
                />
              </div>
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
                  <button
                    className={`status-toggle ${article.status}`}
                    onClick={() => updateArticleStatus(article.id, article.status === 'published' ? 'draft' : 'published')}
                  >
                    {article.status}
                  </button>
                </div>
                <Link href={`/admin/articles/${article.id}`} className="article-title">
                  {article.title}
                </Link>
                <div className="article-info">
                  {article.category && (
                    <span className="category">
                      {article.category.icon && !article.category.icon.startsWith('/') ? article.category.icon : ''} {article.category.name}
                    </span>
                  )}
                  {article.author && (
                    <span className="author">bởi {article.author.name}</span>
                  )}
                </div>
                <div className="article-date">
                  Cập nhật {new Date(article.updatedAt).toLocaleDateString()}
                </div>
                <div className="article-actions">
                  <Link href={`/admin/articles/${article.id}`} className="btn-edit">
                    Sửa
                  </Link>
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="btn-delete"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            ««
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span key={`ellipsis-${page}`} className="ellipsis">...</span>
                  )}
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </>
              ))}
          </div>

          <button
            className="page-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          <button
            className="page-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »»
          </button>

          <span className="page-info">
            Trang {currentPage} / {totalPages}
          </span>
        </div>
      )}

      <style jsx>{`
        .articles-page {
          max-width: 1400px;
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

        .info-box {
          padding: 12px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 16px;
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

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          flex: 1;
        }

        .search-input {
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
          min-width: 140px;
        }

        .view-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .view-toggle {
          display: flex;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
        }

        .view-btn {
          padding: 8px 12px;
          background: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }

        .view-btn.active {
          background: #f3f4f6;
        }

        .view-btn:hover {
          background: #e5e7eb;
        }

        /* Bulk Actions Bar */
        .bulk-actions-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .selected-count {
          font-weight: 600;
          color: #0369a1;
        }

        .bulk-buttons {
          display: flex;
          gap: 8px;
        }

        .bulk-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .bulk-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-btn.publish {
          background: #d1fae5;
          color: #065f46;
        }

        .bulk-btn.unpublish {
          background: #fef3c7;
          color: #92400e;
        }

        .bulk-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .bulk-btn.cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .loading, .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state p {
          margin-bottom: 16px;
        }

        /* Table View */
        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .articles-table {
          width: 100%;
          border-collapse: collapse;
        }

        .articles-table th {
          text-align: left;
          padding: 12px 16px;
          background: #f9fafb;
          font-weight: 600;
          font-size: 13px;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }

        .articles-table th.sortable {
          cursor: pointer;
          user-select: none;
        }

        .articles-table th.sortable:hover {
          background: #f3f4f6;
        }

        .sort-icon {
          margin-left: 4px;
          color: #d1d5db;
        }

        .sort-icon.active {
          color: #FE4A64;
        }

        .articles-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .articles-table tr:hover {
          background: #f9fafb;
        }

        .articles-table tr.selected {
          background: #eff6ff;
        }

        .checkbox-col {
          width: 40px;
        }

        .title-cell {
          max-width: 350px;
        }

        .article-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #1a1a1a;
        }

        .article-link:hover .title-text {
          color: #FE4A64;
        }

        .thumbnail {
          width: 48px;
          height: 36px;
          object-fit: cover;
          border-radius: 4px;
        }

        .title-text {
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .type-badge {
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

        .category-badge {
          font-size: 13px;
          color: #6b7280;
        }

        .status-toggle {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          border: none;
          cursor: pointer;
          transition: transform 0.1s;
        }

        .status-toggle:hover {
          transform: scale(1.05);
        }

        .status-toggle.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-toggle.published {
          background: #d1fae5;
          color: #065f46;
        }

        .author-name {
          font-size: 13px;
          color: #6b7280;
        }

        .date-cell {
          color: #9ca3af;
          font-size: 13px;
          white-space: nowrap;
        }

        .actions-cell {
          white-space: nowrap;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 4px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.edit {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn.edit:hover {
          background: #e5e7eb;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fecaca;
        }

        /* Grid View */
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .article-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: box-shadow 0.2s;
          position: relative;
        }

        .article-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .article-card.selected {
          box-shadow: 0 0 0 2px #3b82f6;
        }

        .card-checkbox {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }

        .card-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
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

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          flex-wrap: wrap;
        }

        .page-numbers {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .page-btn {
          min-width: 36px;
          height: 36px;
          padding: 0 8px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .page-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-btn.active {
          background: #FE4A64;
          color: white;
          border-color: #FE4A64;
        }

        .ellipsis {
          padding: 0 4px;
          color: #9ca3af;
        }

        .page-info {
          margin-left: 16px;
          color: #6b7280;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .filters {
            flex-direction: column;
          }

          .search-input, .filter-select {
            max-width: none;
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .table-container {
            font-size: 13px;
          }

          .articles-table th,
          .articles-table td {
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
