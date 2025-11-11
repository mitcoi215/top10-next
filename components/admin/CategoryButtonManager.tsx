'use client';

import { useState, useEffect } from 'react';
import { CategoryType } from '@/types';
import { CATEGORIES } from '@/lib/constants';

type CategoryButton = {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
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

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    const formData = new FormData(e.currentTarget);
    const updatedCategory: CategoryButton = {
      id: editingCategory.id,
      name: formData.get('name') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
    };

    const newCategories = categories.map((cat) =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    );

    saveCategories(newCategories);
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const colorOptions = [
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-orange-500', label: 'Orange' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Manage Category Buttons</h3>
        <p className="text-gray-600 text-sm">
          Edit the 5 main category buttons that appear on the homepage.
        </p>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div
                className={`flex items-center justify-center rounded-lg ${cat.color} w-20 h-20 flex-shrink-0`}
              >
                <img src={cat.icon} alt={cat.name} className="h-10 w-10" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{cat.name}</h4>
                <p className="text-sm text-gray-500 mb-1">ID: {cat.id}</p>
                <p className="text-sm text-gray-500 mb-2">Color: {cat.color}</p>
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {isFormOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Category Button</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category ID (Read-only)
                </label>
                <input
                  type="text"
                  value={editingCategory.id}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
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

              <div>
                <label className="block text-sm font-medium mb-1">Icon Path *</label>
                <input
                  name="icon"
                  defaultValue={editingCategory.icon}
                  required
                  placeholder="e.g., /icons/lifestyle.svg"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Path to SVG icon in public/icons/ folder
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color *</label>
                <select
                  name="color"
                  defaultValue={editingCategory.color}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {colorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-2">Preview:</label>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center rounded-lg ${editingCategory.color} w-24 h-24`}
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
