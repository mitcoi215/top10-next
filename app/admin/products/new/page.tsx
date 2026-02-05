'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductEditor } from '@/components/admin/product-editor';
import { ProductFormData, CategoryOption, AuthorOption } from '@/components/admin/product-editor/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories and authors in parallel
      const [catRes, authorsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/authors'),
      ]);

      const catData = await catRes.json();
      const authorsData = await authorsRes.json();

      setCategories(catData.map((c: { id: string; name: string; slug: string }) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })));

      // Authors API returns array directly
      const authorsArray = Array.isArray(authorsData) ? authorsData : [];
      setAuthors(authorsArray.map((a: any) => ({
        id: a.id,
        name: a.name,
      })));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ProductFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle validation errors with details (object format: { field: message })
      if (errorData.details && typeof errorData.details === 'object') {
        const detailMessages = Object.entries(errorData.details)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        throw new Error(detailMessages || errorData.error);
      }
      throw new Error(errorData.error || errorData.message || 'Failed to create product');
    }

    const newProduct = await response.json();
    router.push(`/admin/products/${newProduct.id}`);
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading editor...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #FE4A64;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ProductEditor
      categories={categories}
      authors={authors}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
