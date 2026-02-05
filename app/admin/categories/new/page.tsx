'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryEditor } from '@/components/admin/category-editor';
import { CategoryFormData, ProductOption, ArticleOption, AuthorOption } from '@/components/admin/category-editor/types';

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
}

export default function NewCategoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, articlesRes, authorsRes, groupsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/articles'),
          fetch('/api/authors'),
          fetch('/api/category-groups'),
        ]);

        const productsData = await productsRes.json();
        const articlesData = await articlesRes.json();
        const authorsData = await authorsRes.json();
        const groupsData = await groupsRes.json();

        // Products API returns array directly
        const productsArray = Array.isArray(productsData) ? productsData : [];
        setProducts(productsArray.map((p: any) => ({
          id: p.id,
          name: p.name,
          rank: p.rank || 0,
          logoUrl: p.logoUrl,
        })));

        // Articles API returns { articles: [...], pagination: {...} }
        const articlesArray = articlesData.articles || (Array.isArray(articlesData) ? articlesData : []);
        setArticles(articlesArray.map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
        })));

        // Authors API returns array directly
        const authorsArray = Array.isArray(authorsData) ? authorsData : [];
        setAuthors(authorsArray.map((a: any) => ({
          id: a.id,
          name: a.name,
          avatar: a.avatar,
          title: a.title,
        })));

        // Category Groups
        setCategoryGroups(Array.isArray(groupsData) ? groupsData : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (data: CategoryFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create category');
    }

    const result = await response.json();
    router.push(`/admin/categories/${result.id}`);
  };

  const handleCancel = () => {
    router.push('/admin/categories');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading editor...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #6b7280;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #FE4A64;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <CategoryEditor
      products={products}
      articles={articles}
      authors={authors}
      categoryGroups={categoryGroups}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
