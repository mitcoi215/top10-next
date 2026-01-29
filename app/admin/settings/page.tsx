'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Author {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

interface TrendingItem {
  categoryId: string;
  title: string;
  description: string;
  articleIds: string[];
}

interface BrandLogo {
  name: string;
  logo: string;
}

interface SettingsFormData {
  heroTaglinePrefix: string;
  heroTaglineHighlight: string;
  heroTaglineSuffix: string;
  heroTitle: string;
  heroSubtitle: string;
  featuredCategoryIds: string[];
  trendingItems: TrendingItem[];
  statsListsCount: string;
  statsHoursCount: string;
  statsDecisionsCount: string;
  expertIds: string[];
  missionTitle: string;
  missionContent: string;
  brandLogos: BrandLogo[];
}

// Tab definitions
const TABS = [
  { id: 'hero', label: 'Banner & Danh mục', icon: '🏠' },
  { id: 'stats', label: 'Thống kê & Chuyên gia', icon: '📊' },
  { id: 'content', label: 'Nội dung & Thương hiệu', icon: '✨' },
];

// Helper to parse heroTagline into parts
const parseHeroTagline = (tagline: string) => {
  const match = tagline.match(/^(.*?)<span>(.*?)<\/span>(.*)$/);
  if (match) {
    return {
      prefix: match[1].trim(),
      highlight: match[2].trim(),
      suffix: match[3].trim(),
    };
  }
  return { prefix: tagline, highlight: '', suffix: '' };
};

