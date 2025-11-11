'use client';

import { useState, useEffect } from 'react';
import { Top10Item, CategoryType } from '@/types';
import { lifestyleTop10, healthTop10, homeTop10, businessTop10, securityTop10 } from '@/data/top10Data';
import { CATEGORIES } from '@/lib/constants';
import ImageUploader from './ImageUploader';

const initialData = {
  lifestyle: lifestyleTop10,
  health: healthTop10,
  home: homeTop10,
  business: businessTop10,
  security: securityTop10,
};

type CategoryButton = {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
};

export default function Top10Manager() {
  const [categories, setCategories] = useState<CategoryButton[]>(CATEGORIES as CategoryButton[]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('lifestyle');
  const [items, setItems] = useState<Record<string, Top10Item[]>>(initialData);
  const [editingItem, setEditingItem] = useState<Top10Item | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    // Load categories
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setCategories(parsedCategories);
      if (parsedCategories.length > 0) {
        setSelectedCategory(parsedCategories[0].id);
      }
    }

    // Load top10 data
    const saved = localStorage.getItem('top10_data');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever items change
  const saveItems = (newItems: Record<CategoryType, Top10Item[]>) => {
    setItems(newItems);
    localStorage.setItem('top10_data', JSON.stringify(newItems));
  };

  const handleAddNew = () => {
    setEditingItem({
      id: Date.now(),
      rank: (items[selectedCategory] || []).length + 1,
      title: '',
      description: '',
      image: '/top10/1.jpg',
      rating: 5,
      price: '$0/month',
      features: [],
      pros: [],
      cons: [],
      category: selectedCategory,
      affiliateLink: '',
      featured: false,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (item: Top10Item) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const newItems = {
        ...items,
        [selectedCategory]: (items[selectedCategory] || []).filter((item) => item.id !== itemId),
      };
      saveItems(newItems);
    }
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    const formData = new FormData(e.currentTarget);
    const updatedItem: Top10Item = {
      ...editingItem,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      detailedDescription: formData.get('detailedDescription') as string,
      image: formData.get('image') as string,
      affiliateLink: formData.get('affiliateLink') as string,
      featured: formData.get('featured') === 'on',
    };

    const categoryItems = items[selectedCategory] || [];
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

    const newItems = {
      ...items,
      [selectedCategory]: newCategoryItems,
    };

    saveItems(newItems);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const currentItems = items[selectedCategory] || [];

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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          + Add New Item
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {currentItems.map((item) => (
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

      {/* Edit Form Modal */}
      {isFormOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingItem.id ? 'Edit' : 'Add'} Top10 Item
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
                <textarea
                  name="detailedDescription"
                  defaultValue={editingItem.detailedDescription || ''}
                  rows={8}
                  placeholder="Write a comprehensive review about this product/service. This will be displayed on the detail page and in the list view."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This detailed content will be displayed prominently in the list and on the detail page
                </p>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                currentImageUrl={editingItem.image}
                onImageUploaded={(url) => {
                  setEditingItem({ ...editingItem, image: url });
                }}
              />

              {/* Hidden input to store image URL for form submission */}
              <input type="hidden" name="image" value={editingItem.image} />

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
