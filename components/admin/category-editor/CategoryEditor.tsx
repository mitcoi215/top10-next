'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { CategoryFormData, defaultCategoryFormData, ProductOption, ArticleOption, CategoryGroupOption } from './types';
import Tab1GeneralInfo from './Tab1GeneralInfo';
import Tab2RankingDisplay from './Tab2RankingDisplay';
import Tab3Definitions from './Tab3Definitions';
import Tab4ReviewMethodology from './Tab4ReviewMethodology';

interface CategoryEditorProps {
  categoryId?: string;
  initialData?: Partial<CategoryFormData>;
  categoryGroups: CategoryGroupOption[];
  products: ProductOption[];
  articles: ArticleOption[];
  onSave: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
}

const TABS = [
  { id: 'general', label: 'General Info', icon: '⚙️' },
  { id: 'ranking', label: 'Ranking & Display', icon: '📊' },
  { id: 'definitions', label: 'Definitions', icon: '🧠' },
  { id: 'review-methodology', label: 'Review & Methodology', icon: '📋' },
];

export default function CategoryEditor({
  categoryId,
  initialData,
  categoryGroups,
  products,
  articles,
  onSave,
  onCancel,
}: CategoryEditorProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const methods = useForm<CategoryFormData>({
    defaultValues: { ...defaultCategoryFormData, ...initialData },
    mode: 'onChange',
  });

  const { handleSubmit, watch, formState: { isDirty, errors } } = methods;

  // Auto-save draft to localStorage
  useEffect(() => {
    const subscription = watch((data) => {
      if (isDirty) {
        const draftKey = categoryId ? `category_draft_${categoryId}` : 'category_draft_new';
        localStorage.setItem(draftKey, JSON.stringify(data));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isDirty, categoryId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = categoryId ? `category_draft_${categoryId}` : 'category_draft_new';
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !initialData) {
      const shouldRestore = window.confirm('Found unsaved draft. Do you want to restore it?');
      if (shouldRestore) {
        const draftData = JSON.parse(savedDraft);
        methods.reset(draftData);
      }
    }
  }, [categoryId, initialData, methods]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await onSave(data);
      setSaveStatus('saved');
      const draftKey = categoryId ? `category_draft_${categoryId}` : 'category_draft_new';
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
      general: ['slug', 'name', 'icon', 'color', 'description', 'featured', 'order', 'groupId', 'metaTitle', 'metaDescription', 'ogImage'],
      ranking: ['heroImage', 'heroTitle', 'introContent', 'productOrder'],
      definitions: ['criteriaDefinitions', 'highlightDefinitions'],
      'review-methodology': ['reviewListIntro', 'reviewListHeroImage', 'tenThingsToKnow', 'mustReadArticleIds', 'methodologyIntro', 'methodologyCriteria', 'exploreCards', 'faqs'],
    };
    return errorKeys.filter(key => tabFields[tabId]?.includes(key)).length;
  };

  return (
    <FormProvider {...methods}>
      <div className="category-editor">
        {/* Header */}
        <div className="editor-header">
          <div className="header-left">
            <h1>{categoryId ? 'Edit Category' : 'Create New Category'}</h1>
            {watch('name') && (
              <span className="category-preview">
                <span className="preview-icon">{watch('icon')}</span>
                {watch('name')}
              </span>
            )}
          </div>
          <div className="header-right">
            {saveStatus === 'saving' && <span className="save-status saving">Saving...</span>}
            {saveStatus === 'saved' && <span className="save-status saved">Saved!</span>}
            {saveStatus === 'error' && <span className="save-status error">Save failed</span>}
            {isDirty && saveStatus === 'idle' && <span className="save-status unsaved">Unsaved changes</span>}

            {onCancel && (
              <button type="button" className="btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit(onSubmit)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Category'}
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
            {activeTab === 'general' && <Tab1GeneralInfo categoryGroups={categoryGroups} />}
            {activeTab === 'ranking' && <Tab2RankingDisplay products={products} />}
            {activeTab === 'definitions' && <Tab3Definitions />}
            {activeTab === 'review-methodology' && <Tab4ReviewMethodology articles={articles} />}
          </div>
        </form>

        <style jsx>{`
          .category-editor {
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

          .category-preview {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: #f3f4f6;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          }

          .preview-icon {
            font-size: 18px;
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
            .category-editor {
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