// Helper to build heroTagline from parts
const buildHeroTagline = (prefix: string, highlight: string, suffix: string) => {
  if (!highlight) {
    return `${prefix} ${suffix}`.trim();
  }
  return `${prefix} <span>${highlight}</span> ${suffix}`.trim();
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [uploadingAuthor, setUploadingAuthor] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<number | null>(null);

  // New author modal state
  const [showNewAuthorModal, setShowNewAuthorModal] = useState(false);
  const [newAuthorData, setNewAuthorData] = useState({ name: '', title: '', avatar: '' });
  const [creatingAuthor, setCreatingAuthor] = useState(false);
  const [uploadingNewAvatar, setUploadingNewAvatar] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { isDirty } } = useForm<SettingsFormData>({
    defaultValues: {
      heroTaglinePrefix: '',
      heroTaglineHighlight: '',
      heroTaglineSuffix: '',
      heroTitle: '',
      heroSubtitle: '',
      featuredCategoryIds: [],
      trendingItems: [],
      statsListsCount: '',
      statsHoursCount: '',
      statsDecisionsCount: '',
      expertIds: [],
      missionTitle: '',
      missionContent: '',
      brandLogos: [],
    },
  });

  const featuredCategoryIds = watch('featuredCategoryIds') || [];
  const expertIds = watch('expertIds') || [];
  const brandLogos = watch('brandLogos') || [];
  const heroTaglinePrefix = watch('heroTaglinePrefix') || '';
  const heroTaglineHighlight = watch('heroTaglineHighlight') || '';
  const heroTaglineSuffix = watch('heroTaglineSuffix') || '';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes, authorsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/authors'),
      ]);

      const settings = await settingsRes.json();
      const categoriesData = await categoriesRes.json();
      const authorsData = authorsRes.ok ? await authorsRes.json() : [];

      setCategories(categoriesData);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);

      const taglineParts = parseHeroTagline(settings.heroTagline || '');

      reset({
        heroTaglinePrefix: taglineParts.prefix,
        heroTaglineHighlight: taglineParts.highlight,
        heroTaglineSuffix: taglineParts.suffix,
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        featuredCategoryIds: settings.featuredCategoryIds || [],
        trendingItems: settings.trendingItems || [],
        statsListsCount: settings.statsListsCount || '',
        statsHoursCount: settings.statsHoursCount || '',
        statsDecisionsCount: settings.statsDecisionsCount || '',
        expertIds: settings.expertIds || [],
        missionTitle: settings.missionTitle || '',
        missionContent: settings.missionContent || '',
        brandLogos: settings.brandLogos || [],
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = CLOUDINARY_CONFIG.cloudName;
    const uploadPreset = CLOUDINARY_CONFIG.uploadPreset;

    if (!cloudName || !uploadPreset) {
      alert('Cloudinary configuration missing.');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      if (response.ok) {
        const data = await response.json();
        return data.secure_url;
      }
      return null;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  const handleAuthorAvatarUpload = async (authorId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingAuthor(authorId);
    const imageUrl = await uploadToCloudinary(file);

    if (imageUrl) {
      const token = localStorage.getItem('admin_token');
      try {
        const response = await fetch(`/api/authors/${authorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar: imageUrl }),
        });

        if (response.ok) {
          setAuthors(authors.map(a =>
            a.id === authorId ? { ...a, avatar: imageUrl } : a
          ));
        } else {
          alert('Failed to update author avatar');
        }
      } catch (error) {
        console.error('Failed to update author:', error);
        alert('Failed to update author avatar');
      }
    }

    setUploadingAuthor(null);
  };

  const handleLogoUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingLogo(index);
    const imageUrl = await uploadToCloudinary(file);

    if (imageUrl) {
      updateBrandLogo(index, 'logo', imageUrl);
    }

    setUploadingLogo(null);
  };

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    setSaveStatus('idle');

    try {
      const token = localStorage.getItem('admin_token');

      const heroTagline = buildHeroTagline(
        data.heroTaglinePrefix,
        data.heroTaglineHighlight,
        data.heroTaglineSuffix
      );

      const cleanedData = {
        heroTagline,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        featuredCategoryIds: data.featuredCategoryIds,
        trendingItems: data.trendingItems.filter(item => item.categoryId && item.title),
        statsListsCount: data.statsListsCount,
        statsHoursCount: data.statsHoursCount,
        statsDecisionsCount: data.statsDecisionsCount,
        expertIds: data.expertIds,
        missionTitle: data.missionTitle,
        missionContent: data.missionContent,
        brandLogos: data.brandLogos.filter(logo => logo.name && logo.logo),
      };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMsg = `Failed to save (${response.status})`;
        if (errorData.issues && errorData.issues.length > 0) {
          errorMsg = errorData.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('\n');
        } else if (errorData.error) {
          errorMsg = errorData.error;
        }
        throw new Error(errorMsg);
      }

      setSaveStatus('saved');
      setErrorMessage('');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const current = featuredCategoryIds;
    if (current.includes(categoryId)) {
      setValue('featuredCategoryIds', current.filter(id => id !== categoryId), { shouldDirty: true });
    } else {
      setValue('featuredCategoryIds', [...current, categoryId], { shouldDirty: true });
    }
  };

  const toggleExpert = (authorId: string) => {
    const current = expertIds;
    if (current.includes(authorId)) {
      setValue('expertIds', current.filter(id => id !== authorId), { shouldDirty: true });
    } else {
      setValue('expertIds', [...current, authorId], { shouldDirty: true });
    }
  };

  const addBrandLogo = () => {
    setValue('brandLogos', [...brandLogos, { name: '', logo: '' }], { shouldDirty: true });
  };

  const removeBrandLogo = (index: number) => {
    setValue('brandLogos', brandLogos.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const updateBrandLogo = (index: number, field: 'name' | 'logo', value: string) => {
    const updated = [...brandLogos];
    updated[index] = { ...updated[index], [field]: value };
    setValue('brandLogos', updated, { shouldDirty: true });
  };

  const handleNewAuthorAvatarUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadingNewAvatar(true);
    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setNewAuthorData({ ...newAuthorData, avatar: imageUrl });
    }
    setUploadingNewAvatar(false);
  };

  const handleCreateAuthor = async () => {
    if (!newAuthorData.name.trim()) {
      alert('Name is required');
      return;
    }

    setCreatingAuthor(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAuthorData),
      });

      if (res.ok) {
        const created = await res.json();
        setAuthors([...authors, created]);
        setValue('expertIds', [...expertIds, created.id], { shouldDirty: true });
        setNewAuthorData({ name: '', title: '', avatar: '' });
        setShowNewAuthorModal(false);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create author');
      }
    } catch (error) {
      console.error('Create author failed:', error);
      alert('Failed to create author');
    } finally {
      setCreatingAuthor(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Đang tải cài đặt...</p>
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

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="editor-header">
        <div className="header-left">
          <h1>Cài đặt Trang chủ</h1>
        </div>
        <div className="header-right">
          {saveStatus === 'saving' && <span className="save-status saving">Đang lưu...</span>}
          {saveStatus === 'saved' && <span className="save-status saved">Đã lưu!</span>}
          {saveStatus === 'error' && <span className="save-status error" title={errorMessage}>Lưu thất bại</span>}
          {isDirty && saveStatus === 'idle' && <span className="save-status unsaved">Chưa lưu thay đổi</span>}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="editor-form">
        <div className="tab-content">
          {/* Tab 1: Hero & Categories */}
          {activeTab === 'hero' && (
            <>
              {/* Hero Section */}
              <div className="section">
                <h2>Tiêu đề Banner chính</h2>
                <p className="section-desc">
                  📍 <strong>Hiển thị tại:</strong> Banner lớn đầu trang chủ - dòng chữ chính giữa màn hình
                </p>

                <div className="hero-tagline-editor">
                  <div className="tagline-preview">
                    <span className="preview-label">Xem trước:</span>
                    <span className="preview-text">
                      {heroTaglinePrefix}{' '}
                      {heroTaglineHighlight && (
                        <span className="highlight">{heroTaglineHighlight}</span>
                      )}{' '}
                      {heroTaglineSuffix}
                    </span>
                  </div>

                  <div className="tagline-fields">
                    <div className="form-group">
                      <label htmlFor="heroTaglinePrefix">Phần đầu</label>
                      <input
                        id="heroTaglinePrefix"
                        type="text"
                        {...register('heroTaglinePrefix')}
                        placeholder="VD: So sánh và chọn"
                      />
                    </div>
                    <div className="form-group highlight-field">
                      <label htmlFor="heroTaglineHighlight">
                        Từ nổi bật <span className="color-indicator">(màu #FE4A64)</span>
                      </label>
                      <input
                        id="heroTaglineHighlight"
                        type="text"
                        {...register('heroTaglineHighlight')}
                        placeholder="Top10"
                        className="highlight-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="heroTaglineSuffix">Phần cuối</label>
                      <input
                        id="heroTaglineSuffix"
                        type="text"
                        {...register('heroTaglineSuffix')}
                        placeholder="VD: sản phẩm & dịch vụ tốt nhất"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Categories */}
              <div className="section">
                <h2>Danh mục nổi bật</h2>
                <p className="section-desc">
                  📍 <strong>Hiển thị tại:</strong> Menu dropdown trong Hero section - khi người dùng click vào nút chọn danh mục
                </p>

                <div className="categories-grid">
                  {categories.map((category) => (
                    <label key={category.id} className="category-checkbox">
                      <input
                        type="checkbox"
                        checked={featuredCategoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <span className="category-icon">{category.icon && !category.icon.startsWith('/') ? category.icon : ''}</span>
                      <span className="category-name">{category.name}</span>
                    </label>
                  ))}
                </div>
                <div className="selected-count">
                  Đã chọn {featuredCategoryIds.length} danh mục
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Stats & Experts */}
          {activeTab === 'stats' && (
            <>
              {/* Stats Section */}
              <div className="section">
                <h2>Phần thống kê</h2>
                <p className="section-desc">
                  📍 <strong>Hiển thị tại:</strong> Phần giữa trang chủ - hiển thị 3 số liệu thống kê nổi bật (VD: "500+ danh sách", "5,000+ giờ nghiên cứu", "16M+ quyết định")
                </p>

                <div className="form-grid three-col">
                  <div className="form-group">
                    <label htmlFor="statsListsCount">Số danh sách</label>
                    <input
                      id="statsListsCount"
                      type="text"
                      {...register('statsListsCount')}
                      placeholder="VD: 500+"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="statsHoursCount">Số giờ nghiên cứu</label>
                    <input
                      id="statsHoursCount"
                      type="text"
                      {...register('statsHoursCount')}
                      placeholder="VD: 5,000+"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="statsDecisionsCount">Số quyết định</label>
                    <input
                      id="statsDecisionsCount"
                      type="text"
                      {...register('statsDecisionsCount')}
                      placeholder="VD: 16M+"
                    />
                  </div>
                </div>
              </div>

              {/* Experts Section */}
              <div className="section">
                <div className="section-header">
                  <div>
                    <h2>Chuyên gia nổi bật</h2>
                    <p className="section-desc">
                      📍 <strong>Hiển thị tại:</strong> Phần "Đội ngũ chuyên gia" trên trang chủ - hiển thị ảnh và tên các tác giả/chuyên gia
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-add-author"
                    onClick={() => setShowNewAuthorModal(true)}
                  >
                    + Thêm tác giả
                  </button>
                </div>

                {authors.length > 0 ? (
                  <div className="experts-grid">
                    {authors.map((author) => (
                      <div key={author.id} className="expert-card">
                        <label className="expert-checkbox">
                          <input
                            type="checkbox"
                            checked={expertIds.includes(author.id)}
                            onChange={() => toggleExpert(author.id)}
                          />
                          <div className="expert-info">
                            <span className="expert-name">{author.name}</span>
                            {author.title && <span className="expert-title">{author.title}</span>}
                          </div>
                        </label>

                        <div className="avatar-upload">
                          <label className="avatar-container">
                            {uploadingAuthor === author.id ? (
                              <div className="avatar-loading">
                                <div className="mini-spinner" />
                              </div>
                            ) : (
                              <>
                                {author.avatar ? (
                                  <img src={author.avatar} alt={author.name} className="expert-avatar" />
                                ) : (
                                  <div className="avatar-placeholder">
                                    {author.name.charAt(0)}
                                  </div>
                                )}
                                <div className="avatar-overlay">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                  </svg>
                                </div>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden-input"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAuthorAvatarUpload(author.id, file);
                              }}
                              disabled={uploadingAuthor === author.id}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>Chưa có tác giả nào. Thêm tác giả đầu tiên để hiển thị trên trang chủ.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tab 3: Content & Branding */}
          {activeTab === 'content' && (
            <>
              {/* Mission Section */}
              <div className="section">
                <h2>Phần sứ mệnh</h2>
                <p className="section-desc">
                  📍 <strong>Hiển thị tại:</strong> Phần "Về chúng tôi" / "Sứ mệnh" trên trang chủ - giới thiệu mục đích và giá trị của website
                </p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label htmlFor="missionTitle">Tiêu đề sứ mệnh</label>
                    <input
                      id="missionTitle"
                      type="text"
                      {...register('missionTitle')}
                      placeholder="VD: Sứ mệnh của chúng tôi"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="missionContent">Nội dung sứ mệnh</label>
                    <textarea
                      id="missionContent"
                      {...register('missionContent')}
                      placeholder="VD: Chúng tôi giúp hàng triệu người đưa ra quyết định đúng đắn..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Brand Logos */}
              <div className="section">
                <h2>Logo thương hiệu (Được đăng trên)</h2>
                <p className="section-desc">
                  📍 <strong>Hiển thị tại:</strong> Phần "As Seen On" / "Được nhắc đến trên" - hiển thị logo các báo/trang web đã đăng bài về bạn (Forbes, TechCrunch, v.v.)
                </p>

                <div className="brand-logos">
                  {brandLogos.map((logo, index) => (
                    <div key={index} className="brand-logo-item">
                      <div className="logo-upload">
                        <label className="logo-container">
                          {uploadingLogo === index ? (
                            <div className="logo-loading">
                              <div className="mini-spinner" />
                            </div>
                          ) : (
                            <>
                              {logo.logo ? (
                                <img src={logo.logo} alt={logo.name || 'Logo'} className="logo-preview" />
                              ) : (
                                <div className="logo-placeholder">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <polyline points="21 15 16 10 5 21" />
                                  </svg>
                                </div>
                              )}
                              <div className="logo-overlay">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                              </div>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden-input"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(index, file);
                            }}
                            disabled={uploadingLogo === index}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={logo.name}
                        onChange={(e) => updateBrandLogo(index, 'name', e.target.value)}
                        placeholder="Tên thương hiệu (VD: Forbes)"
                        className="brand-name-input"
                      />

                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeBrandLogo(index)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-add" onClick={addBrandLogo}>
                    + Thêm logo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </form>

      {/* New Author Modal */}
      {showNewAuthorModal && (
        <div className="modal-overlay" onClick={() => setShowNewAuthorModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thêm tác giả mới</h3>
              <button type="button" className="btn-close" onClick={() => setShowNewAuthorModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-avatar-section">
                <label className="modal-avatar-upload">
                  {uploadingNewAvatar ? (
                    <div className="modal-avatar-loading">
                      <div className="mini-spinner" />
                    </div>
                  ) : newAuthorData.avatar ? (
                    <img src={newAuthorData.avatar} alt="Avatar" className="modal-avatar-preview" />
                  ) : (
                    <div className="modal-avatar-placeholder">
                      {newAuthorData.name ? newAuthorData.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div className="modal-avatar-overlay">Tải lên</div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleNewAuthorAvatarUpload(file);
                    }}
                    disabled={uploadingNewAvatar}
                  />
                </label>
              </div>

              <div className="modal-form-group">
                <label>Họ tên *</label>
                <input
                  type="text"
                  value={newAuthorData.name}
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>

              <div className="modal-form-group">
                <label>Chức danh / Vai trò</label>
                <input
                  type="text"
                  value={newAuthorData.title}
                  onChange={(e) => setNewAuthorData({ ...newAuthorData, title: e.target.value })}
                  placeholder="VD: Chuyên gia tài chính, Tác giả công nghệ"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setNewAuthorData({ name: '', title: '', avatar: '' });
                  setShowNewAuthorModal(false);
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn-create"
                onClick={handleCreateAuthor}
                disabled={creatingAuthor || !newAuthorData.name.trim()}
              >
                {creatingAuthor ? 'Đang tạo...' : 'Tạo tác giả'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .settings-page {
          max-width: 900px;
          margin: 0 auto;
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

        .header-left h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: #1a1a1a;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .save-status {
          font-size: 14px;
          padding: 4px 12px;
          border-radius: 4px;
        }

        .save-status.saving { color: #6b7280; }
        .save-status.saved { color: #059669; background: #d1fae5; }
        .save-status.error { color: #dc2626; background: #fee2e2; }
        .save-status.unsaved { color: #d97706; background: #fef3c7; }

        .btn-primary {
          padding: 10px 24px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-primary:hover:not(:disabled) {
          background: #e5435b;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .tab-icon {
          font-size: 18px;
        }

        .editor-form {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .tab-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
        }

        .section h2 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1f2937;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .section-header .section-desc {
          margin-bottom: 0;
        }

        .section-desc {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 16px 0;
        }

        /* Hero Tagline Editor */
        .hero-tagline-editor {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tagline-preview {
          background: white;
          padding: 16px 20px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .preview-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-right: 12px;
        }

        .preview-text {
          font-size: 16px;
          font-weight: 500;
          color: #1f2937;
        }

        .preview-text .highlight {
          color: #FE4A64;
          font-weight: 700;
        }

        .tagline-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1.5fr;
          gap: 12px;
        }

        .highlight-field label .color-indicator {
          color: #FE4A64;
          font-size: 11px;
          font-weight: 400;
        }

        .highlight-field .highlight-input {
          border-color: #FE4A64;
          color: #FE4A64;
          font-weight: 600;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .form-grid.three-col {
          grid-template-columns: repeat(3, 1fr);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        input, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
        }

        .category-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }

        .category-checkbox:hover {
          border-color: #FE4A64;
        }

        .category-checkbox input {
          width: 16px;
          height: 16px;
        }

        .category-icon {
          font-size: 18px;
        }

        .category-name {
          font-size: 13px;
          font-weight: 500;
        }

        .selected-count {
          margin-top: 12px;
          font-size: 12px;
          color: #6b7280;
        }

        .btn-add-author {
          padding: 8px 14px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-add-author:hover {
          background: #059669;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
          background: white;
          border-radius: 8px;
        }

        .experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .expert-card {
          background: white;
          border-radius: 8px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid #e5e7eb;
        }

        .expert-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .expert-checkbox input {
          width: 16px;
          height: 16px;
        }

        .expert-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .expert-name {
          font-size: 13px;
          font-weight: 600;
        }

        .expert-title {
          font-size: 11px;
          color: #6b7280;
        }

        .avatar-upload {
          display: flex;
          justify-content: center;
        }

        .avatar-container {
          position: relative;
          width: 64px;
          height: 64px;
          cursor: pointer;
        }

        .expert-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 600;
          color: #6b7280;
        }

        .avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          color: white;
        }

        .avatar-container:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar-loading {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hidden-input {
          display: none;
        }

        .mini-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #FE4A64;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .brand-logos {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .brand-logo-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 14px;
          background: white;
          border-radius: 8px;
          position: relative;
          border: 1px solid #e5e7eb;
        }

        .logo-upload {
          display: flex;
          justify-content: center;
        }

        .logo-container {
          position: relative;
          width: 100%;
          height: 50px;
          cursor: pointer;
          display: block;
        }

        .logo-preview {
          width: 100%;
          height: 50px;
          object-fit: contain;
          background: white;
          border-radius: 4px;
        }

        .logo-placeholder {
          width: 100%;
          height: 50px;
          background: #f3f4f6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
        }

        .logo-overlay {
          position: absolute;
          inset: 0;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          color: white;
        }

        .logo-container:hover .logo-overlay {
          opacity: 1;
        }

        .logo-loading {
          width: 100%;
          height: 50px;
          background: #f3f4f6;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name-input {
          width: 100%;
          font-size: 13px;
        }

        .btn-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 24px;
          height: 24px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 20px 12px;
          background: white;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          color: #6b7280;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
        }

        .btn-add:hover {
          border-color: #FE4A64;
          color: #FE4A64;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .form-grid, .form-grid.three-col, .tagline-fields {
            grid-template-columns: 1fr;
          }
          .section-header {
            flex-direction: column;
            gap: 12px;
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 380px;
          margin: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 22px;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
        }

        .modal-body {
          padding: 18px;
        }

        .modal-avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 18px;
        }

        .modal-avatar-upload {
          position: relative;
          width: 80px;
          height: 80px;
          cursor: pointer;
        }

        .modal-avatar-preview {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .modal-avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 600;
          color: #6b7280;
        }

        .modal-avatar-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
          color: white;
          font-size: 13px;
        }

        .modal-avatar-upload:hover .modal-avatar-overlay {
          opacity: 1;
        }

        .modal-avatar-loading {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-form-group {
          margin-bottom: 14px;
        }

        .modal-form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .modal-form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          padding: 14px 18px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 9px 16px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-create {
          padding: 9px 16px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-create:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
