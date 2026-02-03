'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import FullHtmlRichTextEditor from '@/components/admin/FullHtmlRichTextEditor';

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  updatedAt: string;
}

export default function EditStaticPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const isNew = slug === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    slug: '',
    title: '',
    description: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
  });

  const getToken = () => localStorage.getItem('admin_token') || '';

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/static-pages/${slug}`)
        .then(res => res.json())
        .then((page: StaticPage) => {
          setForm({
            slug: page.slug,
            title: page.title,
            description: page.description || '',
            content: page.content || '',
            metaTitle: page.metaTitle || '',
            metaDescription: page.metaDescription || '',
          });
        })
        .catch(() => setMessage('Failed to load page'))
        .finally(() => setLoading(false));
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    if (isNew && (!form.slug || !form.title)) {
      setMessage('Slug and title are required');
      return;
    }
    if (!isNew && !form.title) {
      setMessage('Title is required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const url = isNew ? '/api/static-pages' : `/api/static-pages/${slug}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...(isNew && { slug: form.slug }),
          title: form.title,
          description: form.description || null,
          content: form.content,
          metaTitle: form.metaTitle || null,
          metaDescription: form.metaDescription || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      setMessage('Saved!');
      if (isNew) {
        router.push(`/admin/static-pages/${form.slug}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this page?')) return;
    try {
      await fetch(`/api/static-pages/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      router.push('/admin/static-pages');
    } catch {
      setMessage('Error deleting page');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/static-pages" className="text-gray-500 hover:text-gray-700 text-lg">
            &larr;
          </Link>
          <h2 className="text-xl font-bold">
            {isNew ? 'New Static Page' : `Edit: ${form.title}`}
          </h2>
          {!isNew && (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener"
              className="text-sm text-pink-500 hover:underline"
            >
              View page &rarr;
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isNew && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 text-sm font-medium"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Content Editor */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">Content</h3>
            </div>
            <div className="p-4">
              <FullHtmlRichTextEditor
                value={form.content || ''}
                onChange={(content) => setForm({ ...form, content })}
                placeholder="Start writing your page content..."
                minHeight="400px"
                maxHeight="600px"
              />
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-4">
          {/* Page Info */}
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Page Info</h3>

            {isNew && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="about-us"
                />
              </div>
            )}

            {!isNew && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-600">/{slug}</div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
              <input
                type="text"
                value={form.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
              <textarea
                value={form.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={3}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">SEO</h3>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Meta Title</label>
              <input
                type="text"
                value={form.metaTitle || ''}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder={form.title || 'Page title'}
              />
              <p className="text-xs text-gray-400 mt-1">{(form.metaTitle || '').length}/60</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Meta Description</label>
              <textarea
                value={form.metaDescription || ''}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm"
                rows={3}
                placeholder={form.description || 'Page description'}
              />
              <p className="text-xs text-gray-400 mt-1">{(form.metaDescription || '').length}/160</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
