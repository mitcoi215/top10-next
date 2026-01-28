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
      // Fetch categories
      const catRes = await fetch('/api/categories');
      const catData = await catRes.json();
      setCategories(catData.map((c: { id: string; name: string; slug: string }) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
      })));

      // TODO: Fetch authors when API is ready
      // For now, use sample data
      setAuthors([
        { id: '1', name: 'Phillip Richardson' },
        { id: '2', name: 'Sarah Johnson' },
        { id: '3', name: 'Mike Chen' },
      ]);
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
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
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
