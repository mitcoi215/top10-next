'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  rank: number;
  logo?: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  updatedAt: string;
}

type SortField = 'name' | 'rank' | 'status' | 'updatedAt' | 'category';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 20;

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string; icon?: string }>();
    products.forEach(p => {
      if (p.category) {
        cats.set(p.category.id, p.category);
      }
    });
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const updateProductStatus = async (id: string, status: 'draft' | 'published') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map(p => p.id)));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} product(s)?`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setProducts(products.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete products:', error);
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
          fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          })
        )
      );
      setProducts(products.map(p => selectedIds.has(p.id) ? { ...p, status } : p));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update products:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || p.category?.id === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rank':
          comparison = (a.rank || 999) - (b.rank || 999);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'category':
          comparison = (a.category?.name || '').localeCompare(b.category?.name || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, searchTerm, filterStatus, filterCategory, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
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
    <div className="products-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Sản phẩm</h1>
          <span className="count">{filteredAndSortedProducts.length} / {products.length}</span>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + Thêm sản phẩm
        </Link>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Trang danh mục (Top 10 list), trang so sánh sản phẩm, trang review chi tiết, sidebar bài viết
      </div>

      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
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
        <div className="loading">Đang tải sản phẩm...</div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="empty-state">
          <p>Không tìm thấy sản phẩm nào.</p>
          <Link href="/admin/products/new" className="btn-primary">
            Tạo sản phẩm đầu tiên
          </Link>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === paginatedProducts.length && paginatedProducts.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="sortable" onClick={() => handleSort('rank')}>
                  Hạng <SortIcon field="rank" />
                </th>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Tên <SortIcon field="name" />
                </th>
                <th className="sortable" onClick={() => handleSort('category')}>
                  Danh mục <SortIcon field="category" />
                </th>
                <th className="sortable" onClick={() => handleSort('status')}>
                  Trạng thái <SortIcon field="status" />
                </th>
                <th className="sortable" onClick={() => handleSort('updatedAt')}>
                  Cập nhật <SortIcon field="updatedAt" />
                </th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className={selectedIds.has(product.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(product.id)}
                      onChange={() => handleSelect(product.id)}
                    />
                  </td>
                  <td className="rank-cell">#{product.rank}</td>
                  <td className="name-cell">
                    <Link href={`/admin/products/${product.id}`} className="product-link">
                      {product.logo && (
                        <img src={product.logo} alt="" className="product-logo" />
                      )}
                      <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        <span className="slug">/{product.slug}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    {product.category && (
                      <span className="category-badge">
                        {product.category.icon && !product.category.icon.startsWith('/') ? product.category.icon + ' ' : ''}
                        {product.category.name}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`status-toggle ${product.status}`}
                      onClick={() => updateProductStatus(product.id, product.status === 'published' ? 'draft' : 'published')}
                      title={`Click to ${product.status === 'published' ? 'unpublish' : 'publish'}`}
                    >
                      {product.status}
                    </button>
                  </td>
                  <td className="date-cell">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/products/${product.id}`} className="action-btn edit" title="Edit">
                      ✎
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
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
                <Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="ellipsis">...</span>
                  )}
                  <button
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </Fragment>
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
        .products-page {
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

        .products-table {
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

        .rank-cell {
          font-weight: 600;
          color: #FE4A64;
          width: 70px;
        }

        .name-cell {
          max-width: 350px;
        }

        .product-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #1a1a1a;
        }

        .product-link:hover .product-name {
          color: #FE4A64;
        }

        .product-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          border-radius: 4px;
          background: #f3f4f6;
          padding: 4px;
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 600;
        }

        .slug {
          font-size: 12px;
          color: #9ca3af;
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

          .products-table {
            font-size: 13px;
          }

          th, td {
            padding: 8px 12px;
          }

          table {
            min-width: 700px;
          }
        }
      `}</style>
    </div>
  );
}
