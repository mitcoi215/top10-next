'use client';

import { useState, useEffect } from 'react';
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

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');

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
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = filterFeatured === 'all' ||
                            (filterFeatured === 'featured' && c.featured) ||
                            (filterFeatured === 'not-featured' && !c.featured);
    return matchesSearch && matchesFeatured;
  });

  return (
    <div className="categories-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Categories</h1>
          <span className="count">{categories.length} total</span>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          + New Category
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value as typeof filterFeatured)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="featured">Featured Only</option>
          <option value="not-featured">Not Featured</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found.</p>
          <Link href="/admin/categories/new" className="btn-primary">
            Create your first category
          </Link>
        </div>
      ) : (
        <div className="categories-table">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Category</th>
                <th>Slug</th>
                <th>Products</th>
                <th>Featured</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td className="order-cell">{category.order}</td>
                  <td className="name-cell">
                    <Link href={`/admin/categories/${category.id}`} className="category-link">
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                    </Link>
                  </td>
                  <td className="slug-cell">/{category.slug}</td>
                  <td className="products-cell">
                    {category._count?.products || 0} products
                  </td>
                  <td>
                    {category.featured ? (
                      <span className="featured-badge">Featured</span>
                    ) : (
                      <span className="not-featured">-</span>
                    )}
                  </td>
                  <td className="date-cell">
                    {new Date(category.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <Link href={`/admin/categories/${category.id}`} className="btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteCategory(category.id)}
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
        .categories-page {
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

        .categories-table {
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
          font-size: 24px;
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

        .featured-badge {
          padding: 4px 10px;
          background: #d1fae5;
          color: #065f46;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .not-featured {
          color: #d1d5db;
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
          .categories-table {
            overflow-x: auto;
          }

          table {
            min-width: 700px;
          }
        }
      `}</style>
    </div>
  );
}
