'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/article-editor';
import { ArticleFormData, CategoryOption, AuthorOption, ProductOption } from '@/components/admin/article-editor/types';

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, authorsRes, productsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/authors').catch(() => ({ json: () => [] })),
        fetch('/api/products'),
      ]);

      const categoriesData = await categoriesRes.json();
      const authorsData = await authorsRes.json();
      const productsData = await productsRes.json();

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ArticleFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create article');
    }

    const article = await response.json();
    router.push(`/admin/articles/${article.id}`);
  };

  const handleCancel = () => {
    router.push('/admin/articles');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
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
    <ArticleEditor
      categories={categories}
      authors={authors}
      products={products}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
