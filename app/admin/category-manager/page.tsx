'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  FolderOpen,
  Package,
  Star,
  Clock,
  Pencil,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  featured: boolean;
  order: number;
  _count?: { products: number };
  updatedAt: string;
}

export default function CategoryManagerListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    if (!searchTerm) return sorted;
    const term = searchTerm.toLowerCase();
    return sorted.filter(c => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term));
  }, [categories, searchTerm]);

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);
  const featuredCount = categories.filter(c => c.featured).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="w-48 h-7 bg-slate-200 rounded animate-pulse" />
          <div className="w-32 h-8 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-800">Quản lý nội dung</h1>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
            {categories.length} danh mục
          </span>
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
          <Button asChild size="sm" className="h-8 gradient-primary text-white border-0 text-xs">
            <Link href="/admin/category-manager/new">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Thêm danh mục
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200/80">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">{categories.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Danh mục</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200/80">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
            <Star className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">{featuredCount}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Nổi bật</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-slate-200/80">
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 leading-none">{totalProducts}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Sản phẩm</p>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      {filteredCategories.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">
            <FolderOpen className="w-6 h-6" />
          </div>
          <p className="admin-empty-state-title">
            {searchTerm ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
          </p>
          <p className="admin-empty-state-text">
            {searchTerm
              ? `Không có danh mục nào phù hợp với "${searchTerm}"`
              : 'Tạo danh mục đầu tiên để bắt đầu quản lý nội dung.'}
          </p>
          {!searchTerm && (
            <Button asChild className="gradient-primary text-white border-0 mt-2">
              <Link href="/admin/category-manager/new">
                <Plus className="h-4 w-4 mr-2" />
                Tạo danh mục đầu tiên
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/admin/category-manager/${category.id}`}
              className="group relative bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              {/* Featured badge */}
              {category.featured && (
                <div className="absolute top-3 right-3">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
              )}

              {/* Top: Icon + Info */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: category.color || '#f3f4f6' }}
                >
                  {category.icon && !category.icon.startsWith('/') ? category.icon : '📁'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono truncate">/{category.slug}</p>
                </div>
              </div>

              {/* Bottom: Meta */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Package className="w-3 h-3" />
                    {category._count?.products || 0} sản phẩm
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>

              {/* Hover action buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`/${category.slug}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}

          {/* Add New Card */}
          <Link
            href="/admin/category-manager/new"
            className="group flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30 transition-all duration-200 min-h-[130px]"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
              Thêm danh mục mới
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
