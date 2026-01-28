'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Author {
  id: string;
  name: string;
  avatar?: string;
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const { register, handleSubmit, watch, setValue, reset } = useForm<SettingsFormData>({
    defaultValues: {
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes, authorsRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/categories'),
        fetch('/api/authors').catch(() => ({ json: () => [] })),
      ]);

      const settings = await settingsRes.json();
      const categoriesData = await categoriesRes.json();
      const authorsData = await authorsRes.json();

      setCategories(categoriesData);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);

      // Reset form with fetched data
      reset({
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

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true);
    setSaveStatus('idle');

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading settings...</p>
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
      <div className="page-header">
        <h1>Homepage Settings</h1>
        <div className="header-actions">
          {saveStatus === 'saved' && <span className="save-status saved">Saved!</span>}
          {saveStatus === 'error' && <span className="save-status error">Save failed</span>}
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
        {/* Hero Section */}
        <div className="section">
          <h2>Hero Section</h2>
          <p className="section-desc">Main banner content on the homepage</p>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="heroTitle">Hero Title</label>
              <input
                id="heroTitle"
                type="text"
                {...register('heroTitle')}
                placeholder="Find the Best Products & Services"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="heroSubtitle">Hero Subtitle</label>
              <textarea
                id="heroSubtitle"
                {...register('heroSubtitle')}
                placeholder="Expert reviews and comparisons..."
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="section">
          <h2>Featured Categories</h2>
          <p className="section-desc">Categories shown in the hero dropdown</p>

          <div className="categories-grid">
            {categories.map((category) => (
              <label key={category.id} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={featuredCategoryIds.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </label>
            ))}
          </div>
          <div className="selected-count">
            {featuredCategoryIds.length} categories selected
          </div>
        </div>

        {/* Stats Section */}
        <div className="section">
          <h2>Stats Section</h2>
          <p className="section-desc">Statistics displayed on the homepage</p>

          <div className="form-grid three-col">
            <div className="form-group">
              <label htmlFor="statsListsCount">Lists Count</label>
              <input
                id="statsListsCount"
                type="text"
                {...register('statsListsCount')}
                placeholder="500+"
              />
            </div>

            <div className="form-group">
              <label htmlFor="statsHoursCount">Hours Count</label>
              <input
                id="statsHoursCount"
                type="text"
                {...register('statsHoursCount')}
                placeholder="5,000+"
              />
            </div>

            <div className="form-group">
              <label htmlFor="statsDecisionsCount">Decisions Count</label>
              <input
                id="statsDecisionsCount"
                type="text"
                {...register('statsDecisionsCount')}
                placeholder="16M+"
              />
            </div>
          </div>
        </div>

        {/* Experts Section */}
        {authors.length > 0 && (
          <div className="section">
            <h2>Featured Experts</h2>
            <p className="section-desc">Authors to feature on the homepage</p>

            <div className="experts-grid">
              {authors.map((author) => (
                <label key={author.id} className="expert-checkbox">
                  <input
                    type="checkbox"
                    checked={expertIds.includes(author.id)}
                    onChange={() => toggleExpert(author.id)}
                  />
                  {author.avatar && <img src={author.avatar} alt={author.name} className="expert-avatar" />}
                  <span className="expert-name">{author.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Mission Section */}
        <div className="section">
          <h2>Mission Section</h2>
          <p className="section-desc">About us content on the homepage</p>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="missionTitle">Mission Title</label>
              <input
                id="missionTitle"
                type="text"
                {...register('missionTitle')}
                placeholder="Our Mission"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="missionContent">Mission Content</label>
              <textarea
                id="missionContent"
                {...register('missionContent')}
                placeholder="We help millions of people..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Brand Logos */}
        <div className="section">
          <h2>Brand Logos (As Seen On)</h2>
          <p className="section-desc">Logos of publications that have featured your site</p>

          <div className="brand-logos">
            {brandLogos.map((logo, index) => (
              <div key={index} className="brand-logo-item">
                <input
                  type="text"
                  value={logo.name}
                  onChange={(e) => updateBrandLogo(index, 'name', e.target.value)}
                  placeholder="Brand name (e.g., Forbes)"
                />
                <input
                  type="text"
                  value={logo.logo}
                  onChange={(e) => updateBrandLogo(index, 'logo', e.target.value)}
                  placeholder="Logo URL"
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeBrandLogo(index)}
                >
                  x
                </button>
              </div>
            ))}
            <button type="button" className="btn-add" onClick={addBrandLogo}>
              + Add Brand Logo
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .settings-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .page-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .save-status {
          font-size: 14px;
          padding: 4px 12px;
          border-radius: 4px;
        }

        .save-status.saved {
          color: #059669;
          background: #d1fae5;
        }

        .save-status.error {
          color: #dc2626;
          background: #fee2e2;
        }

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

        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .section {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .section h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .section-desc {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
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
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        input, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
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
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .category-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .category-checkbox:hover {
          background: #f3f4f6;
        }

        .category-checkbox input {
          width: 18px;
          height: 18px;
        }

        .category-icon {
          font-size: 20px;
        }

        .category-name {
          font-size: 14px;
          font-weight: 500;
        }

        .selected-count {
          margin-top: 12px;
          font-size: 13px;
          color: #6b7280;
        }

        .experts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .expert-checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 6px;
          cursor: pointer;
        }

        .expert-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .expert-name {
          font-size: 14px;
          font-weight: 500;
        }

        .brand-logos {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .brand-logo-item {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .brand-logo-item input {
          flex: 1;
        }

        .btn-remove {
          width: 36px;
          height: 36px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 6px;
          font-size: 18px;
          cursor: pointer;
        }

        .btn-remove:hover {
          background: #fecaca;
        }

        .btn-add {
          padding: 12px;
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 6px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-add:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        @media (max-width: 768px) {
          .form-grid, .form-grid.three-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
