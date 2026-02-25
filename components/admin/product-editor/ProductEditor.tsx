'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ProductFormData, defaultProductFormData, CategoryOption, AuthorOption } from './types';
import Tab1BasicInfo from './Tab1BasicInfo';
import Tab2CategoryListing from './Tab2CategoryListing';
import Tab3ReviewContent from './Tab3ReviewContent';
import Tab4FaqSeo from './Tab4FaqSeo';

interface ProductEditorProps {
  productId?: string; // If editing existing product
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  authors: AuthorOption[];
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
}

const TABS = [
  { id: 'basic', label: 'Thông tin cơ bản', icon: '📋' },
  { id: 'listing', label: 'Hiển thị danh mục', icon: '📊' },
  { id: 'review', label: 'Nội dung đánh giá', icon: '📝' },
  { id: 'faq-seo', label: 'FAQ & SEO', icon: '🔍' },
];

export default function ProductEditor({
  productId,
  initialData,
  categories,
  authors,
  onSave,
  onCancel,
}: ProductEditorProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const methods = useForm<ProductFormData>({
    defaultValues: { ...defaultProductFormData, ...initialData },
    mode: 'onChange',
  });

  const { handleSubmit, watch, formState: { isDirty, errors } } = methods;

  // Auto-save draft to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      if (isDirty) {
        const draftKey = productId ? `product_draft_${productId}` : 'product_draft_new';
        localStorage.setItem(draftKey, JSON.stringify(data));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, productId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = productId ? `product_draft_${productId}` : 'product_draft_new';
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !initialData) {
      const shouldRestore = window.confirm('Tìm thấy bản nháp chưa lưu. Bạn có muốn khôi phục không?');
      if (shouldRestore) {
        const draftData = JSON.parse(savedDraft);
        methods.reset(draftData);
      }
    }
  }, [productId, initialData, methods]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      // Clean data before saving - convert NaN to null and handle empty strings
      const cleanedData = {
        ...data,
        // Convert NaN to null and handle empty strings; cast string values to numbers just in case
        rating: (() => {
          const num = Number(data.rating);
          if (Number.isNaN(num) || data.rating === null || data.rating === undefined) return null;
          return Math.min(5, Math.max(0, num));
        })(),
        overallScore: (() => {
          const num = Number(data.overallScore);
          return Number.isNaN(num) ? null : num;
        })(),
        rank: (() => {
          const num = Number(data.rank);
          return Number.isNaN(num) ? 0 : num;
        })(),
        // Convert empty strings to null for ObjectID fields
        authorId: data.authorId && data.authorId.trim() !== '' ? data.authorId : null,
        // Filter empty strings from arrays
        pros: data.pros?.filter(p => p && p.trim() !== '') || [],
        cons: data.cons?.filter(c => c && c.trim() !== '') || [],
        images: data.images?.filter(i => i && i.trim() !== '') || [],
        relatedProductIds: data.relatedProductIds?.filter(id => id && id.trim() !== '') || [],
      };
      await onSave(cleanedData);
      setSaveStatus('saved');
      // Clear draft after successful save
      const draftKey = productId ? `product_draft_${productId}` : 'product_draft_new';
      localStorage.removeItem(draftKey);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const getTabErrorCount = (tabId: string): number => {
    const errorKeys = Object.keys(errors);
    const tabFields: Record<string, string[]> = {
      basic: ['slug', 'name', 'logoUrl', 'ctaUrl', 'ctaText', 'reviewHref', 'status', 'categoryId', 'authorId'],
      listing: ['rank', 'ribbon', 'tagline', 'bottomLine', 'bestFor', 'basePrice', 'overallScore', 'scoreLabel', 'scores', 'highlights', 'features', 'quote'],
      review: ['reviewTitle', 'reviewSubtitle', 'reviewHeroImage', 'rating', 'reviewCount', 'heroSummary', 'pros', 'cons', 'mainContent', 'verdict', 'images'],
      'faq-seo': ['faqs', 'userRatings', 'relatedProductIds', 'metaTitle', 'metaDescription', 'ogImage', 'canonical'],
    };
    return errorKeys.filter(key => tabFields[tabId]?.includes(key)).length;
  };

  return (
    <FormProvider {...methods}>
      <div className="product-editor">
        {/* Header */}
        <div className="editor-header">
          <div className="header-left">
            <h1>{productId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</h1>
            <span className="status-badge" data-status={watch('status')}>
              {watch('status') === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </span>
          </div>
          <div className="header-right">
            {saveStatus === 'saving' && <span className="save-status saving">Đang lưu...</span>}
            {saveStatus === 'saved' && <span className="save-status saved">Đã lưu!</span>}
            {saveStatus === 'error' && <span className="save-status error">Lưu thất bại</span>}
            {isDirty && saveStatus === 'idle' && <span className="save-status unsaved">Chưa lưu thay đổi</span>}

            {onCancel && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Hủy
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-nav">
          {TABS.map((tab) => {
            const errorCount = getTabErrorCount(tab.id);
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''} ${errorCount > 0 ? 'has-error' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {errorCount > 0 && <span className="error-badge">{errorCount}</span>}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="editor-form">
          <div className="tab-content">
            {activeTab === 'basic' && (
              <Tab1BasicInfo categories={categories} authors={authors} />
            )}
            {activeTab === 'listing' && (
              <Tab2CategoryListing />
            )}
            {activeTab === 'review' && (
              <Tab3ReviewContent />
            )}
            {activeTab === 'faq-seo' && (
              <Tab4FaqSeo />
            )}
          </div>
        </form>

        <style jsx>{`
          .product-editor {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            background: #f8f9fa;
            min-height: 100vh;
          }

          .editor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding: 16px 24px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .header-left h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            color: #1a1a1a;
          }

          .status-badge {
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-badge[data-status="draft"] {
            background: #fef3c7;
            color: #92400e;
          }

          .status-badge[data-status="published"] {
            background: #d1fae5;
            color: #065f46;
          }

          .header-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .save-status {
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
          }

          .save-status.saving { color: #6b7280; }
          .save-status.saved { color: #059669; background: #d1fae5; }
          .save-status.error { color: #dc2626; background: #fee2e2; }
          .save-status.unsaved { color: #d97706; background: #fef3c7; }

          .btn-primary, .btn-secondary {
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }

          .btn-primary {
            background: #FE4A64;
            color: white;
          }

          .btn-primary:hover:not(:disabled) {
            background: #e5435b;
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .btn-secondary {
            background: white;
            color: #374151;
            border: 1px solid #d1d5db;
          }

          .btn-secondary:hover {
            background: #f3f4f6;
          }

          .tabs-nav {
            display: flex;
            gap: 4px;
            margin-bottom: 24px;
            background: white;
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .tab-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 12px 16px;
            border: none;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #6b7280;
            transition: all 0.2s;
          }

          .tab-btn:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .tab-btn.active {
            background: #FE4A64;
            color: white;
          }

          .tab-btn.has-error {
            color: #dc2626;
          }

          .tab-btn.active.has-error {
            background: #dc2626;
          }

          .tab-icon {
            font-size: 18px;
          }

          .error-badge {
            background: #dc2626;
            color: white;
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 4px;
          }

          .tab-btn.active .error-badge {
            background: white;
            color: #dc2626;
          }

          .editor-form {
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }

          .tab-content {
            padding: 24px;
          }

          @media (max-width: 768px) {
            .product-editor {
              padding: 12px;
            }

            .editor-header {
              flex-direction: column;
              gap: 16px;
              align-items: flex-start;
            }

            .header-right {
              width: 100%;
              justify-content: flex-end;
            }

            .tabs-nav {
              flex-wrap: wrap;
            }

            .tab-btn {
              flex: 1 1 45%;
            }

            .tab-label {
              display: none;
            }
          }
        `}</style>
      </div>
    </FormProvider>
  );
}
