'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnifiedCategoryEditor from '@/components/admin/unified-category-editor/UnifiedCategoryEditor';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description?: string;
  featured?: boolean;
  order?: number;
  groupId?: string;
  authorId?: string;
  heroImage?: string;
  heroTitle?: string;
  introContent?: string;
  productOrder?: string[];
  methodologyIntro?: string;
  methodologyCriteria?: Array<{ title: string; description: string }>;
  exploreCards?: Array<{ title: string; href: string; image?: string }>;
  bottomContent?: string;
  additionalContent?: string;
  faqs?: Array<{ question: string; answer: string }>;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  comparisonRedirectEnabled?: boolean;
  comparisonTitle?: string;
  comparisonSubtitle?: string;
  comparisonHeroImage?: string;
  comparisonProductOrder?: string[];
  comparisonTop3Enabled?: boolean;
  comparisonTop3Title?: string;
  comparisonTop3ProductIds?: string[];
  comparisonTop3Ribbon?: string;
  comparisonTop3ProductData?: any[];
  comparisonRightSidebarEnabled?: boolean;
  comparisonRightSidebarProductId?: string;
  comparisonLeftSidebarEnabled?: boolean;
  comparisonSocialProofCount?: string;
  comparisonScoreBreakdown?: Array<{ name: string; description: string; score: number }>;
  comparisonBelowFaqContent?: string;
  products?: any[];
}

interface Author {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryManagerPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const isNew = categoryId === 'new';

  const [category, setCategory] = useState<Category | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch authors and category groups in parallel
        const [authorsRes, groupsRes] = await Promise.all([
          fetch('/api/authors'),
          fetch('/api/category-groups'),
        ]);

        if (authorsRes.ok) {
          const authorsData = await authorsRes.json();
          setAuthors(authorsData);
        }

        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          setCategoryGroups(groupsData);
        }

        // If editing, fetch category data
        if (!isNew) {
          const categoryRes = await fetch(`/api/categories/${categoryId}`);
          if (categoryRes.ok) {
            const categoryData = await categoryRes.json();
            setCategory(categoryData);
          } else {
            setError('Không tìm thấy danh mục');
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, isNew]);

  const handleSave = async (data: any) => {
    const token = localStorage.getItem('admin_token');
    const url = isNew ? '/api/categories' : `/api/categories/${categoryId}`;
    const method = isNew ? 'POST' : 'PUT';

    // Filter out empty items from arrays before sending to API
    const cleanedData = {
      ...data,
      // Filter methodology criteria - only include items with both title and description
      methodologyCriteria: (data.methodologyCriteria || []).filter(
        (item: any) => item.title?.trim() && item.description?.trim()
      ),
      // Filter FAQs - only include items with both question and answer
      faqs: (data.faqs || []).filter(
        (item: any) => item.question?.trim() && item.answer?.trim()
      ),
      // Filter explore cards - only include items with both title and href
      exploreCards: (data.exploreCards || []).filter(
        (item: any) => item.title?.trim() && item.href?.trim()
      ),
      // Filter score breakdown - only include items with name
      comparisonScoreBreakdown: (data.comparisonScoreBreakdown || []).filter(
        (item: any) => item.name?.trim()
      ),
    };

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Lưu thất bại');
    }

    const savedCategory = await res.json();

    // If new, redirect to edit page
    if (isNew) {
      router.push(`/admin/category-manager/${savedCategory.id}`);
    }

    return savedCategory;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 16px;
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top-color: #FE4A64;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
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
        <button onClick={() => router.push('/admin/category-manager')}>
          Quay lại danh sách
        </button>
        <style jsx>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 16px;
          }
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
    <UnifiedCategoryEditor
      categoryId={isNew ? undefined : categoryId}
      initialData={category || undefined}
      authors={authors}
      categoryGroups={categoryGroups}
      onSave={handleSave}
      onCancel={() => router.push('/admin/category-manager')}
    />
  );
}
