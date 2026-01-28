'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { CategoryEditor } from '@/components/admin/category-editor';
import { CategoryFormData, ProductOption, ArticleOption, CategoryGroupOption } from '@/components/admin/category-editor/types';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Partial<CategoryFormData> | null>(null);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroupOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, groupsRes, productsRes, articlesRes] = await Promise.all([
          fetch(`/api/categories/${categoryId}`),
          fetch('/api/category-groups'),
          fetch('/api/products'),
          fetch('/api/articles'),
        ]);

        if (!categoryRes.ok) {
          throw new Error('Category not found');
        }

        const categoryData = await categoryRes.json();
        const groupsData = await groupsRes.json();
        const productsData = await productsRes.json();
        const articlesData = await articlesRes.json();

        // Transform category data to match form structure
        setCategory({
          slug: categoryData.slug,
          name: categoryData.name,
          icon: categoryData.icon || '📺',
          color: categoryData.color || 'bg-blue-500',
          description: categoryData.description || '',
          featured: categoryData.featured || false,
          order: categoryData.order || 0,
          groupId: categoryData.groupId || '',
          metaTitle: categoryData.metaTitle || '',
          metaDescription: categoryData.metaDescription || '',
          ogImage: categoryData.ogImage || '',
          heroImage: categoryData.heroImage || '',
          heroTitle: categoryData.heroTitle || '',
          introContent: categoryData.introContent || '',
          productOrder: categoryData.productOrder || [],
          criteriaDefinitions: categoryData.criteriaDefinitions || [],
          highlightDefinitions: categoryData.highlightDefinitions || [],
          reviewListIntro: categoryData.reviewListIntro || '',
          reviewListHeroImage: categoryData.reviewListHeroImage || '',
          tenThingsToKnow: categoryData.tenThingsToKnow || [],
          mustReadArticleIds: categoryData.mustReadArticleIds || [],
          methodologyIntro: categoryData.methodologyIntro || '',
          methodologyCriteria: categoryData.methodologyCriteria || [],
          exploreCards: categoryData.exploreCards || [],
          faqs: categoryData.faqs || [],
        });

        // Category Groups
        const groupsArray = Array.isArray(groupsData) ? groupsData : [];
        setCategoryGroups(groupsArray.map((g: any) => ({
          id: g.id,
          name: g.name,
          slug: g.slug,
          icon: g.icon,
        })));

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
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleSave = async (data: CategoryFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update category');
    }

    // Optionally refresh data after save
    const updatedCategory = await response.json();
    setCategory(updatedCategory);
  };

  const handleCancel = () => {
    router.push('/admin/categories');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading category...</p>
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

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/admin/categories')}>
          Back to Categories
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #dc2626;
          }
          h2 {
            font-size: 24px;
            margin-bottom: 8px;
          }
          p {
            color: #6b7280;
            margin-bottom: 16px;
          }
          button {
            padding: 10px 20px;
            background: #FE4A64;
            color: white;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <CategoryEditor
      categoryId={categoryId}
      initialData={category || undefined}
      categoryGroups={categoryGroups}
      products={products}
      articles={articles}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
