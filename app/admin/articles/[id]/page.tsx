'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArticleEditor } from '@/components/admin/article-editor';
import { ArticleFormData, CategoryOption, AuthorOption, ProductOption } from '@/components/admin/article-editor/types';

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Partial<ArticleFormData> | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [articleId]);

  const fetchData = async () => {
    try {
      const [articleRes, categoriesRes, authorsRes, productsRes] = await Promise.all([
        fetch(`/api/articles/${articleId}`),
        fetch('/api/categories'),
        fetch('/api/authors').catch(() => ({ json: () => [] })),
        fetch('/api/products'),
      ]);

      if (!articleRes.ok) {
        throw new Error('Article not found');
      }

      const articleData = await articleRes.json();
      const categoriesData = await categoriesRes.json();
      const authorsData = await authorsRes.json();
      const productsData = await productsRes.json();

      setArticle({
        slug: articleData.slug || '',
        title: articleData.title || '',
        subtitle: articleData.subtitle || '',
        articleType: articleData.articleType || 'charticle',
        status: articleData.status || 'draft',
        categoryId: articleData.categoryId || null,
        authorId: articleData.authorId || null,
        featuredImage: articleData.featuredImage || '',
        featuredImageAlt: articleData.featuredImageAlt || '',
        content: articleData.content || '',
        excerpt: articleData.excerpt || '',
        productIds: articleData.productIds || [],
        breadcrumbs: articleData.breadcrumbs || [],
        metaTitle: articleData.metaTitle || '',
        metaDescription: articleData.metaDescription || '',
        ogImage: articleData.ogImage || '',
        canonical: articleData.canonical || '',
      });

      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ArticleFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch(`/api/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update article');
    }

    const updatedArticle = await response.json();
    setArticle(updatedArticle);
  };

  const handleCancel = () => {
    router.push('/admin/articles');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Đang tải bài viết...</p>
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
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/admin/articles')}>
          Quay lại danh sách
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
    <ArticleEditor
      articleId={articleId}
      initialData={article || undefined}
      categories={categories}
      authors={authors}
      products={products}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
