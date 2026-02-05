'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { ClipboardList, Search, Image, FileText, Scale, Package } from 'lucide-react';
import SidebarNav from './SidebarNav';
import SectionBasicInfo from './sections/SectionBasicInfo';
import SectionSeo from './sections/SectionSeo';
import SectionBanner from './sections/SectionBanner';
import SectionProducts from './sections/SectionProducts';
import SectionContent from './sections/SectionContent';
import SectionComparison from './sections/SectionComparison';
import ProductEditorPanel from './ProductEditorPanel';
import FloatingActions from './FloatingActions';
import { CategoryFormData, defaultCategoryFormData } from './types';
import './styles.css';

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

interface UnifiedCategoryEditorProps {
  categoryId?: string;
  initialData?: Partial<CategoryFormData>;
  authors: Author[];
  categoryGroups: CategoryGroup[];
  onSave: (data: CategoryFormData) => Promise<any>;
  onCancel?: () => void;
}

// Section definitions
const SECTIONS = [
  { id: 'basic', label: 'Thông tin cơ bản', icon: ClipboardList, required: ['name', 'slug'] },
  { id: 'seo', label: 'SEO', icon: Search, required: [] },
  { id: 'banner', label: 'Banner & Hiển thị', icon: Image, required: [] },
  { id: 'content', label: 'Nội dung & FAQ', icon: FileText, required: [] },
  { id: 'comparison', label: 'Trang So sánh', icon: Scale, required: [] },
  { id: 'products', label: 'Sản phẩm', icon: Package, required: [] },
];

