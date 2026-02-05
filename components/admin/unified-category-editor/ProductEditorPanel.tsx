'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { ProductFormData, defaultProductFormData, FaqItem, FeatureItem } from './types';
import ImageUpload from '../category-editor/ImageUpload';
import dynamic from 'next/dynamic';

// Dynamic import for RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import('../category-editor/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

// Dynamic import for HtmlRichTextEditor
const HtmlRichTextEditor = dynamic(() => import('../HtmlRichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>Đang tải editor...</div>,
});

interface Author {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

interface ProductEditorPanelProps {
  isOpen: boolean;
  productId: string | null;
  categoryId?: string;
  categorySlug?: string;
  authors: Author[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ProductEditorPanel({
  isOpen,
  productId,
  categoryId,
  categorySlug,
  authors,
  onClose,
  onSave,
}: ProductEditorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const methods = useForm<ProductFormData>({
    defaultValues: { ...defaultProductFormData, categoryId: categoryId || '' },
    mode: 'onChange',
  });

  const { register, watch, setValue, handleSubmit, reset, control, formState: { errors } } = methods;

  // useFieldArray for features
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: 'features',
  });

  // Load product data when panel opens with productId
  useEffect(() => {
    if (isOpen && productId) {
      setLoading(true);
      fetch(`/api/products/${productId}`)
        .then(res => res.json())
        .then(data => {
          reset({
            ...defaultProductFormData,
            ...data,
            categoryId: categoryId || data.categoryId,
          });
        })
        .catch(err => console.error('Load product error:', err))
        .finally(() => setLoading(false));
    } else if (isOpen && !productId) {
      // New product
      reset({
        ...defaultProductFormData,
        categoryId: categoryId || '',
      });
    }
  }, [isOpen, productId, categoryId, reset]);

  // Auto-generate slug
  const generateSlug = () => {
    const name = watch('name');
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setValue('slug', slug);
    }
  };

  // Auto-generate review href
  const generateReviewHref = () => {
    const slug = watch('slug');
    if (categorySlug && slug) {
      setValue('reviewHref', `/${categorySlug}/reviews/${slug}`);
    }
  };

  // Handle save
  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = productId ? `/api/products/${productId}` : '/api/products';
      const method = productId ? 'PUT' : 'POST';

