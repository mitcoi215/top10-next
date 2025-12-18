'use client';

import { useState, useEffect, useCallback } from 'react';
import ImageUploader from './ImageUploader';

// Type for API response
interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  featured: boolean;
  order: number;
}

// Helper to get auth header
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function CategoryButtonManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory({
      slug: '',
      name: '',
      icon: '/icons/new-category.svg',
      color: 'bg-white',
      featured: false,
      order: categories.length,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (categories.length <= 1) {
      alert('Cannot delete the last category!');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${categoryName}" category? All products in this category will also be deleted.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete category');
      }

      // Refresh categories list
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    setIsSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const categorySlug = formData.get('slug') as string;
    const categoryName = formData.get('name') as string;
    const categoryIcon = formData.get('icon') as string;
    const categoryFeatured = formData.get('featured') === 'on';

    // Validation
    if (!categorySlug.trim()) {
      setError('Category Slug is required!');
      setIsSaving(false);
      return;
    }
    if (!categoryName.trim()) {
      setError('Category Name is required!');
      setIsSaving(false);
      return;
    }

    const categoryData = {
      slug: categorySlug.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName,
      icon: categoryIcon,
      color: 'bg-white',
      featured: categoryFeatured,
      order: editingCategory.order || categories.length,
    };

    try {
      const isEditing = editingCategory.id;
      const url = isEditing ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(categoryData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save category');
      }

      // Refresh categories list and close form
      fetchCategories();
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-gray-600">Loading categories...</span>
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
          <h3 className="text-lg font-semibold mb-2">Manage Category Buttons</h3>
          <p className="text-gray-600 text-sm">
            Create, edit, or delete category buttons that appear on the homepage.
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          + Add New Category
        </button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found. Click &quot;Add New Category&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div
                  className="flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 w-20 h-20 flex-shrink-0"
                >
                  <img src={cat.icon} alt={cat.name} className="h-10 w-10" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg">{cat.name}</h4>
                    {cat.featured && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Slug: {cat.slug}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {isFormOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto my-4">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory.id ? 'Edit' : 'Add New'} Category
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category Slug * {editingCategory.id && '(Read-only)'}
                </label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={editingCategory.slug}
                  readOnly={!!editingCategory.id}
                  required
                  placeholder="e.g., lifestyle, technology"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none ${
                    editingCategory.id ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
                {!editingCategory.id && (
                  <p className="text-xs text-gray-500 mt-1">
                    Lowercase, no spaces (use dashes). This will be used in URLs.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  name="name"
                  defaultValue={editingCategory.name}
                  required
                  placeholder="e.g., Lifestyle, Health & Wellness"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Icon/Logo Uploader */}
              <ImageUploader
                currentImageUrl={editingCategory.icon || '/icons/new-category.svg'}
                onImageUploaded={(url) => {
                  setEditingCategory({ ...editingCategory, icon: url });
                }}
              />

              {/* Hidden input to store icon URL for form submission */}
              <input type="hidden" name="icon" value={editingCategory.icon || '/icons/new-category.svg'} />

              {/* Featured in Header Checkbox */}
              <div className="flex items-center gap-2 border-t pt-4">
                <input
                  name="featured"
                  type="checkbox"
                  defaultChecked={editingCategory.featured || false}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Show in Header Navigation</label>
                <span className="text-xs text-gray-500 ml-2">
                  (Featured categories will appear in the top navigation bar)
                </span>
              </div>

              {/* Preview */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2">Preview:</label>
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center rounded-lg bg-white border-2 border-gray-300 w-24 h-24"
                  >
                    <img
                      src={editingCategory.icon || '/icons/new-category.svg'}
                      alt={editingCategory.name || 'New Category'}
                      className="h-12 w-12"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{editingCategory.name || 'Category Name'}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingCategory(null);
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
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
