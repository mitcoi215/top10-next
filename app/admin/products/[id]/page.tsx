'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductEditor } from '@/components/admin/product-editor';
import { ProductFormData, CategoryOption, AuthorOption } from '@/components/admin/product-editor/types';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [initialData, setInitialData] = useState<Partial<ProductFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

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
      setAuthors([
        { id: '1', name: 'Phillip Richardson' },
        { id: '2', name: 'Sarah Johnson' },
        { id: '3', name: 'Mike Chen' },
      ]);

      // Fetch product data
      const productRes = await fetch(`/api/products/${id}`);
      if (!productRes.ok) {
        throw new Error('Product not found');
      }
      const productData = await productRes.json();

      // Map API data to form data structure
      setInitialData({
        slug: productData.slug || '',
        name: productData.name || productData.title || '',
        logoUrl: productData.logoUrl || productData.image || '',
        ctaUrl: productData.ctaUrl || productData.affiliateLink || '',
        ctaText: productData.ctaText || 'Visit Site',
        reviewHref: productData.reviewHref || '',
        status: productData.status || 'draft',
        categoryId: productData.categoryId || '',
        authorId: productData.authorId || '',
        rank: productData.rank || 1,
        ribbon: productData.ribbon || '',
        tagline: productData.tagline || '',
        bottomLine: productData.bottomLine || productData.description || '',
        bestFor: productData.bestFor || '',
        basePrice: productData.basePrice || productData.price || '',
        overallScore: productData.overallScore || productData.rating || null,
        scoreLabel: productData.scoreLabel || '',
        scores: productData.scores || {},
        highlights: productData.highlights || {},
        features: productData.features || [],
        quote: productData.quote || null,
        reviewTitle: productData.reviewTitle || '',
        reviewSubtitle: productData.reviewSubtitle || '',
        reviewHeroImage: productData.reviewHeroImage || '',
        rating: productData.rating || null,
        reviewCount: productData.reviewCount || '',
        heroSummary: productData.heroSummary || '',
        videoUrl: productData.videoUrl || '',
        pros: productData.pros || [],
        cons: productData.cons || [],
        mainContent: productData.mainContent || productData.detailedDescription || '',
        verdict: productData.verdict || '',
        images: productData.images || [],
        faqs: productData.faqs || [],
        userRatings: productData.userRatings || {},
        relatedProductIds: productData.relatedProductIds || [],
        metaTitle: productData.metaTitle || '',
        metaDescription: productData.metaDescription || '',
        ogImage: productData.ogImage || '',
        canonical: productData.canonical || '',
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ProductFormData) => {
    const token = localStorage.getItem('admin_token');

    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
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

  if (error) {
    return (
      <div className="error-container">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/admin/products')}>
          Quay lại danh sách
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
          }
          h2 { color: #dc2626; }
          button {
            padding: 10px 20px;
            background: #FE4A64;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return (
    <ProductEditor
      productId={id}
      initialData={initialData || undefined}
      categories={categories}
      authors={authors}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