      // Clean data
      const cleanedData = {
        ...data,
        rating: data.rating ? Math.min(5, Math.max(0, data.rating)) : null,
        overallScore: data.overallScore || null,
        rank: data.rank || 0,
        authorId: data.authorId || null,
        categoryId: categoryId || data.categoryId,
        pros: data.pros?.filter(p => p && p.trim() !== '') || [],
        cons: data.cons?.filter(c => c && c.trim() !== '') || [],
        features: data.features?.filter(f => f.text && f.text.trim() !== '') || [],
        faqs: data.faqs?.filter(f => f.question?.trim() && f.answer?.trim()) || [],
        relatedProductIds: data.relatedProductIds?.filter(id => id && id.trim() !== '') || [],
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

      const savedProduct = await res.json();
      onSave(savedProduct);
    } catch (error: any) {
      alert(error.message || 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Watch values
  const pros = watch('pros') || [];
  const cons = watch('cons') || [];
  const faqs = watch('faqs') || [];
  const quote = watch('quote');

  // Quote toggle
  const toggleQuote = () => {
    if (quote) {
      setValue('quote', null);
    } else {
      setValue('quote', { text: '', source: '', date: '' });
    }
  };

  // FAQ helpers
  const addFaq = () => {
    setValue('faqs', [...faqs, { question: '', answer: '' }]);
  };

  const removeFaq = (index: number) => {
    const newFaqs = [...faqs];
    newFaqs.splice(index, 1);
    setValue('faqs', newFaqs);
  };

  const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setValue('faqs', newFaqs);
  };

  const TABS = [
    { id: 'basic', label: 'Cơ bản', icon: '📋' },
    { id: 'listing', label: 'Hiển thị', icon: '📊' },
    { id: 'review', label: 'Nội dung', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
  ];

  return (
    <FormProvider {...methods}>
      {/* Overlay */}
      <div
        className={`panel-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`product-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="panel-header">
          <h3>{productId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button className="btn-close-panel" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="panel-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="panel-content">
          {loading ? (
            <div className="panel-loading">Đang tải...</div>
          ) : (
            <>
              {/* Tab: Basic */}
              {activeTab === 'basic' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label className="form-label">
                      Tên sản phẩm <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      {...register('name', { required: 'Tên là bắt buộc' })}
                      placeholder="VD: Sling TV"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">URL Slug</label>
                      <div className="input-with-btn">
                        <input
                          type="text"
                          className="form-input"
                          {...register('slug')}
                          placeholder="sling-tv"
                        />
                        <button type="button" className="btn-auto" onClick={generateSlug}>
                          Tạo
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Trạng thái</label>
                      <select className="form-select" {...register('status')}>
                        <option value="draft">Bản nháp</option>
                        <option value="published">Đã xuất bản</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="Logo"
                      value={watch('logoUrl') || ''}
                      onChange={(url) => setValue('logoUrl', url)}
                      placeholder="Upload logo sản phẩm"
                      folder="products/logos"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tác giả</label>
                    <select className="form-select" {...register('authorId')}>
                      <option value="">-- Chọn tác giả --</option>
                      {authors.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">URL Affiliate</label>
                      <input
                        type="url"
                        className="form-input"
                        {...register('ctaUrl')}
                        placeholder="https://..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Text nút CTA</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register('ctaText')}
                        placeholder="Xem trang web"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL trang đánh giá</label>
                    <div className="input-with-btn">
                      <input
                        type="text"
                        className="form-input"
                        {...register('reviewHref')}
                        placeholder="/category/reviews/product"
                      />
                      <button type="button" className="btn-auto" onClick={generateReviewHref}>
                        Tạo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Listing */}
              {activeTab === 'listing' && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Xếp hạng (1-10)</label>
                      <input
                        type="number"
                        className="form-input"
                        min="1"
                        max="10"
                        {...register('rank', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Huy hiệu</label>
                      <select className="form-select" {...register('ribbon')}>
                        <option value="">Không có</option>
                        <option value="Best Overall">Tốt nhất tổng thể</option>
                        <option value="Editor's Choice">Lựa chọn biên tập</option>
                        <option value="Best Value">Giá trị tốt nhất</option>
                        <option value="Most Popular">Phổ biến nhất</option>
                        <option value="Rising Star">Ngôi sao mới</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Khẩu hiệu</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('tagline')}
                      placeholder="VD: Tự do tạo gói tùy chỉnh"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tóm tắt (Bottom Line)</label>
                    <textarea
                      className="form-textarea"
                      {...register('bottomLine')}
                      rows={2}
                      placeholder="Mô tả ngắn về sản phẩm..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phù hợp cho</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register('bestFor')}
                        placeholder="VD: Người tiết kiệm"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Giá khởi điểm</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register('basePrice')}
                        placeholder="VD: $40/tháng"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Điểm tổng thể (0-10)</label>
                      <input
                        type="number"
                        className="form-input"
                        step="0.1"
                        min="0"
                        max="10"
                        {...register('overallScore', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nhãn điểm</label>
                      <select className="form-select" {...register('scoreLabel')}>
                        <option value="">Chọn...</option>
                        <option value="Excellent">Xuất sắc (9.0+)</option>
                        <option value="Very Good">Rất tốt (8.0-8.9)</option>
                        <option value="Good">Tốt (7.0-7.9)</option>
                        <option value="Fair">Khá (6.0-6.9)</option>
                        <option value="Poor">Kém (&lt;6.0)</option>
                      </select>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="subsection">
                    <label className="form-label">Điểm chi tiết</label>
                    <p className="form-hint">Điểm theo từng tiêu chí đánh giá</p>
                    <div className="scores-grid">
                      {['Value', 'Features', 'Ease of Use', 'Support', 'Quality'].map((criterion) => (
                        <div key={criterion} className="score-item">
                          <label className="score-label">{criterion}</label>
                          <input
                            type="number"
                            className="form-input score-input"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="0-10"
                            onChange={(e) => {
                              const currentScores = watch('scores') || {};
                              setValue('scores', {
                                ...currentScores,
                                [criterion.toLowerCase().replace(/ /g, '_')]: parseFloat(e.target.value) || 0
                              });
                            }}
                            defaultValue={watch('scores')?.[criterion.toLowerCase().replace(/ /g, '_')] || ''}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="subsection">
                    <label className="form-label">Thông tin nổi bật</label>
                    <p className="form-hint">Hiển thị nổi bật trong thẻ sản phẩm (tối đa 3 mục)</p>
                    <div className="highlights-grid">
                      {['Starting Price', 'Trial Period', 'Best For'].map((label) => (
                        <div key={label} className="highlight-item">
                          <label className="highlight-label">{label}</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder={`Nhập ${label.toLowerCase()}...`}
                            onChange={(e) => {
                              const currentHighlights = watch('highlights') || {};
                              setValue('highlights', {
                                ...currentHighlights,
                                [label.toLowerCase().replace(/ /g, '_')]: e.target.value
                              });
                            }}
                            defaultValue={watch('highlights')?.[label.toLowerCase().replace(/ /g, '_')] || ''}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="subsection">
                    <label className="form-label">Danh sách tính năng</label>
                    <p className="form-hint">Tính năng chính hiển thị trong thẻ so sánh (dấu tick)</p>
                    <div className="features-list">
                      {featureFields.map((field, index) => (
                        <div key={field.id} className="feature-item">
                          <input
                            type="text"
                            className="form-input"
                            {...register(`features.${index}.text` as const)}
                            placeholder="Nhập tính năng..."
                          />
                          <label className="bold-checkbox">
                            <input
                              type="checkbox"
                              {...register(`features.${index}.bold` as const)}
                            />
                            Đậm
                          </label>
                          <button
                            type="button"
                            className="btn-remove-small"
                            onClick={() => removeFeature(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-small"
                        onClick={() => appendFeature({ text: '', bold: false })}
                      >
                        + Thêm tính năng
                      </button>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="subsection">
                    <label className="form-label">Trích dẫn khách hàng</label>
                    <p className="form-hint">Phản hồi hiển thị trong thẻ sản phẩm</p>
                    <div className="quote-toggle">
                      <label className="toggle-label">
                        <input
                          type="checkbox"
                          checked={!!quote}
                          onChange={toggleQuote}
                        />
                        Bao gồm trích dẫn khách hàng
                      </label>
                    </div>

                    {quote && (
                      <div className="quote-fields">
                        <div className="form-group">
                          <label className="form-label-small">Nội dung trích dẫn</label>
                          <textarea
                            className="form-textarea"
                            value={quote.text}
                            onChange={(e) => setValue('quote', { ...quote, text: e.target.value })}
                            placeholder="Nhập trích dẫn khách hàng..."
                            rows={2}
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label-small">Tên nguồn</label>
                            <input
                              type="text"
                              className="form-input"
                              value={quote.source}
                              onChange={(e) => setValue('quote', { ...quote, source: e.target.value })}
                              placeholder="VD: Nguyễn Văn A."
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label-small">Ngày</label>
                            <input
                              type="text"
                              className="form-input"
                              value={quote.date}
                              onChange={(e) => setValue('quote', { ...quote, date: e.target.value })}
                              placeholder="VD: Tháng 1, 2026"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab: Review */}
              {activeTab === 'review' && (
                <div className="tab-content">
                  <div className="form-group">
                    <label className="form-label">Tiêu đề đánh giá</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('reviewTitle')}
                      placeholder="VD: Đánh giá Sling TV 2026"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phụ đề</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('reviewSubtitle')}
                      placeholder="VD: Một lựa chọn streaming TV linh hoạt"
                    />
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="Ảnh Banner"
                      value={watch('reviewHeroImage') || ''}
                      onChange={(url) => setValue('reviewHeroImage', url)}
                      placeholder="Upload ảnh banner"
                      folder="products/banners"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Đánh giá (1-5 sao)</label>
                      <input
                        type="number"
                        className="form-input"
                        step="0.1"
                        min="1"
                        max="5"
                        {...register('rating', { valueAsNumber: true })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Số lượt đánh giá</label>
                      <input
                        type="text"
                        className="form-input"
                        {...register('reviewCount')}
                        placeholder="VD: 3,598 đánh giá"
                      />
                    </div>
                  </div>

                  {/* Hero Summary */}
                  <div className="form-group">
                    <label className="form-label">Tóm tắt Banner</label>
                    <p className="form-hint">Đoạn mở đầu tóm tắt đánh giá (hiển thị trong phần mini-review)</p>
                    <div className="editor-wrapper-small">
                      <HtmlRichTextEditor
                        value={watch('heroSummary') || ''}
                        onChange={(html) => setValue('heroSummary', html)}
                        placeholder="Viết một đoạn giới thiệu hấp dẫn..."
                        minHeight="120px"
                        maxHeight="200px"
                      />
                    </div>
                  </div>

                  {/* Video URL */}
                  <div className="form-group">
                    <label className="form-label">URL Video</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('videoUrl')}
                      placeholder="VD: https://www.youtube.com/watch?v=..."
                    />
                    <span className="form-hint">Hỗ trợ: YouTube, Vimeo, Dailymotion</span>
                  </div>

                  {/* Pros */}
                  <div className="form-group">
                    <label className="form-label">👍 Ưu điểm</label>
                    <div className="dynamic-list">
                      {pros.map((_, idx) => (
                        <div key={idx} className="dynamic-item">
                          <input
                            type="text"
                            className="form-input"
                            {...register(`pros.${idx}`)}
                            placeholder="Nhập ưu điểm..."
                          />
                          <button
                            type="button"
                            className="btn-remove-small"
                            onClick={() => {
                              const newPros = [...pros];
                              newPros.splice(idx, 1);
                              setValue('pros', newPros);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-small"
                        onClick={() => setValue('pros', [...pros, ''])}
                      >
                        + Thêm ưu điểm
                      </button>
                    </div>
                  </div>

                  {/* Cons */}
                  <div className="form-group">
                    <label className="form-label">👎 Nhược điểm</label>
                    <div className="dynamic-list">
                      {cons.map((_, idx) => (
                        <div key={idx} className="dynamic-item">
                          <input
                            type="text"
                            className="form-input"
                            {...register(`cons.${idx}`)}
                            placeholder="Nhập nhược điểm..."
                          />
                          <button
                            type="button"
                            className="btn-remove-small"
                            onClick={() => {
                              const newCons = [...cons];
                              newCons.splice(idx, 1);
                              setValue('cons', newCons);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn-add-small"
                        onClick={() => setValue('cons', [...cons, ''])}
                      >
                        + Thêm nhược điểm
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="form-group">
                    <label className="form-label">Nội dung chính</label>
                    <p className="form-hint">Nội dung đánh giá đầy đủ với định dạng văn bản</p>
                    <div className="editor-wrapper">
                      <RichTextEditor
                        value={watch('mainContent') || ''}
                        onChange={(content) => setValue('mainContent', content)}
                        placeholder="Viết đánh giá chi tiết của bạn tại đây..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: SEO */}
              {activeTab === 'seo' && (
                <div className="tab-content">
                  {/* FAQs */}
                  <div className="subsection">
                    <label className="form-label">❓ Câu hỏi thường gặp</label>
                    <p className="form-hint">Phần FAQ cho trang đánh giá sản phẩm (hỗ trợ SEO)</p>
                    <div className="faq-list">
                      {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                          <div className="faq-header">
                            <span className="faq-number">Q{index + 1}</span>
                            <button
                              type="button"
                              className="btn-remove-small"
                              onClick={() => removeFaq(index)}
                            >
                              ×
                            </button>
                          </div>
                          <input
                            type="text"
                            className="form-input"
                            value={faq.question}
                            onChange={(e) => updateFaq(index, 'question', e.target.value)}
                            placeholder="Câu hỏi..."
                          />
                          <textarea
                            className="form-textarea"
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                            placeholder="Câu trả lời..."
                            rows={2}
                          />
                        </div>
                      ))}
                      <button type="button" className="btn-add-small" onClick={addFaq}>
                        + Thêm câu hỏi
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tiêu đề Meta</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('metaTitle')}
                      placeholder="Tiêu đề SEO..."
                    />
                    <span className="char-count">{(watch('metaTitle') || '').length}/60</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mô tả Meta</label>
                    <textarea
                      className="form-textarea"
                      {...register('metaDescription')}
                      rows={3}
                      placeholder="Mô tả SEO..."
                    />
                    <span className="char-count">{(watch('metaDescription') || '').length}/160</span>
                  </div>

                  <div className="form-group">
                    <ImageUpload
                      label="Ảnh OG (Social Share)"
                      value={watch('ogImage') || ''}
                      onChange={(url) => setValue('ogImage', url)}
                      placeholder="Upload ảnh OG"
                      folder="products/og"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Canonical</label>
                    <input
                      type="text"
                      className="form-input"
                      {...register('canonical')}
                      placeholder="https://example.com/noi-dung-goc"
                    />
                    <span className="form-hint">URL gốc nếu nội dung tồn tại ở nơi khác</span>
                  </div>

                  <div className="form-group">
                    <label className="form-label">ID sản phẩm liên quan</label>
                    <input
                      type="text"
                      className="form-input"
                      value={(watch('relatedProductIds') || []).join(', ')}
                      onChange={(e) => {
                        const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
                        setValue('relatedProductIds', ids);
                      }}
                      placeholder="id-1, id-2, id-3"
                    />
                    <span className="form-hint">Nhập ID sản phẩm phân cách bằng dấu phẩy</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="panel-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Hủy
          </button>
          <button
            type="button"
            className="btn-save-product"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .panel-tabs {
          display: flex;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .panel-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          background: transparent;
          border: none;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.15s;
          border-bottom: 2px solid transparent;
        }

        .panel-tab:hover {
          color: #374151;
          background: #f3f4f6;
        }

        .panel-tab.active {
          color: #FE4A64;
          border-bottom-color: #FE4A64;
          background: white;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .panel-loading {
          padding: 40px;
          text-align: center;
          color: #6b7280;
        }

        .dynamic-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dynamic-item {
          display: flex;
          gap: 8px;
        }

        .dynamic-item .form-input {
          flex: 1;
        }

        .btn-remove-small {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fee2e2;
          border: none;
          border-radius: 6px;
          color: #dc2626;
          font-size: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .btn-remove-small:hover {
          background: #fecaca;
        }

        .btn-add-small {
          padding: 10px;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-add-small:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        .subsection {
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          margin-top: 8px;
        }

        .form-hint {
          font-size: 12px;
          color: #6b7280;
          margin: 4px 0 8px 0;
        }

        .form-label-small {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          display: block;
          margin-bottom: 4px;
        }

        .scores-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        .score-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .score-label {
          font-size: 11px;
          color: #6b7280;
          text-align: center;
        }

        .score-input {
          text-align: center;
          padding: 8px 4px !important;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .highlight-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .highlight-label {
          font-size: 11px;
          color: #6b7280;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .feature-item {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .feature-item .form-input {
          flex: 1;
        }

        .bold-checkbox {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          white-space: nowrap;
        }

        .bold-checkbox input {
          width: 16px;
          height: 16px;
        }

        .quote-toggle {
          margin-bottom: 12px;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .toggle-label input {
          width: 18px;
          height: 18px;
        }

        .quote-fields {
          padding: 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .faq-item {
          padding: 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-number {
          font-size: 12px;
          font-weight: 700;
          color: #FE4A64;
          background: #fff5f6;
          padding: 4px 10px;
          border-radius: 4px;
        }

        .editor-wrapper {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
          min-height: 300px;
        }

        .editor-wrapper-small {
          border: 1px solid #d1d5db;
          border-radius: 6px;
          overflow: hidden;
        }

        .char-count {
          font-size: 11px;
          color: #9ca3af;
          text-align: right;
          display: block;
          margin-top: 4px;
        }

        @media (max-width: 640px) {
          .scores-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .highlights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </FormProvider>
  );
}
