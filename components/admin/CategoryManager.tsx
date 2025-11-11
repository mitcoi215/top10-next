'use client';

import { useState, useEffect } from 'react';
import { CategoryType } from '@/types';
import { CATEGORY_CONTENTS } from '@/lib/constants';

type SubcategoryItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
};

export default function CategoryManager() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('lifestyle');
  const [contents, setContents] = useState<Record<string, SubcategoryItem[]>>(CATEGORY_CONTENTS);
  const [editingItem, setEditingItem] = useState<SubcategoryItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('category_contents');
    if (saved) {
      setContents(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever contents change
  const saveContents = (newContents: Record<string, SubcategoryItem[]>) => {
    setContents(newContents);
    localStorage.setItem('category_contents', JSON.stringify(newContents));
  };

  const handleAddNew = () => {
    setEditingItem({
      id: `new-${Date.now()}`,
      title: '',
      description: '',
      image: '/top10/1.jpg',
      link: '#',
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: SubcategoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      const newContents = {
        ...contents,
        [selectedCategory]: contents[selectedCategory].filter((item) => item.id !== itemId),
      };
      saveContents(newContents);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const updatedItem: SubcategoryItem = {
      id: editingItem.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      link: formData.get('link') as string,
    };

    const categoryItems = contents[selectedCategory] || [];
    const existingIndex = categoryItems.findIndex((item) => item.id === updatedItem.id);

    let newCategoryItems;
    if (existingIndex >= 0) {
      // Update existing
      newCategoryItems = [...categoryItems];
      newCategoryItems[existingIndex] = updatedItem;
    } else {
      // Add new
      newCategoryItems = [...categoryItems, updatedItem];
    }

    const newContents = {
      ...contents,
      [selectedCategory]: newCategoryItems,
    };

    saveContents(newContents);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const currentItems = contents[selectedCategory] || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
          >
            <option value="lifestyle">Lifestyle</option>
            <option value="health">Health & Wellness</option>
            <option value="home">Home</option>
            <option value="business">Business</option>
            <option value="security">Security</option>
          </select>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          + Add New Subcategory
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{item.description}</p>
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
        ))}
      </div>

      {/* Edit Form Modal */}
      {isFormOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem.id.startsWith('new-') ? 'Add' : 'Edit'} Subcategory
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
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
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingItem.description}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  name="image"
                  defaultValue={editingItem.image}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Link</label>
                <input
                  name="link"
                  defaultValue={editingItem.link}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
