'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  ArticleFormData,
  defaultArticleFormData,
  CategoryOption,
  AuthorOption,
  ProductOption,
  TocItem,
  ARTICLE_TYPES,
  STATUS_OPTIONS,
  extractTocFromHtml,
} from './types';
import RichTextEditor from './RichTextEditor';

interface ArticleEditorProps {
  articleId?: string;
  initialData?: Partial<ArticleFormData>;
  categories: CategoryOption[];
  authors: AuthorOption[];
  products: ProductOption[];
  onSave: (data: ArticleFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ArticleEditor({
  articleId,
  initialData,
  categories,
  authors,
  products,
  onSave,
  onCancel,
}: ArticleEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [toc, setToc] = useState<TocItem[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm<ArticleFormData>({
    defaultValues: { ...defaultArticleFormData, ...initialData },
    mode: 'onChange',
  });

  const title = watch('title');
  const content = watch('content');
  const productIds = watch('productIds') || [];
  const status = watch('status');

  // Auto-save draft to localStorage
  useEffect(() => {
    if (isDirty) {
      const draftKey = articleId ? `article_draft_${articleId}` : 'article_draft_new';
      const data = watch();
      localStorage.setItem(draftKey, JSON.stringify(data));
    }
  }, [watch, isDirty, articleId]);

  // Load draft on mount
  useEffect(() => {
    const draftKey = articleId ? `article_draft_${articleId}` : 'article_draft_new';
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !initialData) {
      const shouldRestore = window.confirm('Found unsaved draft. Do you want to restore it?');
      if (shouldRestore) {
        const draftData = JSON.parse(savedDraft);
        Object.keys(draftData).forEach((key) => {
          setValue(key as keyof ArticleFormData, draftData[key]);
        });
      }
    }
  }, [articleId, initialData, setValue]);

  // Update TOC when content changes
  useEffect(() => {
    if (content) {
      const newToc = extractTocFromHtml(content);
      setToc(newToc);
    } else {
      setToc([]);
    }
  }, [content]);

  // Auto-generate slug from title
  const generateSlug = () => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };

  // Auto-generate SEO fields
  const generateSeoFields = () => {
    if (title) {
      setValue('metaTitle', `${title} | Top10`);
      const excerpt = watch('excerpt');
      if (excerpt) {
        setValue('metaDescription', excerpt.slice(0, 160));
      }
    }
  };

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      setValue('productIds', productIds.filter(id => id !== productId), { shouldDirty: true });
    } else {
      setValue('productIds', [...productIds, productId], { shouldDirty: true });
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await onSave(data);
      setSaveStatus('saved');
      const draftKey = articleId ? `article_draft_${articleId}` : 'article_draft_new';
      localStorage.removeItem(draftKey);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="article-editor">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <h1>{articleId ? 'Edit Article' : 'Create New Article'}</h1>
          {title && <span className="article-preview">{title}</span>}
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
            {isSaving ? 'Saving...' : status === 'published' ? 'Update' : 'Save Draft'}
          </button>
        </div>
      </div>

      <div className="editor-layout">
        {/* Main Content Area */}
        <div className="editor-main">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="title-section">
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                placeholder="Article title..."
                className={`title-input ${errors.title ? 'error' : ''}`}
              />
              {errors.title && <span className="error-msg">{errors.title.message}</span>}
            </div>

            {/* Subtitle */}
            <div className="subtitle-section">
              <input
                type="text"
                {...register('subtitle')}
                placeholder="Subtitle (optional)..."
                className="subtitle-input"
              />
            </div>

            {/* Excerpt */}
            <div className="excerpt-section">
              <label>Excerpt</label>
              <textarea
                {...register('excerpt')}
                placeholder="Brief summary for listings and SEO..."
                rows={3}
              />
              <div className="char-count">{(watch('excerpt') || '').length} / 300 characters</div>
            </div>

            {/* Main Content */}
            <div className="content-section">
              <label>Content</label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Write your article content here..."
                  />
                )}
              />
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Status Card */}
          <div className="sidebar-card">
            <h3>Status</h3>
            <select {...register('status')} className="status-select">
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Slug Card */}
          <div className="sidebar-card">
            <h3>URL Slug</h3>
            <div className="slug-input-group">
              <input
                type="text"
                {...register('slug', { required: 'Slug is required' })}
                placeholder="article-slug"
                className={errors.slug ? 'error' : ''}
              />
              <button type="button" className="btn-gen" onClick={generateSlug}>
                Generate
              </button>
            </div>
            {errors.slug && <span className="error-msg">{errors.slug.message}</span>}
          </div>

          {/* Article Type */}
          <div className="sidebar-card">
            <h3>Article Type</h3>
            <select {...register('articleType')}>
              {ARTICLE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="sidebar-card">
            <h3>Category</h3>
            <select {...register('categoryId')}>
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="sidebar-card">
            <h3>Author</h3>
            <select {...register('authorId')}>
              <option value="">No author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="sidebar-card">
            <h3>Featured Image</h3>
            <input
              type="text"
              {...register('featuredImage')}
              placeholder="Image URL..."
            />
            {watch('featuredImage') && (
              <div className="image-preview">
                <img src={watch('featuredImage')} alt="Featured" />
              </div>
            )}
            <input
              type="text"
              {...register('featuredImageAlt')}
              placeholder="Alt text..."
              className="mt-2"
            />
          </div>

          {/* Related Products */}
          <div className="sidebar-card">
            <h3>Related Products ({productIds.length})</h3>
            <button
              type="button"
              className="btn-select-products"
              onClick={() => setShowProductSelector(!showProductSelector)}
            >
              {showProductSelector ? 'Hide Products' : 'Select Products'}
            </button>
            {showProductSelector && (
              <div className="product-selector">
                {products.map((product) => (
                  <label key={product.id} className="product-checkbox">
                    <input
                      type="checkbox"
                      checked={productIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
                    {product.logoUrl && (
                      <img src={product.logoUrl} alt={product.name} className="product-logo" />
                    )}
                    <span>{product.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Table of Contents */}
          {toc.length > 0 && (
            <div className="sidebar-card">
              <h3>Table of Contents</h3>
              <ul className="toc-list">
                {toc.map((item, index) => (
                  <li key={index} className={`toc-item level-${item.level}`}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SEO */}
          <div className="sidebar-card">
            <h3>SEO Settings</h3>
            <button type="button" className="btn-generate-seo" onClick={generateSeoFields}>
              Auto-generate
            </button>
            <div className="form-group">
              <label>Meta Title</label>
              <input type="text" {...register('metaTitle')} placeholder="SEO title..." />
              <div className="char-count">{(watch('metaTitle') || '').length} / 60</div>
            </div>
            <div className="form-group">
              <label>Meta Description</label>
              <textarea {...register('metaDescription')} placeholder="SEO description..." rows={3} />
              <div className="char-count">{(watch('metaDescription') || '').length} / 160</div>
            </div>
            <div className="form-group">
              <label>OG Image</label>
              <input type="text" {...register('ogImage')} placeholder="Social image URL..." />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .article-editor {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: white;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-left h1 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .article-preview {
          font-size: 14px;
          color: #6b7280;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .save-status {
          font-size: 13px;
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

        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 24px;
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .editor-main {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 24px;
        }

        .title-section {
          margin-bottom: 16px;
        }

        .title-input {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          font-size: 28px;
          font-weight: 700;
          outline: none;
        }

        .title-input:focus {
          border-bottom-color: #FE4A64;
        }

        .title-input.error {
          border-bottom-color: #dc2626;
        }

        .subtitle-input {
          width: 100%;
          padding: 8px 0;
          border: none;
          border-bottom: 1px solid #e5e7eb;
          font-size: 18px;
          color: #6b7280;
          outline: none;
          margin-bottom: 24px;
        }

        .excerpt-section, .content-section {
          margin-bottom: 24px;
        }

        .excerpt-section label, .content-section label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #374151;
        }

        .excerpt-section textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
        }

        .char-count {
          font-size: 12px;
          color: #9ca3af;
          text-align: right;
          margin-top: 4px;
        }

        .error-msg {
          font-size: 12px;
          color: #dc2626;
          margin-top: 4px;
        }

        .editor-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sidebar-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          padding: 16px;
        }

        .sidebar-card h3 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 12px 0;
          color: #374151;
        }

        .sidebar-card select,
        .sidebar-card input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .sidebar-card textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          resize: vertical;
        }

        .slug-input-group {
          display: flex;
          gap: 8px;
        }

        .slug-input-group input {
          flex: 1;
        }

        .btn-gen {
          padding: 8px 12px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-gen:hover {
          background: #e5e7eb;
        }

        .image-preview {
          margin-top: 12px;
          border-radius: 6px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          height: auto;
        }

        .mt-2 {
          margin-top: 8px;
        }

        .btn-select-products {
          width: 100%;
          padding: 8px;
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .product-selector {
          margin-top: 12px;
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
        }

        .product-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #e5e7eb;
        }

        .product-checkbox:last-child {
          border-bottom: none;
        }

        .product-checkbox:hover {
          background: #f9fafb;
        }

        .product-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }

        .toc-item {
          padding: 4px 0;
          color: #6b7280;
        }

        .toc-item.level-3 {
          padding-left: 16px;
        }

        .btn-generate-seo {
          width: 100%;
          padding: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
          color: #6b7280;
        }

        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }

          .editor-sidebar {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
