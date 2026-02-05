'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Search, Twitter, Linkedin, Globe, Mail, Loader2, User, Users, CheckSquare } from 'lucide-react';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary.config';
import {
  Button,
  Input,
  Badge,
  Checkbox,
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Label,
} from '@/components/ui';

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
          comparison = 0;
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
    <div className="space-y-6 animate-fade-in relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-5 px-5 py-3 rounded-xl text-sm font-medium z-[1001] shadow-lg animate-slide-up ${
          notification.type === 'success'
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Header + Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Tác giả</h1>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">{authors.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-48 pl-8 pr-3 text-sm border border-slate-200 rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-') as [SortField, SortDirection];
              setSortField(field);
              setSortDirection(dir);
            }}
            className="h-8 px-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="articles-desc">Nhiều bài nhất</option>
            <option value="articles-asc">Ít bài nhất</option>
          </select>
          <Button onClick={openCreateModal} size="sm" className="h-8 gradient-primary text-white border-0 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" />
            Thêm tác giả
          </Button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg">
          <CheckSquare className="w-4 h-4 text-sky-500" />
          <span className="text-sm font-medium text-sky-700">Đã chọn {selectedIds.size}</span>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} disabled={bulkActionLoading} className="h-7 text-xs">Xóa</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} className="h-7 text-xs">Hủy</Button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-slate-500">Đang tải tác giả...</p>
        </div>
      ) : filteredAndSortedAuthors.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">
            <User className="w-6 h-6" />
          </div>
          <p className="admin-empty-state-title">Chưa có tác giả nào</p>
          <p className="admin-empty-state-text">Thêm tác giả viết bài cho website của bạn.</p>
          <Button onClick={openCreateModal} className="gradient-primary text-white border-0 mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Tạo tác giả đầu tiên
          </Button>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="w-10 p-3 text-left">
                  <Checkbox
                    checked={selectedIds.size === filteredAndSortedAuthors.length && filteredAndSortedAuthors.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(new Set(filteredAndSortedAuthors.map(a => a.id)));
                      } else {
                        setSelectedIds(new Set());
                      }
                    }}
                  />
                </th>
                <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tác giả</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Chức danh</th>
                <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Bài viết</th>
                <th className="p-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Liên kết</th>
                <th className="p-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedAuthors.map((author) => (
                <tr
                  key={author.id}
                  className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${selectedIds.has(author.id) ? 'bg-primary/5' : ''}`}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.has(author.id)}
                      onCheckedChange={() => handleSelect(author.id)}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {author.avatar ? (
                        <Image
                          src={author.avatar}
                          alt={author.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                          {author.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-slate-800">{author.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm text-slate-500">{author.title || '—'}</span>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant="secondary">
                      {author._count?.articles || 0}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center gap-1.5">
                      {author.twitter && (
                        <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                           className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors">
                          <Twitter className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {author.linkedin && (
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer"
                           className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors">
                          <Linkedin className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {author.website && (
                        <a href={author.website} target="_blank" rel="noopener noreferrer"
                           className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                          <Globe className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {author.email && (
                        <a href={`mailto:${author.email}`}
                           className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors">
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {!author.twitter && !author.linkedin && !author.website && !author.email && (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(author)} className="h-8 w-8 text-slate-500 hover:text-slate-700">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAuthor(author.id)}
                              className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Create/Edit */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto !p-4 !gap-3">
          <DialogHeader>
            <DialogTitle className="text-base">{editingAuthor ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Avatar Upload */}
            <div className="flex justify-center">
              <label className="relative w-16 h-16 cursor-pointer group">
                {uploadingAvatar ? (
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : formData.avatar ? (
                  <Image src={formData.avatar} alt="Avatar" width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-xl font-semibold text-white">
                    {formData.name ? formData.name.charAt(0) : '?'}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-medium">
                  Upload
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Thông tin cơ bản</h4>
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">Họ tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Nguyễn Văn A"
                  className="h-8 text-sm"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs">Chức danh / Vai trò</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Chuyên gia tài chính"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio" className="text-xs">Tiểu sử</Label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Mô tả ngắn về tác giả..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-md text-sm resize-y focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider">Liên kết mạng xã hội</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="twitter" className="text-xs">Twitter/X</Label>
                  <Input
                    id="twitter"
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="linkedin" className="text-xs">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="website" className="text-xs">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tacgia@example.com"
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit" disabled={saving} className="gradient-primary text-white border-0">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingAuthor ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
