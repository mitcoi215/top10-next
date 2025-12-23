'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import ImageUploader from './ImageUploader';

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => (
    <div className="border rounded-lg p-4 min-h-[300px] bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
      <span className="ml-2 text-gray-600">Loading editor...</span>
    </div>
  ),
});

// Autosave constants
const DRAFT_KEY = 'top10_product_draft';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

// Types for API responses
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  featured: boolean;
  order: number;
}

interface Product {
  id: string;
  rank: number;
  title: string;
  description: string;
  detailedDescription: string | null;
  image: string;
  rating: number | null;
  price: string | null;
  features: string[];
  pros: string[];
  cons: string[];
  affiliateLink: string;
  featured: boolean;
  categoryId: string;
  category?: Category;
  savedAt?: string; // For draft autosave
}

// Helper to get auth header
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function Top10Manager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<Product> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autosave states
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [savedDraft, setSavedDraft] = useState<Partial<Product> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
      // Select first category by default
      if (data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    }
  }, [selectedCategoryId]);

  // Fetch products for selected category
  const fetchProducts = useCallback(async () => {
    if (!selectedCategoryId) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/products?categoryId=${selectedCategoryId}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Load products when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      fetchProducts();
    }
  }, [selectedCategoryId, fetchProducts]);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (!editingItem || !isFormOpen) return;

    // Get current form values
    const formData = formRef.current ? new FormData(formRef.current) : null;
    const draftData = {
      ...editingItem,
      title: formData?.get('title') as string || editingItem.title,
      description: formData?.get('description') as string || editingItem.description,
      affiliateLink: formData?.get('affiliateLink') as string || editingItem.affiliateLink,
      featured: formData?.get('featured') === 'on',
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    setLastSaved(new Date());
  }, [editingItem, isFormOpen]);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        return draft;
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  // Check for saved draft on component mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.title) {
      setSavedDraft(draft);
      setShowDraftModal(true);
    }
  }, [loadDraft]);

  // Autosave every 30 seconds when form is open
  useEffect(() => {
    if (!isFormOpen || !editingItem) return;

    const interval = setInterval(() => {
      saveDraft();
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [isFormOpen, editingItem, saveDraft]);

  // Restore draft
  const handleRestoreDraft = () => {
    if (savedDraft) {
      setEditingItem(savedDraft);
      setIsFormOpen(true);
    }
    setShowDraftModal(false);
    setSavedDraft(null);
  };

  // Discard draft
  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftModal(false);
    setSavedDraft(null);
  };

  const handleAddNew = () => {
    setEditingItem({
      rank: products.length + 1,
      title: '',
      description: '',
      detailedDescription: '',
      image: '/10rating/1.jpg',
      rating: 5,
      price: '$0/month',
      features: [],
      pros: [],
      cons: [],
      affiliateLink: '',
      featured: false,
      categoryId: selectedCategoryId,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: Product) => {
    setEditingItem({ ...item });
    setIsFormOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete product');
      }

      // Refresh products list
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const productData = {
      rank: editingItem.rank || 1,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      detailedDescription: editingItem.detailedDescription || null, // Get from state (RichTextEditor)
      image: formData.get('image') as string,
      affiliateLink: formData.get('affiliateLink') as string,
      featured: formData.get('featured') === 'on',
      categoryId: selectedCategoryId,
      rating: editingItem.rating,
      price: editingItem.price,
      features: editingItem.features || [],
      pros: editingItem.pros || [],
      cons: editingItem.cons || [],
    };

    try {
      const isEditing = editingItem.id;
      const url = isEditing ? `/api/products/${editingItem.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      // Clear draft and refresh products list
      clearDraft();
      fetchProducts();
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddNew}
          disabled={!selectedCategoryId}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          + Add New Item
        </button>
      </div>

      {/* Items List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No products in this category. Click &quot;Add New Item&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">#{item.rank}</span>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    {item.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Draft Recovery Modal */}
      {showDraftModal && savedDraft && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Khôi phục bản nháp?</h3>
            </div>
            <p className="text-gray-600 mb-2">
              Phát hiện có bản nháp chưa lưu:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="font-medium text-gray-900">{savedDraft.title || '(Chưa có tiêu đề)'}</p>
              <p className="text-sm text-gray-500 mt-1">
                Lưu lúc: {savedDraft.savedAt ? new Date(savedDraft.savedAt as string).toLocaleString('vi-VN') : 'Không rõ'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDiscardDraft}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Bỏ qua
              </button>
              <button
                onClick={handleRestoreDraft}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Khôi phục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {isFormOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {editingItem.id ? 'Edit' : 'Add'} Product
              </h2>
              {lastSaved && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Tự động lưu: {lastSaved.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>
            <form ref={formRef} onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  defaultValue={editingItem.title}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description</label>
                <textarea
                  name="description"
                  defaultValue={editingItem.description}
                  required
                  rows={3}
                  placeholder="Brief summary shown in list view"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Detailed Description (Full Review)</label>
                <RichTextEditor
                  value={editingItem.detailedDescription || ''}
                  onChange={(markdown) => {
                    setEditingItem({ ...editingItem, detailedDescription: markdown });
                  }}
                  placeholder="Write a comprehensive review about this product/service..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar to format text, add images, links, tables, and more. Content is saved as Markdown.
                </p>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                currentImageUrl={editingItem.image || '/10rating/1.jpg'}
                onImageUploaded={(url) => {
                  setEditingItem({ ...editingItem, image: url });
                }}
              />

              {/* Hidden input to store image URL for form submission */}
              <input type="hidden" name="image" value={editingItem.image || '/10rating/1.jpg'} />

              <div>
                <label className="block text-sm font-medium mb-1">Affiliate Link (Visit Site URL)</label>
                <input
                  name="affiliateLink"
                  defaultValue={editingItem.affiliateLink}
                  required
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  name="featured"
                  type="checkbox"
                  defaultChecked={editingItem.featured}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Featured Item</label>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
