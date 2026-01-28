'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CategoryEditor } from '@/components/admin/category-editor';
import { CategoryFormData, ProductOption, ArticleOption } from '@/components/admin/category-editor/types';

export default function NewCategoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, articlesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/articles'),
        ]);

        const productsData = await productsRes.json();
        const articlesData = await articlesRes.json();

        setProducts(productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          rank: p.rank || 0,
          logoUrl: p.logoUrl,
        })));

        setArticles(articlesData.map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
        })));
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
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