export default function UnifiedCategoryEditor({
  categoryId,
  initialData,
  authors,
  categoryGroups,
  onSave,
  onCancel,
}: UnifiedCategoryEditorProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  // Product panel state
  const [productPanelOpen, setProductPanelOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>(initialData?.products || []);

  const methods = useForm<CategoryFormData>({
    defaultValues: { ...defaultCategoryFormData, ...initialData },
    mode: 'onChange',
  });

  const { handleSubmit, watch, formState: { isDirty, errors } } = methods;

  // Calculate section completion status
  const getSectionStatus = (sectionId: string) => {
    const section = SECTIONS.find(s => s.id === sectionId);
    if (!section) return 'empty';

    const values = watch();
    const hasRequiredFields = section.required.every(field => {
      const value = values[field as keyof CategoryFormData];
      return value && String(value).trim() !== '';
    });

    if (section.required.length === 0) {
      // Check if any field in this section has content
      switch (sectionId) {
        case 'seo':
          return values.metaTitle || values.metaDescription ? 'complete' : 'empty';
        case 'banner':
          return values.heroImage || values.heroTitle || values.introContent ? 'complete' : 'empty';
        case 'products':
          return products.length > 0 ? 'complete' : 'empty';
        case 'content':
          return values.methodologyIntro || (values.faqs && values.faqs.length > 0) ? 'complete' : 'empty';
        case 'comparison':
          return values.comparisonTitle || values.comparisonTop3Enabled ? 'complete' : 'empty';
        default:
          return 'empty';
      }
    }

    return hasRequiredFields ? 'complete' : 'incomplete';
  };

  // Switch to section (tab-like behavior)
  const switchToSection = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // Handle save
  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);
    setSaveStatus('saving');
    setSaveMessage('');

    try {
      await onSave(data);
      setSaveStatus('saved');
      setSaveMessage('Đã lưu thành công!');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error: any) {
      setSaveStatus('error');
      setSaveMessage(error.message || 'Lưu thất bại');
    } finally {
      setIsSaving(false);
    }
  };

  // Product panel handlers
  const openProductPanel = (productId?: string) => {
    setSelectedProductId(productId || null);
    setProductPanelOpen(true);
  };

  const closeProductPanel = () => {
    setProductPanelOpen(false);
    setSelectedProductId(null);
  };

  const handleProductSave = async (productData: any) => {
    // Refresh products list after save
    if (categoryId) {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    }
    closeProductPanel();
  };

  // Update products when initialData changes
  useEffect(() => {
    if (initialData?.products) {
      setProducts(initialData.products);
    }
  }, [initialData]);

  // Calculate overall progress
  const completedSections = SECTIONS.filter(s => getSectionStatus(s.id) === 'complete').length;
  const progress = Math.round((completedSections / SECTIONS.length) * 100);

  return (
    <FormProvider {...methods}>
      <div className="unified-editor">
        {/* Header */}
        <header className="unified-editor__header">
          <div className="unified-editor__header-left">
            <button className="btn-back" onClick={onCancel} title="Quay lại">
              ←
            </button>
            <div className="unified-editor__title">
              <h1>{categoryId ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</h1>
              {watch('name') && (
                <span className="unified-editor__preview">
                  <span className="preview-icon">{watch('icon') || '📁'}</span>
                  {watch('name')}
                </span>
              )}
            </div>
          </div>
          <div className="unified-editor__header-right">
            {saveStatus !== 'idle' && (
              <span className={`save-status save-status--${saveStatus}`}>
                {saveStatus === 'saving' && 'Đang lưu...'}
                {saveStatus === 'saved' && '✓ Đã lưu'}
                {saveStatus === 'error' && `✗ ${saveMessage}`}
              </span>
            )}
            {isDirty && saveStatus === 'idle' && (
              <span className="save-status save-status--unsaved">● Chưa lưu</span>
            )}
            <a
              href={`/${watch('slug') || 'preview'}`}
              target="_blank"
              className="btn-preview"
            >
              👁 Xem trước
            </a>
          </div>
        </header>

        <div className="unified-editor__body">
          {/* Sidebar Navigation */}
          <SidebarNav
            sections={SECTIONS}
            activeSection={activeSection}
            getSectionStatus={getSectionStatus}
            onSectionClick={switchToSection}
            progress={progress}
          />

          {/* Main Content - Tab-like: only show active section */}
          <main className="unified-editor__content">
            {activeSection === 'basic' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <ClipboardList className="w-5 h-5 text-slate-500" />
                  <h2>Thông tin cơ bản</h2>
                </div>
                <div className="section-panel__content">
                  <SectionBasicInfo categoryGroups={categoryGroups} />
                </div>
              </div>
            )}

            {activeSection === 'seo' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <Search className="w-5 h-5 text-slate-500" />
                  <h2>SEO</h2>
                </div>
                <div className="section-panel__content">
                  <SectionSeo />
                </div>
              </div>
            )}

            {activeSection === 'banner' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <Image className="w-5 h-5 text-slate-500" />
                  <h2>Banner & Hiển thị</h2>
                </div>
                <div className="section-panel__content">
                  <SectionBanner authors={authors} />
                </div>
              </div>
            )}

            {activeSection === 'content' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <h2>Nội dung & FAQ</h2>
                </div>
                <div className="section-panel__content">
                  <SectionContent authors={authors} />
                </div>
              </div>
            )}

            {activeSection === 'comparison' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <Scale className="w-5 h-5 text-slate-500" />
                  <h2>Trang So sánh</h2>
                </div>
                <div className="section-panel__content">
                  <SectionComparison products={products} categoryId={categoryId} />
                </div>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="section-panel">
                <div className="section-panel__header">
                  <Package className="w-5 h-5 text-slate-500" />
                  <h2>Sản phẩm</h2>
                  <span className="section-count">{products.length} sản phẩm</span>
                </div>
                <div className="section-panel__content">
                  <SectionProducts
                    products={products}
                    categoryId={categoryId}
                    onEditProduct={(id) => openProductPanel(id)}
                    onAddProduct={() => openProductPanel()}
                    onProductsChange={setProducts}
                  />
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Floating Actions */}
        <FloatingActions
          onSave={handleSubmit(onSubmit)}
          isSaving={isSaving}
          isDirty={isDirty}
          saveStatus={saveStatus}
        />

        {/* Product Editor Panel */}
        <ProductEditorPanel
          isOpen={productPanelOpen}
          productId={selectedProductId}
          categoryId={categoryId}
          categorySlug={watch('slug')}
          authors={authors}
          onClose={closeProductPanel}
          onSave={handleProductSave}
        />
      </div>
    </FormProvider>
  );
}
