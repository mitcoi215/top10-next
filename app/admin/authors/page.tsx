'use client';

import { useState, useEffect, useMemo } from 'react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';

interface Author {
  id: string;
  name: string;
  slug: string;
  avatar?: string | null;
  title?: string | null;
  bio?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  website?: string | null;
  email?: string | null;
  _count?: {
    articles: number;
  };
}

type SortField = 'name' | 'articles' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
    twitter: '',
    linkedin: '',
    website: '',
    email: '',
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchAuthors = async () => {
    try {
      const res = await fetch('/api/authors');
      const data = await res.json();
      setAuthors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
      setNotification({ type: 'error', message: 'Failed to load authors' });
    } finally {
      setLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedAuthors = useMemo(() => {
    let result = authors.filter(a =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'articles':
          comparison = (a._count?.articles || 0) - (b._count?.articles || 0);
          break;
        case 'createdAt':
          comparison = 0; // Not available in current data
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [authors, searchTerm, sortField, sortDirection]);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setFormData({ name: '', title: '', bio: '', avatar: '', twitter: '', linkedin: '', website: '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      title: author.title || '',
      bio: author.bio || '',
      avatar: author.avatar || '',
      twitter: author.twitter || '',
      linkedin: author.linkedin || '',
      website: author.website || '',
      email: author.email || '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAuthor(null);
    setFormData({ name: '', title: '', bio: '', avatar: '', twitter: '', linkedin: '', website: '', email: '' });
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const cloudName = CLOUDINARY_CONFIG.cloudName;
    const uploadPreset = CLOUDINARY_CONFIG.uploadPreset;

    if (!cloudName || !uploadPreset) {
      setNotification({ type: 'error', message: 'Cloudinary configuration missing' });
      return null;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);
    uploadFormData.append('folder', CLOUDINARY_CONFIG.folder + '/authors');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: uploadFormData }
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotification({ type: 'error', message: 'Please select an image file' });
      return;
    }

    setUploadingAvatar(true);
    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      setFormData({ ...formData, avatar: imageUrl });
      setNotification({ type: 'success', message: 'Image uploaded!' });
    } else {
      setNotification({ type: 'error', message: 'Upload failed' });
    }
    setUploadingAvatar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setNotification({ type: 'error', message: 'Name is required' });
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      if (editingAuthor) {
        const res = await fetch(`/api/authors/${editingAuthor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const updated = await res.json();
          setAuthors(authors.map(a => a.id === editingAuthor.id ? { ...a, ...updated } : a));
          closeModal();
          setNotification({ type: 'success', message: 'Author updated!' });
        } else {
          const error = await res.json();
          setNotification({ type: 'error', message: error.error || 'Failed to update author' });
        }
      } else {
        const res = await fetch('/api/authors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const created = await res.json();
          setAuthors([...authors, created]);
          closeModal();
          setNotification({ type: 'success', message: 'Author created!' });
        } else {
          const error = await res.json();
          setNotification({ type: 'error', message: error.error || 'Failed to create author' });
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      setNotification({ type: 'error', message: 'Failed to save author' });
    } finally {
      setSaving(false);
    }
  };

  const deleteAuthor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this author?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAuthors(authors.filter(a => a.id !== id));
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setNotification({ type: 'success', message: 'Author deleted' });
      } else {
        const error = await res.json();
        setNotification({ type: 'error', message: error.error || 'Failed to delete author' });
      }
    } catch (error) {
      console.error('Failed to delete author:', error);
      setNotification({ type: 'error', message: 'Failed to delete author' });
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedAuthors.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedAuthors.map(a => a.id)));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} author(s)?`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/authors/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setAuthors(authors.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      setNotification({ type: 'success', message: `${selectedIds.size} authors deleted` });
    } catch (error) {
      console.error('Failed to delete authors:', error);
      setNotification({ type: 'error', message: 'Failed to delete authors' });
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Stats
  const totalArticles = authors.reduce((sum, a) => sum + (a._count?.articles || 0), 0);

  return (
    <div className="authors-page">
      {/* Notification Toast */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="page-header">
        <div className="header-left">
          <h1>Tác giả / Chuyên gia</h1>
          <span className="count">{filteredAndSortedAuthors.length} / {authors.length}</span>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          + Thêm tác giả
        </button>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Trang bài viết (tên tác giả, avatar), trang chủ phần "Chuyên gia", trang review sản phẩm
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{authors.length}</span>
          <span className="stat-label">Tổng tác giả</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{totalArticles}</span>
          <span className="stat-label">Tổng bài viết</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{authors.filter(a => a.avatar).length}</span>
          <span className="stat-label">Có avatar</span>
        </div>
      </div>

      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Tìm kiếm tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-') as [SortField, SortDirection];
              setSortField(field);
              setSortDirection(dir);
            }}
            className="sort-select"
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="articles-desc">Nhiều bài nhất</option>
            <option value="articles-asc">Ít bài nhất</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="bulk-actions">
            <span className="selected-count">Đã chọn {selectedIds.size}</span>
            <button
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="bulk-btn delete"
            >
              Xóa
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="bulk-btn cancel"
            >
              Hủy
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải tác giả...</p>
        </div>
      ) : filteredAndSortedAuthors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>Chưa có tác giả nào</h3>
          <p>Thêm tác giả viết bài cho website của bạn.</p>
          <button onClick={openCreateModal} className="btn-primary">
            + Tạo tác giả đầu tiên
          </button>
        </div>
      ) : (
        <div className="authors-grid">
          {filteredAndSortedAuthors.map((author) => (
            <div
              key={author.id}
              className={`author-card ${selectedIds.has(author.id) ? 'selected' : ''}`}
            >
              <div className="card-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.has(author.id)}
                  onChange={() => handleSelect(author.id)}
                />
              </div>

              <div className="author-avatar">
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} />
                ) : (
                  <div className="avatar-placeholder">{author.name.charAt(0)}</div>
                )}
              </div>

              <div className="author-info">
                <h3>{author.name}</h3>
                {author.title && <p className="author-title">{author.title}</p>}

                <div className="author-stats">
                  <span className="stat">
                    <strong>{author._count?.articles || 0}</strong> bài viết
                  </span>
                </div>

                {/* Social Links */}
                <div className="social-links">
                  {author.twitter && (
                    <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="social-link twitter" title="Twitter">
                      𝕏
                    </a>
                  )}
                  {author.linkedin && (
                    <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="LinkedIn">
                      in
                    </a>
                  )}
                  {author.website && (
                    <a href={author.website} target="_blank" rel="noopener noreferrer" className="social-link website" title="Website">
                      🔗
                    </a>
                  )}
                  {author.email && (
                    <a href={`mailto:${author.email}`} className="social-link email" title="Email">
                      ✉
                    </a>
                  )}
                </div>
              </div>

              <div className="author-actions">
                <button onClick={() => openEditModal(author)} className="btn-edit" title="Edit">
                  ✎
                </button>
                <button onClick={() => deleteAuthor(author.id)} className="btn-delete" title="Delete">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAuthor ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</h2>
              <button onClick={closeModal} className="btn-close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="avatar-section">
                <label className="avatar-upload-label">
                  {uploadingAvatar ? (
                    <div className="avatar-loading">
                      <div className="spinner" />
                    </div>
                  ) : formData.avatar ? (
                    <img src={formData.avatar} alt="Avatar" className="preview-avatar" />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {formData.name ? formData.name.charAt(0) : '?'}
                    </div>
                  )}
                  <div className="avatar-overlay">
                    <span>Upload</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden-input"
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              <div className="form-section">
                <h4>Thông tin cơ bản</h4>
                <div className="form-group">
                  <label htmlFor="name">Họ tên *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="title">Chức danh / Vai trò</label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Chuyên gia tài chính, Tác giả công nghệ"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Tiểu sử</label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Mô tả ngắn về tác giả..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Liên kết mạng xã hội</h4>
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="twitter">Twitter/X</label>
                    <input
                      id="twitter"
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      id="linkedin"
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tacgia@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="btn-save">
                  {saving ? 'Đang lưu...' : editingAuthor ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .authors-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          position: relative;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 1001;
          animation: slideIn 0.3s ease;
        }

        .notification.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .notification.error {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-left h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }

        .count {
          font-size: 14px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 4px 12px;
          border-radius: 16px;
        }

        .btn-primary {
          padding: 10px 20px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #e5435b;
        }

        /* Info Box */
        .info-box {
          padding: 12px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 16px;
        }

        /* Stats Bar */
        .stats-bar {
          display: flex;
          gap: 24px;
          padding: 16px 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
        }

        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .search-input {
          min-width: 200px;
          max-width: 300px;
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .sort-select {
          padding: 10px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
        }

        .bulk-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: #f0f9ff;
          border: 1px solid #bae6fd;
          border-radius: 8px;
        }

        .selected-count {
          font-weight: 600;
          color: #0369a1;
          font-size: 14px;
        }

        .bulk-btn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .bulk-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .bulk-btn.cancel {
          background: #f3f4f6;
          color: #374151;
        }

        .loading {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #FE4A64;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          color: #6b7280;
        }

        .authors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .author-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          gap: 16px;
          position: relative;
          transition: box-shadow 0.2s;
        }

        .author-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .author-card.selected {
          box-shadow: 0 0 0 2px #3b82f6;
        }

        .card-checkbox {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .card-checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .author-avatar {
          flex-shrink: 0;
        }

        .author-avatar img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FE4A64, #ff8a9d);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          color: white;
        }

        .author-info {
          flex: 1;
          min-width: 0;
        }

        .author-info h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          padding-right: 30px;
        }

        .author-title {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #6b7280;
        }

        .author-stats {
          margin-bottom: 10px;
        }

        .author-stats .stat {
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .author-stats .stat strong {
          color: #1a1a1a;
        }

        .social-links {
          display: flex;
          gap: 6px;
        }

        .social-link {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.15s;
        }

        .social-link:hover {
          transform: scale(1.1);
        }

        .social-link.twitter {
          background: #1da1f2;
          color: white;
        }

        .social-link.linkedin {
          background: #0077b5;
          color: white;
        }

        .social-link.website {
          background: #f3f4f6;
          color: #374151;
        }

        .social-link.email {
          background: #f3f4f6;
          color: #374151;
        }

        .author-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-self: center;
        }

        .btn-edit, .btn-delete {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-edit {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-edit:hover {
          background: #e5e7eb;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-delete:hover {
          background: #fecaca;
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
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 28px;
          color: #6b7280;
          cursor: pointer;
          line-height: 1;
        }

        .btn-close:hover {
          color: #1f2937;
        }

        .modal-form {
          padding: 24px;
        }

        .avatar-section {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .avatar-upload-label {
          position: relative;
          width: 100px;
          height: 100px;
          cursor: pointer;
        }

        .preview-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-placeholder-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FE4A64, #ff8a9d);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 600;
          color: white;
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
          font-size: 14px;
          font-weight: 500;
        }

        .avatar-upload-label:hover .avatar-overlay {
          opacity: 1;
        }

        .avatar-loading {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top-color: #FE4A64;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .hidden-input {
          display: none;
        }

        .form-section {
          margin-bottom: 24px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .form-section h4 {
          margin: 0 0 16px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          background: white;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .form-group textarea {
          resize: vertical;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-cancel:hover {
          background: #e5e7eb;
        }

        .btn-save {
          padding: 10px 20px;
          background: #FE4A64;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-save:hover:not(:disabled) {
          background: #e5435b;
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .stats-bar {
            flex-wrap: wrap;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .filters {
            flex-direction: column;
          }

          .search-input, .sort-select {
            max-width: none;
          }

          .authors-grid {
            grid-template-columns: 1fr;
          }

          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
