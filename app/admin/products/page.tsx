'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  rank: number;
  category?: {
    name: string;
  };
  updatedAt: string;
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

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
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Products</h1>
          <span className="count">{products.length} total</span>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          + New Product
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
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
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <Link href="/admin/products/new" className="btn-primary">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="rank-cell">#{product.rank}</td>
                  <td className="name-cell">
                    <Link href={`/admin/products/${product.id}`}>
                      {product.name}
                    </Link>
                    <span className="slug">/{product.slug}</span>
                  </td>
                  <td>{product.category?.name || '-'}</td>
                  <td>
                    <span className={`status-badge ${product.status}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/products/${product.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .products-page {
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
        }

        .search-input {
          flex: 1;
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

        .products-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px 16px;
          background: #f9fafb;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover {
          background: #f9fafb;
        }

        .rank-cell {
          font-weight: 600;
          color: #FE4A64;
        }

        .name-cell a {
          font-weight: 600;
          color: #1a1a1a;
          text-decoration: none;
        }

        .name-cell a:hover {
          color: #FE4A64;
        }

        .slug {
          display: block;
          font-size: 12px;
          color: #9ca3af;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status-badge.draft {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.published {
          background: #d1fae5;
          color: #065f46;
        }

        .date-cell {
          color: #6b7280;
        }

        .actions-cell {
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
          .products-table {
            overflow-x: auto;
          }

          table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
}
