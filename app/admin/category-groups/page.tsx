'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  showInHero?: boolean;
  groupId?: string | null;
}

interface AvailableCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  groupId?: string | null;
}

interface CategoryGroup {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  order: number;
  categories: Category[];
}

export default function CategoryGroupsPage() {
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CategoryGroup | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [togglingHero, setTogglingHero] = useState<string | null>(null);
  const [removingCategory, setRemovingCategory] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState<string | null>(null); // groupId
  const [availableCategories, setAvailableCategories] = useState<AvailableCategory[]>([]);
  const [addingCategory, setAddingCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    order: 0,
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/category-groups');
      const data = await res.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormData({ name: '', icon: '', order: groups.length + 1 });
    setShowModal(true);
  };

  const openEditModal = (group: CategoryGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      icon: group.icon || '',
      order: group.order,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setFormData({ name: '', icon: '', order: 0 });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (SVG, PNG, JPG)
    const validTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload an SVG, PNG, JPG, or WebP image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB');
      return;
    }

    setUploadingIcon(true);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    uploadFormData.append('folder', CLOUDINARY_CONFIG.folder + '/category-icons');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: uploadFormData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, icon: data.secure_url });
      } else {
        const error = await res.json();
        alert(error.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingIcon(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeIcon = () => {
    setFormData({ ...formData, icon: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('admin_token');

    try {
      if (editingGroup) {
        // Update existing
        const res = await fetch(`/api/category-groups/${editingGroup.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const updated = await res.json();
          setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, ...updated } : g));
          closeModal();
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to update');
        }
      } else {
        // Create new
        const res = await fetch('/api/category-groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const created = await res.json();
          setGroups([...groups, { ...created, categories: [] }]);
          closeModal();
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to create');
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const deleteGroup = async (id: string) => {
    const group = groups.find(g => g.id === id);
    if (group?.categories.length) {
      alert(`Cannot delete "${group.name}" - it has ${group.categories.length} categories. Move or delete them first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this group?')) return;

    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/category-groups/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setGroups(groups.filter(g => g.id !== id));
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const moveGroup = async (id: string, direction: 'up' | 'down') => {
    const index = groups.findIndex(g => g.id === id);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === groups.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newGroups = [...groups];
    const [moved] = newGroups.splice(index, 1);
    newGroups.splice(newIndex, 0, moved);

    // Update orders
    const token = localStorage.getItem('admin_token');
    const updatedGroups = newGroups.map((g, i) => ({ ...g, order: i + 1 }));
    setGroups(updatedGroups);

    // Save new orders
    for (const g of updatedGroups) {
      await fetch(`/api/category-groups/${g.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order: g.order }),
      });
    }
  };

  const toggleExpand = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleShowInHero = async (categoryId: string, currentValue: boolean) => {
    setTogglingHero(categoryId);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ showInHero: !currentValue }),
      });
      if (res.ok) {
        setGroups(groups.map(g => ({
          ...g,
          categories: g.categories.map(c =>
            c.id === categoryId ? { ...c, showInHero: !currentValue } : c
          ),
        })));
      }
    } catch (error) {
      console.error('Toggle showInHero failed:', error);
    } finally {
      setTogglingHero(null);
    }
  };

  const markAllInGroup = async (groupId: string, value: boolean) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    const token = localStorage.getItem('admin_token');
    for (const cat of group.categories) {
      if (cat.showInHero !== value) {
        await fetch(`/api/categories/${cat.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ showInHero: value }),
        });
      }
    }
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, categories: g.categories.map(c => ({ ...c, showInHero: value })) }
        : g
    ));
  };

  // Remove category from group
  const removeCategoryFromGroup = async (categoryId: string, groupId: string) => {
    if (!confirm('Xóa danh mục này khỏi nhóm?')) return;

    setRemovingCategory(categoryId);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId: null }),
      });

      if (res.ok) {
        setGroups(groups.map(g =>
          g.id === groupId
            ? { ...g, categories: g.categories.filter(c => c.id !== categoryId) }
            : g
        ));
      } else {
        alert('Không thể xóa danh mục khỏi nhóm');
      }
    } catch (error) {
      console.error('Remove category failed:', error);
      alert('Lỗi khi xóa danh mục');
    } finally {
      setRemovingCategory(null);
    }
  };

  // Open add category modal
  const openAddCategoryModal = async (groupId: string) => {
    setShowAddCategoryModal(groupId);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      // Filter categories not in any group or in this group
      const available = (Array.isArray(data) ? data : []).filter(
        (cat: AvailableCategory) => !cat.groupId || cat.groupId === groupId
      );
      setAvailableCategories(available);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Add category to group
  const addCategoryToGroup = async (categoryId: string, groupId: string) => {
    setAddingCategory(true);
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ groupId: groupId, showInHero: true }),
      });

      if (res.ok) {
        const updatedCategory = await res.json();
        // Add to local state
        setGroups(groups.map(g =>
          g.id === groupId
            ? { ...g, categories: [...g.categories, { ...updatedCategory, showInHero: true }] }
            : g
        ));
        // Remove from available list
        setAvailableCategories(availableCategories.filter(c => c.id !== categoryId));
      } else {
        alert('Không thể thêm danh mục vào nhóm');
      }
    } catch (error) {
      console.error('Add category failed:', error);
      alert('Lỗi khi thêm danh mục');
    } finally {
      setAddingCategory(false);
    }
  };

  return (
    <div className="groups-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Nhóm danh mục</h1>
          <span className="count">{groups.length} nhóm</span>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          + Thêm nhóm
        </button>
      </div>

      {/* Info Box */}
      <div className="info-box">
        📍 <strong>Hiển thị tại:</strong> Dropdown trong Hero section trang chủ - phân loại các danh mục theo nhóm (VD: Lifestyle, Health & Wellness, Business...)
      </div>

      {loading ? (
        <div className="loading">Đang tải nhóm...</div>
      ) : groups.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có nhóm danh mục nào.</p>
          <button onClick={openCreateModal} className="btn-primary">
            Tạo nhóm đầu tiên
          </button>
        </div>
      ) : (
        <div className="groups-list">
          {groups.map((group, index) => (
            <React.Fragment key={group.id}>
            <div className="group-card">
              <div className="group-order">
                <button
                  onClick={() => moveGroup(group.id, 'up')}
                  disabled={index === 0}
                  className="btn-move"
                >
                  ▲
                </button>
                <span>{group.order}</span>
                <button
                  onClick={() => moveGroup(group.id, 'down')}
                  disabled={index === groups.length - 1}
                  className="btn-move"
                >
                  ▼
                </button>
              </div>

              <div className="group-icon">
                {group.icon ? (
                  group.icon.startsWith('/') || group.icon.startsWith('http') ? (
                    <Image src={group.icon} alt={group.name} width={40} height={40} />
                  ) : (
                    <span className="emoji">{group.icon}</span>
                  )
                ) : (
                  <span className="emoji">📁</span>
                )}
              </div>

              <div className="group-info">
                <h3>{group.name}</h3>
                <span className="group-slug">/{group.slug}</span>
                <span className="category-count">
                  {group.categories.length} danh mục
                </span>
              </div>

              <div className="group-categories-summary">
                <span className="hero-count">
                  {group.categories.filter(c => c.showInHero).length}/{group.categories.length} hiện Hero
                </span>
              </div>

              <div className="group-actions">
                <button onClick={() => toggleExpand(group.id)} className="btn-expand">
                  {expandedGroups.has(group.id) ? '▾ Thu gọn' : '▸ Chi tiết'}
                </button>
                <button onClick={() => openEditModal(group)} className="btn-edit">
                  Sửa
                </button>
                <button onClick={() => deleteGroup(group.id)} className="btn-delete">
                  Xóa
                </button>
              </div>
            </div>

            {/* Expanded category list with showInHero toggles */}
            {expandedGroups.has(group.id) && (
              <div className="group-expanded">
                <div className="expanded-header">
                  <span>Danh mục trong nhóm <strong>{group.name}</strong></span>
                  <div className="bulk-actions">
                    <button onClick={() => openAddCategoryModal(group.id)} className="btn-add-cat">+ Thêm danh mục</button>
                    <button onClick={() => markAllInGroup(group.id, true)} className="btn-mark-all">Bật tất cả</button>
                    <button onClick={() => markAllInGroup(group.id, false)} className="btn-mark-all off">Tắt tất cả</button>
                  </div>
                </div>
                {group.categories.length === 0 ? (
                  <div className="no-cats">
                    Chưa có danh mục nào trong nhóm này.
                    <button onClick={() => openAddCategoryModal(group.id)} className="btn-add-first">+ Thêm danh mục đầu tiên</button>
                  </div>
                ) : (
                  <div className="cat-list">
                    {group.categories.map(cat => (
                      <div key={cat.id} className="cat-row">
                        <span className="cat-icon">
                          {cat.icon && (cat.icon.startsWith('/') || cat.icon.startsWith('http')) ? (
                            <Image src={cat.icon} alt="" width={20} height={20} className="cat-icon-img" />
                          ) : (
                            cat.icon || '📁'
                          )}
                        </span>
                        <span className="cat-name">{cat.name}</span>
                        <span className="cat-slug">/{cat.slug}</span>
                        <div className="cat-actions">
                          <label className="toggle-label">
                            <span className="toggle-text">{cat.showInHero ? 'Hiện' : 'Ẩn'}</span>
                            <button
                              className={`toggle-btn ${cat.showInHero ? 'on' : 'off'}`}
                              onClick={() => toggleShowInHero(cat.id, !!cat.showInHero)}
                              disabled={togglingHero === cat.id}
                            >
                              <span className="toggle-knob" />
                            </button>
                          </label>
                          <button
                            className="btn-remove-cat"
                            onClick={() => removeCategoryFromGroup(cat.id, group.id)}
                            disabled={removingCategory === cat.id}
                            title="Xóa khỏi nhóm"
                          >
                            {removingCategory === cat.id ? '...' : '✕'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGroup ? 'Chỉnh sửa nhóm' : 'Thêm nhóm mới'}</h2>
              <button onClick={closeModal} className="btn-close">×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="name">Tên nhóm *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Lifestyle, Business"
                  required
                />
              </div>

              <div className="form-group">
                <label>Hình ảnh Icon</label>
                <div className="icon-upload-area">
                  {formData.icon ? (
                    <div className="icon-preview">
                      {formData.icon.startsWith('/') || formData.icon.startsWith('http') ? (
                        <Image src={formData.icon} alt="Icon preview" width={60} height={60} />
                      ) : (
                        <span className="emoji-large">{formData.icon}</span>
                      )}
                      <button type="button" onClick={removeIcon} className="btn-remove-icon">
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <span>Chưa có icon</span>
                    </div>
                  )}
                  <div className="upload-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
                      onChange={handleIconUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingIcon}
                      className="btn-upload"
                    >
                      {uploadingIcon ? 'Đang tải...' : 'Tải lên hình ảnh'}
                    </button>
                    <span className="upload-hint">SVG, PNG, JPG (tối đa 2MB)</span>
                  </div>
                </div>
                <div className="or-divider">
                  <span>hoặc nhập emoji</span>
                </div>
                <input
                  id="icon"
                  type="text"
                  value={formData.icon.startsWith('/') || formData.icon.startsWith('http') ? '' : formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="VD: 🌟, 💼, 🏠"
                  disabled={formData.icon.startsWith('/') || formData.icon.startsWith('http')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="order">Thứ tự</label>
                <input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min={1}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="btn-save">
                  {saving ? 'Đang lưu...' : editingGroup ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Add Category to Group */}
      {showAddCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowAddCategoryModal(null)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Thêm danh mục vào nhóm</h2>
              <button onClick={() => setShowAddCategoryModal(null)} className="btn-close">×</button>
            </div>
            <div className="modal-body">
              {availableCategories.filter(c => !c.groupId).length === 0 ? (
                <div className="no-available">
                  <p>Không có danh mục nào khả dụng để thêm.</p>
                  <p className="hint">Tất cả danh mục đã thuộc về một nhóm hoặc chưa có danh mục nào được tạo.</p>
                </div>
              ) : (
                <div className="available-cats">
                  <p className="available-hint">Chọn danh mục để thêm vào nhóm:</p>
                  {availableCategories.filter(c => !c.groupId).map(cat => (
                    <div key={cat.id} className="available-cat-row">
                      <span className="cat-icon">
                        {cat.icon && (cat.icon.startsWith('/') || cat.icon.startsWith('http')) ? (
                          <Image src={cat.icon} alt="" width={20} height={20} className="cat-icon-img" />
                        ) : (
                          cat.icon || '📁'
                        )}
                      </span>
                      <span className="cat-name">{cat.name}</span>
                      <span className="cat-slug">/{cat.slug}</span>
                      <button
                        className="btn-add-to-group"
                        onClick={() => addCategoryToGroup(cat.id, showAddCategoryModal)}
                        disabled={addingCategory}
                      >
                        {addingCategory ? '...' : '+ Thêm'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .groups-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
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

        .info-box {
          padding: 12px 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 16px;
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

        .loading, .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-state p {
          margin-bottom: 16px;
        }

        .groups-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .group-card {
          background: white;
          border-radius: 8px;
          padding: 16px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .group-order {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 40px;
        }

        .group-order span {
          font-weight: 600;
          color: #6b7280;
        }

        .btn-move {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 10px;
          padding: 2px;
        }

        .btn-move:hover:not(:disabled) {
          color: #374151;
        }

        .btn-move:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .group-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          border-radius: 8px;
          overflow: hidden;
        }

        .group-icon img {
          max-width: 40px;
          max-height: 40px;
          object-fit: contain;
        }

        .group-icon .emoji {
          font-size: 28px;
        }

        .group-info {
          flex: 1;
          min-width: 150px;
        }

        .group-info h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .group-slug {
          font-size: 12px;
          color: #9ca3af;
          font-family: monospace;
          display: block;
        }

        .category-count {
          font-size: 12px;
          color: #6b7280;
        }

        .group-categories-summary {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-count {
          font-size: 13px;
          color: #6b7280;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 3px 10px;
          border-radius: 12px;
        }

        .group-actions {
          display: flex;
          gap: 8px;
        }

        .btn-expand {
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .btn-expand:hover {
          background: #dbeafe;
        }

        .group-expanded {
          background: #f9fafb;
          border-radius: 0 0 8px 8px;
          margin-top: -8px;
          padding: 16px 20px;
          border: 1px solid #e5e7eb;
          border-top: none;
        }

        .expanded-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;
          color: #374151;
        }

        .bulk-actions {
          display: flex;
          gap: 8px;
        }

        .btn-mark-all {
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-mark-all.off {
          background: #6b7280;
        }

        .btn-mark-all:hover {
          opacity: 0.9;
        }

        .btn-add-cat {
          padding: 4px 12px;
          font-size: 12px;
          border-radius: 4px;
          cursor: pointer;
          background: #3b82f6;
          color: white;
          border: none;
        }

        .btn-add-cat:hover {
          background: #2563eb;
        }

        .no-cats {
          font-size: 13px;
          color: #9ca3af;
          text-align: center;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .btn-add-first {
          padding: 8px 16px;
          font-size: 13px;
          border-radius: 6px;
          cursor: pointer;
          background: #3b82f6;
          color: white;
          border: none;
        }

        .btn-add-first:hover {
          background: #2563eb;
        }

        .cat-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .cat-row:hover {
          border-color: #d1d5db;
        }

        .cat-icon {
          font-size: 18px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-icon :global(.cat-icon-img) {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .cat-name {
          font-size: 14px;
          font-weight: 500;
          min-width: 150px;
        }

        .cat-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .btn-remove-cat {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-remove-cat:hover {
          background: #fecaca;
        }

        .btn-remove-cat:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cat-slug {
          font-size: 12px;
          color: #9ca3af;
          font-family: monospace;
          flex: 1;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .toggle-text {
          font-size: 12px;
          color: #6b7280;
          min-width: 30px;
        }

        .toggle-btn {
          position: relative;
          width: 40px;
          height: 22px;
          border-radius: 11px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          padding: 0;
        }

        .toggle-btn.on {
          background: #10b981;
        }

        .toggle-btn.off {
          background: #d1d5db;
        }

        .toggle-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          transition: left 0.2s;
        }

        .toggle-btn.on .toggle-knob {
          left: 20px;
        }

        .toggle-btn.off .toggle-knob {
          left: 2px;
        }

        .btn-edit, .btn-delete {
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-edit {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-edit:hover {
          background: #e5e7eb;
        }

        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
          border: none;
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
        }

        .modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          margin: 20px;
        }

        .modal.modal-wide {
          max-width: 550px;
        }

        .modal-body {
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        }

        .no-available {
          text-align: center;
          padding: 24px;
          color: #6b7280;
        }

        .no-available .hint {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 8px;
        }

        .available-cats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .available-hint {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .available-cat-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: #f9fafb;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .available-cat-row:hover {
          border-color: #d1d5db;
          background: #f3f4f6;
        }

        .btn-add-to-group {
          margin-left: auto;
          padding: 6px 14px;
          font-size: 13px;
          border-radius: 4px;
          cursor: pointer;
          background: #10b981;
          color: white;
          border: none;
        }

        .btn-add-to-group:hover {
          background: #059669;
        }

        .btn-add-to-group:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 24px;
          color: #6b7280;
          cursor: pointer;
        }

        .modal-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #FE4A64;
          box-shadow: 0 0 0 3px rgba(254, 74, 100, 0.1);
        }

        .icon-upload-area {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 8px;
        }

        .icon-preview {
          position: relative;
          width: 80px;
          height: 80px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
          overflow: hidden;
        }

        .icon-preview img {
          max-width: 60px;
          max-height: 60px;
          object-fit: contain;
        }

        .emoji-large {
          font-size: 40px;
        }

        .btn-remove-icon {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ef4444;
          color: white;
          border: none;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-placeholder {
          width: 80px;
          height: 80px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 12px;
        }

        .upload-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-upload {
          padding: 8px 16px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
        }

        .btn-upload:hover:not(:disabled) {
          background: #e5e7eb;
        }

        .btn-upload:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-hint {
          font-size: 11px;
          color: #9ca3af;
        }

        .or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px 0;
        }

        .or-divider::before,
        .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .or-divider span {
          font-size: 12px;
          color: #9ca3af;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
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

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .group-card {
            flex-wrap: wrap;
          }
          .group-categories {
            width: 100%;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}
