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
import RichTextEditor from '@/components/admin/RichTextEditor';

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
  const [showProductCtaPanel, setShowProductCtaPanel] = useState(false);
  const [productCtaSearch, setProductCtaSearch] = useState('');

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
      const shouldRestore = window.confirm('Tìm thấy bản nháp chưa lưu. Bạn có muốn khôi phục không?');
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

  // Insert product CTA syntax at the end of content
  const insertProductCta = (productSlug: string) => {
    const currentContent = watch('content') || '';
    const ctaSyntax = `\n\n{{product:${productSlug}}}\n\n`;
    setValue('content', currentContent + ctaSyntax, { shouldDirty: true });
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
          <h1>{articleId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h1>
          {title && <span className="article-preview">{title}</span>}
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
            {isSaving ? 'Đang lưu...' : status === 'published' ? 'Cập nhật' : 'Lưu bản nháp'}
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
                {...register('title', { required: 'Tiêu đề là bắt buộc' })}
                placeholder="Tiêu đề bài viết..."
                className={`title-input ${errors.title ? 'error' : ''}`}
              />
              {errors.title && <span className="error-msg">{errors.title.message}</span>}
            </div>

            {/* Subtitle */}
            <div className="subtitle-section">
              <input
                type="text"
                {...register('subtitle')}
                placeholder="Phụ đề (tùy chọn)..."
                className="subtitle-input"
              />
            </div>

            {/* Excerpt */}
            <div className="excerpt-section">
              <label>Tóm tắt</label>
              <textarea
                {...register('excerpt')}
                placeholder="Tóm tắt ngắn gọn cho danh sách và SEO..."
                rows={3}
              />
              <div className="char-count">{(watch('excerpt') || '').length} / 300 ký tự</div>
            </div>

            {/* Main Content */}
            <div className="content-section">
              <div className="content-section-header">
                <label>Nội dung</label>
                <button
                  type="button"
                  className={`btn-insert-cta ${showProductCtaPanel ? 'active' : ''}`}
                  onClick={() => setShowProductCtaPanel(!showProductCtaPanel)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  Chèn CTA sản phẩm
                </button>
              </div>

              {/* Product CTA Panel */}
              {showProductCtaPanel && (
                <div className="product-cta-panel">
                  <div className="product-cta-panel-header">
                    <span className="panel-title">Click để chèn hộp CTA sản phẩm</span>
                    <span className="panel-hint">Chèn <code>{'{{product:slug}}'}</code> vào cuối nội dung</span>
                  </div>
                  <div className="product-cta-search">
                    <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm sản phẩm..."
                      value={productCtaSearch}
                      onChange={(e) => setProductCtaSearch(e.target.value)}
                      className="product-cta-search-input"
                    />
                    {productCtaSearch && (
                      <button
                        type="button"
                        className="search-clear"
                        onClick={() => setProductCtaSearch('')}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="product-cta-grid">
                    {products
                      .filter(product =>
                        product.name.toLowerCase().includes(productCtaSearch.toLowerCase()) ||
                        product.slug.toLowerCase().includes(productCtaSearch.toLowerCase())
                      )
                      .map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="product-cta-item"
                        onClick={() => insertProductCta(product.slug)}
                        title={`Insert {{product:${product.slug}}}`}
                      >
                        {product.logoUrl && (
                          <img src={product.logoUrl} alt={product.name} className="product-cta-logo" />
                        )}
                        <span className="product-cta-name">{product.name}</span>
                        <span className="product-cta-slug">{product.slug}</span>
                      </button>
                    ))}
                    {products.filter(product =>
                      product.name.toLowerCase().includes(productCtaSearch.toLowerCase()) ||
                      product.slug.toLowerCase().includes(productCtaSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="no-products-found">Không tìm thấy sản phẩm</div>
                    )}
                  </div>
                </div>
              )}

              <div className="editor-wrapper">
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Viết nội dung bài viết tại đây..."
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <div className="editor-sidebar">
          {/* Status Card */}
          <div className="sidebar-card">
            <h3>Trạng thái</h3>
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
                {...register('slug', { required: 'Slug là bắt buộc' })}
                placeholder="slug-bai-viet"
                className={errors.slug ? 'error' : ''}
              />
              <button type="button" className="btn-gen" onClick={generateSlug}>
                Tạo tự động
              </button>
            </div>
            {errors.slug && <span className="error-msg">{errors.slug.message}</span>}
          </div>

          {/* Article Type */}
          <div className="sidebar-card">
            <h3>Loại bài viết</h3>
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
            <h3>Danh mục</h3>
            <select {...register('categoryId')}>
              <option value="">Không có danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="sidebar-card">
            <h3>Tác giả</h3>
            <select {...register('authorId')}>
              <option value="">Không có tác giả</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="sidebar-card">
            <h3>Ảnh đại diện</h3>
            <input
              type="text"
              {...register('featuredImage')}
              placeholder="URL ảnh..."
            />
            {watch('featuredImage') && (
              <div className="image-preview">
                <img src={watch('featuredImage')} alt="Featured" />
              </div>
            )}
            <input
              type="text"
              {...register('featuredImageAlt')}
              placeholder="Văn bản alt..."
              className="mt-2"
            />
          </div>

          {/* Related Products */}
          <div className="sidebar-card">
            <h3>Sản phẩm liên quan ({productIds.length})</h3>
            <button
              type="button"
              className="btn-select-products"
              onClick={() => setShowProductSelector(!showProductSelector)}
            >
              {showProductSelector ? 'Ẩn sản phẩm' : 'Chọn sản phẩm'}
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
              <h3>Mục lục</h3>
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
            <h3>Cài đặt SEO</h3>
            <button type="button" className="btn-generate-seo" onClick={generateSeoFields}>
              Tự động tạo
            </button>
            <div className="form-group">
              <label>Tiêu đề Meta</label>
              <input type="text" {...register('metaTitle')} placeholder="Tiêu đề SEO..." />
              <div className="char-count">{(watch('metaTitle') || '').length} / 60</div>
            </div>
            <div className="form-group">
              <label>Mô tả Meta</label>
              <textarea {...register('metaDescription')} placeholder="Mô tả SEO..." rows={3} />
              <div className="char-count">{(watch('metaDescription') || '').length} / 160</div>
            </div>
            <div className="form-group">
              <label>Ảnh OG</label>
              <input type="text" {...register('ogImage')} placeholder="URL ảnh mạng xã hội..." />
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

        .content-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .excerpt-section label, .content-section label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .btn-insert-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #FF4A64 0%, #FF6B7A 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-insert-cta:hover {
          background: linear-gradient(135deg, #E8435A 0%, #FF5A6A 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 74, 100, 0.3);
        }

        .btn-insert-cta.active {
          background: linear-gradient(135deg, #E8435A 0%, #FF5A6A 100%);
          box-shadow: 0 4px 12px rgba(255, 74, 100, 0.3);
        }

        .btn-insert-cta svg {
          flex-shrink: 0;
        }

        .product-cta-panel {
          background: linear-gradient(135deg, #FFF5F6 0%, #FFF0F2 100%);
          border: 2px solid #FF4A64;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .product-cta-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .panel-title {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .panel-hint {
          font-size: 12px;
          color: #6b7280;
        }

        .panel-hint code {
          background: #fff;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: #FF4A64;
          border: 1px solid #fecdd3;
        }

        .product-cta-search {
          position: relative;
          margin-bottom: 12px;
        }

        .product-cta-search .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .product-cta-search-input {
          width: 100%;
          padding: 10px 36px 10px 40px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: border-color 0.2s ease;
        }

        .product-cta-search-input:focus {
          outline: none;
          border-color: #FF4A64;
          box-shadow: 0 0 0 3px rgba(255, 74, 100, 0.1);
        }

        .product-cta-search-input::placeholder {
          color: #9ca3af;
        }

        .search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 24px;
          height: 24px;
          border: none;
          background: #e5e7eb;
          border-radius: 50%;
          color: #6b7280;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .search-clear:hover {
          background: #d1d5db;
          color: #374151;
        }

        .no-products-found {
          grid-column: 1 / -1;
          text-align: center;
          padding: 24px;
          color: #6b7280;
          font-size: 14px;
        }

        .product-cta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }

        .product-cta-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .product-cta-item:hover {
          border-color: #FF4A64;
          background: #fff5f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 74, 100, 0.15);
        }

        .product-cta-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .product-cta-name {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }

        .product-cta-slug {
          font-size: 11px;
          color: #9ca3af;
          font-family: monospace;
        }

        .editor-wrapper {
          border: 2px solid #d1d5db;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .editor-wrapper:focus-within {
          border-color: #FF4A64;
          box-shadow: 0 0 0 3px rgba(255, 74, 100, 0.1);
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
