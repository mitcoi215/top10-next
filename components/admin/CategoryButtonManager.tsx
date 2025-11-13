'use client';

import { useState, useEffect } from 'react';
import { CategoryType } from '@/types';
import { CATEGORIES } from '@/lib/constants';
import ImageUploader from './ImageUploader';

type CategoryButton = {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
  featured?: boolean; // Show in header navigation
};

export default function CategoryButtonManager() {
  const [categories, setCategories] = useState<CategoryButton[]>(CATEGORIES as CategoryButton[]);
  const [editingCategory, setEditingCategory] = useState<CategoryButton | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('categories');
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse categories:', e);
      }
    }
  }, []);

  // Save to localStorage whenever categories change
  const saveCategories = (newCategories: CategoryButton[]) => {
    setCategories(newCategories);
    localStorage.setItem('categories', JSON.stringify(newCategories));
  };

  const handleEdit = (category: CategoryButton) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory({
      id: '',
      name: '',
      icon: '/icons/new-category.svg',
      color: 'bg-white',
      featured: false,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (categoryId: CategoryType) => {
    if (categories.length <= 1) {
      alert('Cannot delete the last category!');
      return;
    }
    if (confirm(`Are you sure you want to delete "${categoryId}" category?`)) {
      const newCategories = categories.filter((cat) => cat.id !== categoryId);
      saveCategories(newCategories);

      // Also delete 10rating data for this category
      const savedTop10 = localStorage.getItem('top10_data');
      if (savedTop10) {
        try {
          const top10Data = JSON.parse(savedTop10);
          delete top10Data[categoryId];
          localStorage.setItem('top10_data', JSON.stringify(top10Data));
        } catch (e) {
          console.error('Failed to delete 10rating data:', e);
        }
      }
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get('id') as string;
    const categoryName = formData.get('name') as string;
    const categoryIcon = formData.get('icon') as string;
    const categoryFeatured = formData.get('featured') === 'on';

    // Validation
    if (!categoryId.trim()) {
      alert('Category ID is required!');
      return;
    }
    if (!categoryName.trim()) {
      alert('Category Name is required!');
      return;
    }

    const updatedCategory: CategoryButton = {
      id: categoryId.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName,
      icon: categoryIcon,
      color: 'bg-white',
      featured: categoryFeatured,
    };

    // Check if adding new or editing existing
    const existingIndex = categories.findIndex((cat) => cat.id === editingCategory.id);

    let newCategories;
    if (existingIndex >= 0 && editingCategory.id !== '') {
      // Editing existing
      newCategories = categories.map((cat) =>
        cat.id === editingCategory.id ? updatedCategory : cat
      );
    } else {
      // Adding new - check for duplicate ID
      if (categories.some((cat) => cat.id === updatedCategory.id)) {
        alert('Category ID already exists! Please use a different ID.');
        return;
      }
      newCategories = [...categories, updatedCategory];
    }

    saveCategories(newCategories);
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div>
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
                <p className="text-sm text-gray-500 mb-2">ID: {cat.id}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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

      {/* Edit Form Modal */}
      {isFormOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingCategory.id ? 'Edit' : 'Add New'} Category
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category ID * {editingCategory.id && '(Read-only)'}
                </label>
                <input
                  name="id"
                  type="text"
                  defaultValue={editingCategory.id}
                  readOnly={editingCategory.id !== ''}
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
                currentImageUrl={editingCategory.icon}
                onImageUploaded={(url) => {
                  setEditingCategory({ ...editingCategory, icon: url });
                }}
              />

              {/* Hidden input to store icon URL for form submission */}
              <input type="hidden" name="icon" value={editingCategory.icon} />

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
                      src={editingCategory.icon}
                      alt={editingCategory.name}
                      className="h-12 w-12"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{editingCategory.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
