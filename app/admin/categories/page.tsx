'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  featured: boolean;
  order: number;
  _count?: {
    products: number;
  };
  updatedAt: string;
}

type SortField = 'name' | 'order' | 'products' | 'featured' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also affect associated products.')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(c => c.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured }),
      });
      if (res.ok) {
        setCategories(categories.map(c => c.id === id ? { ...c, featured } : c));
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  // Reorder functions
  const moveCategory = (id: string, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(c => c.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const newOrder = sorted[index - 1].order;
      sorted[index - 1].order = sorted[index].order;
      sorted[index].order = newOrder;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const newOrder = sorted[index + 1].order;
      sorted[index + 1].order = sorted[index].order;
      sorted[index].order = newOrder;
    }

    setCategories(sorted);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    const token = localStorage.getItem('admin_token');

    try {
      // Save all categories with their new order
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      await Promise.all(
        sorted.map((cat, index) =>
          fetch(`/api/categories/${cat.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ order: index + 1 }),
          })
        )
      );

      // Update local state with normalized order values
      setCategories(sorted.map((cat, index) => ({ ...cat, order: index + 1 })));
      setReorderMode(false);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSavingOrder(false);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedCategories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedCategories.map(c => c.id)));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} category(ies)? This will affect associated products.`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/categories/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setCategories(categories.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete categories:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkFeaturedChange = async (featured: boolean) => {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/categories/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ featured }),
          })
        )
      );
      setCategories(categories.map(c => selectedIds.has(c.id) ? { ...c, featured } : c));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update categories:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedCategories = useMemo(() => {
    let result = categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFeatured = filterFeatured === 'all' ||
                              (filterFeatured === 'featured' && c.featured) ||
                              (filterFeatured === 'not-featured' && !c.featured);
      return matchesSearch && matchesFeatured;
    });

    // In reorder mode, always sort by order
    if (reorderMode) {
      return result.sort((a, b) => a.order - b.order);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'order':
          comparison = a.order - b.order;
          break;
        case 'products':
          comparison = (a._count?.products || 0) - (b._count?.products || 0);
          break;
        case 'featured':
          comparison = (a.featured ? 1 : 0) - (b.featured ? 1 : 0);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [categories, searchTerm, filterFeatured, sortField, sortDirection, reorderMode]);

  const handleSort = (field: SortField) => {
    if (reorderMode) return; // Disable sorting in reorder mode
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (reorderMode) return null;
    if (sortField !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon active">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Danh mục</h1>
          <span className="count">{filteredAndSortedCategories.length} / {categories.length}</span>
        </div>
        <div className="header-actions">
          {reorderMode ? (
            <>
              <button
                onClick={saveOrder}
                disabled={savingOrder}
                className="btn-save-order"
              >
                {savingOrder ? 'Đang lưu...' : 'Lưu thứ tự'}
              </button>
              <button
                onClick={() => {
                  fetchCategories();
                  setReorderMode(false);
                }}
                className="btn-cancel"
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setReorderMode(true)}
                className="btn-reorder"
              >
                ↕ Sắp xếp
              </button>
              <Link href="/admin/categories/new" className="btn-primary">
                + Thêm danh mục
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Menu chính của website, Hero section dropdown, trang Explore Categories, breadcrumbs
      </div>

      {!reorderMode && (
        <div className="toolbar">
          <div className="filters">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterFeatured}
              onChange={(e) => setFilterFeatured(e.target.value as typeof filterFeatured)}
              className="filter-select"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="featured">Chỉ nổi bật</option>
              <option value="not-featured">Không nổi bật</option>
            </select>
          </div>
        </div>
      )}

      {reorderMode && (
        <div className="reorder-notice">
          Sử dụng nút mũi tên để sắp xếp lại danh mục. Nhấn "Lưu thứ tự" khi hoàn tất.
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && !reorderMode && (
        <div className="bulk-actions-bar">
          <span className="selected-count">Đã chọn {selectedIds.size}</span>
          <div className="bulk-buttons">
            <button
              onClick={() => handleBulkFeaturedChange(true)}
              disabled={bulkActionLoading}
              className="bulk-btn feature"
            >
              Đánh dấu nổi bật
            </button>
            <button
              onClick={() => handleBulkFeaturedChange(false)}
              disabled={bulkActionLoading}
              className="bulk-btn unfeature"
            >
              Bỏ nổi bật
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
        <div className="loading">Đang tải danh mục...</div>
      ) : filteredAndSortedCategories.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy danh mục nào.</p>
          <Link href="/admin/categories/new" className="btn-primary">
            Tạo danh mục đầu tiên
          </Link>
        </div>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                {!reorderMode && (
                  <th className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filteredAndSortedCategories.length && filteredAndSortedCategories.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {reorderMode && <th className="reorder-col">Di chuyển</th>}
                <th className={!reorderMode ? 'sortable' : ''} onClick={() => handleSort('order')}>
                  Thứ tự {!reorderMode && <SortIcon field="order" />}
                </th>
                <th className={!reorderMode ? 'sortable' : ''} onClick={() => handleSort('name')}>
                  Danh mục {!reorderMode && <SortIcon field="name" />}
                </th>
                <th>Đường dẫn</th>
                <th className={!reorderMode ? 'sortable' : ''} onClick={() => handleSort('products')}>
                  Sản phẩm {!reorderMode && <SortIcon field="products" />}
                </th>
                <th className={!reorderMode ? 'sortable' : ''} onClick={() => handleSort('featured')}>
                  Nổi bật {!reorderMode && <SortIcon field="featured" />}
                </th>
                <th className={!reorderMode ? 'sortable' : ''} onClick={() => handleSort('updatedAt')}>
                  Cập nhật {!reorderMode && <SortIcon field="updatedAt" />}
                </th>
                {!reorderMode && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCategories.map((category, index) => (
                <tr key={category.id} className={selectedIds.has(category.id) ? 'selected' : ''}>
                  {!reorderMode && (
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(category.id)}
                        onChange={() => handleSelect(category.id)}
                      />
                    </td>
                  )}
                  {reorderMode && (
                    <td className="reorder-col">
                      <button
                        className="reorder-btn"
                        onClick={() => moveCategory(category.id, 'up')}
                        disabled={index === 0}
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        className="reorder-btn"
                        onClick={() => moveCategory(category.id, 'down')}
                        disabled={index === filteredAndSortedCategories.length - 1}
                        title="Move down"
                      >
                        ▼
                      </button>
                    </td>
                  )}
                  <td className="order-cell">{category.order}</td>
                  <td className="name-cell">
                    <Link href={`/admin/categories/${category.id}`} className="category-link">
                      <span
                        className="category-icon"
                        style={{ backgroundColor: category.color || '#f3f4f6' }}
                      >
                        {category.icon && !category.icon.startsWith('/') ? category.icon : ''}
                      </span>
                      <span className="category-name">{category.name}</span>
                    </Link>
                  </td>
                  <td className="slug-cell">/{category.slug}</td>
                  <td className="products-cell">
                    <Link href={`/admin/products?category=${category.id}`} className="products-link">
                      {category._count?.products || 0} sản phẩm
                    </Link>
                  </td>
                  <td>
                    <button
                      className={`featured-toggle ${category.featured ? 'active' : ''}`}
                      onClick={() => toggleFeatured(category.id, !category.featured)}
                      title={category.featured ? 'Nhấn để bỏ nổi bật' : 'Nhấn để đánh dấu nổi bật'}
                    >
                      {category.featured ? '★ Nổi bật' : '☆ Không nổi bật'}
                    </button>
                  </td>
                  <td className="date-cell">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  {!reorderMode && (
                    <td className="actions-cell">
                      <Link href={`/admin/categories/${category.id}`} className="action-btn edit" title="Edit">
                        ✎
                      </Link>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .categories-page {
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

        .header-actions {
          display: flex;
          gap: 12px;
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

        .btn-reorder {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-reorder:hover {
          background: #e5e7eb;
        }

        .btn-save-order {
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-save-order:hover:not(:disabled) {
          background: #059669;
        }

        .btn-save-order:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
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

        .reorder-notice {
          padding: 12px 16px;
          background: #fef3c7;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          margin-bottom: 16px;
          color: #92400e;
          font-size: 14px;
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

        .bulk-btn.feature {
          background: #d1fae5;
          color: #065f46;
        }

        .bulk-btn.unfeature {
          background: #f3f4f6;
          color: #374151;
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

        .categories-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px 16px;
          background: #f9fafb;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
          white-space: nowrap;
        }

        th.sortable {
          cursor: pointer;
          user-select: none;
        }

        th.sortable:hover {
          background: #f3f4f6;
        }

        .sort-icon {
          margin-left: 4px;
          color: #d1d5db;
        }

        .sort-icon.active {
          color: #FE4A64;
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover {
          background: #f9fafb;
        }

        tr.selected {
          background: #eff6ff;
        }

        .checkbox-col {
          width: 40px;
        }

        .reorder-col {
          width: 80px;
        }

        .reorder-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 10px;
          margin-right: 4px;
          color: #6b7280;
        }

        .reorder-btn:hover:not(:disabled) {
          background: #f3f4f6;
          color: #374151;
        }

        .reorder-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .order-cell {
          font-weight: 600;
          color: #6b7280;
          width: 60px;
        }

        .name-cell {
          min-width: 200px;
        }

        .category-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .category-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          border-radius: 8px;
        }

        .category-name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .category-link:hover .category-name {
          color: #FE4A64;
        }

        .slug-cell {
          color: #9ca3af;
          font-family: monospace;
          font-size: 13px;
        }

        .products-cell {
          color: #6b7280;
        }

        .products-link {
          color: #6b7280;
          text-decoration: none;
        }

        .products-link:hover {
          color: #FE4A64;
          text-decoration: underline;
        }

        .featured-toggle {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
        }

        .featured-toggle.active {
          background: #d1fae5;
          color: #065f46;
        }

        .featured-toggle:not(.active) {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .featured-toggle:hover {
          transform: scale(1.05);
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

          .categories-table {
            font-size: 13px;
          }

          th, td {
            padding: 8px 12px;
          }

          table {
            min-width: 800px;
          }
        }
      `}</style>
    </div>
  );
}
