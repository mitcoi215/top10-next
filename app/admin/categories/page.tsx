'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  ChevronUp,
  ChevronDown,
  Search,
  FolderOpen,
  Info,
  AlertTriangle,
  CheckSquare,
  Package,
  GripVertical,
  Loader2,
  ExternalLink,
  MoreHorizontal,
  StarOff,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

type SortField = 'name' | 'order' | 'products' | 'featured' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFeatured, setFilterFeatured] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [reorderMode, setReorderMode] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string; bulk?: boolean; name?: string }>({ open: false });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter(c => c.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
    setDeleteDialog({ open: false });
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ featured }),
      });
      if (res.ok) {
        setCategories(categories.map(c => c.id === id ? { ...c, featured } : c));
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  const moveCategory = (id: string, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(c => c.id === id);
    if (index === -1) return;
    if (direction === 'up' && index > 0) {
      [sorted[index - 1].order, sorted[index].order] = [sorted[index].order, sorted[index - 1].order];
    } else if (direction === 'down' && index < sorted.length - 1) {
      [sorted[index + 1].order, sorted[index].order] = [sorted[index].order, sorted[index + 1].order];
    }
    setCategories(sorted);
  };

  const saveOrder = async () => {
    setSavingOrder(true);
    const token = localStorage.getItem('admin_token');
    try {
      const sorted = [...categories].sort((a, b) => a.order - b.order);
      await Promise.all(
        sorted.map((cat, index) =>
          fetch(`/api/categories/${cat.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ order: index + 1 }),
          })
        )
      );
      setCategories(sorted.map((cat, index) => ({ ...cat, order: index + 1 })));
      setReorderMode(false);
    } catch (error) {
      console.error('Failed to save order:', error);
    } finally {
      setSavingOrder(false);
    }
  };

  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/categories/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        )
      );
      setCategories(categories.filter(c => !selectedIds.has(c.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete categories:', error);
    } finally {
      setBulkActionLoading(false);
      setDeleteDialog({ open: false });
    }
  };

  const handleBulkFeaturedChange = async (featured: boolean) => {
    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/categories/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ featured }),
          })
        )
      );
      setCategories(categories.map(c => selectedIds.has(c.id) ? { ...c, featured } : c));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update categories:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const filteredAndSortedCategories = useMemo(() => {
    let result = categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            c.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFeatured = filterFeatured === 'all' ||
                              (filterFeatured === 'featured' && c.featured) ||
                              (filterFeatured === 'not-featured' && !c.featured);
      return matchesSearch && matchesFeatured;
    });
    if (reorderMode) return result.sort((a, b) => a.order - b.order);
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'order': comparison = a.order - b.order; break;
        case 'products': comparison = (a._count?.products || 0) - (b._count?.products || 0); break;
        case 'featured': comparison = (a.featured ? 1 : 0) - (b.featured ? 1 : 0); break;
        case 'updatedAt': comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [categories, searchTerm, filterFeatured, sortField, sortDirection, reorderMode]);

  const handleSort = (field: SortField) => {
    if (reorderMode) return;
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allSelected = selectedIds.size === filteredAndSortedCategories.length && filteredAndSortedCategories.length > 0;

  // Stats calculations
  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);
  const featuredCount = categories.filter(c => c.featured).length;

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
            <div>
              <div className="w-32 h-6 bg-slate-200 rounded animate-pulse" />
              <div className="w-48 h-4 bg-slate-100 rounded mt-2 animate-pulse" />
            </div>
          </div>
        </div>
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
                <div>
                  <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
                  <div className="w-24 h-4 bg-slate-100 rounded mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Table Skeleton */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="w-48 h-10 bg-slate-100 rounded animate-pulse" />
          </div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-slate-50">
              <div className="w-5 h-5 bg-slate-100 rounded animate-pulse" />
              <div className="w-10 h-10 bg-slate-100 rounded-lg animate-pulse" />
              <div className="flex-1">
                <div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-slate-100 rounded mt-1 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Danh mục</h1>
              <p className="text-sm text-slate-500">Quản lý và sắp xếp danh mục sản phẩm</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reorderMode ? (
              <>
                <Button
                  size="sm"
                  onClick={saveOrder}
                  disabled={savingOrder}
                  className="gradient-primary text-white border-0"
                >
                  {savingOrder ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thứ tự'
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { fetchCategories(); setReorderMode(false); }}>
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setReorderMode(true)} className="gap-1.5">
                      <GripVertical className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Sắp xếp</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thay đổi thứ tự hiển thị</TooltipContent>
                </Tooltip>
                <Button size="sm" asChild variant="outline" className="gap-1.5">
                  <Link href="/admin/category-manager/new">
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Manager V2</span>
                    <span className="text-[10px] px-1 py-0.5 bg-emerald-100 text-emerald-600 rounded font-medium">NEW</span>
                  </Link>
                </Button>
                <Button size="sm" asChild className="gradient-primary text-white border-0 gap-1.5">
                  <Link href="/admin/categories/new">
                    <Plus className="h-3.5 w-3.5" />
                    Thêm danh mục
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">{categories.length}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Tổng danh mục</p>
              </div>
            </div>
          </div>
          <div className="group bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Star className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">{featuredCount}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Nổi bật</p>
              </div>
            </div>
          </div>
          <div className="group bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">{totalProducts}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Sản phẩm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Hint */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>Hiển thị tại: Menu chính, Hero dropdown, Explore Categories, Breadcrumbs</span>
        </div>

        {/* Filters & Search */}
        {!reorderMode && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[260px] pl-10 h-9 bg-white border-slate-200 rounded-lg text-sm"
              />
            </div>
            <Select value={filterFeatured} onValueChange={setFilterFeatured}>
              <SelectTrigger className="w-[160px] bg-white h-9 rounded-lg text-sm">
                <SelectValue placeholder="Lọc theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="featured">Nổi bật</SelectItem>
                <SelectItem value="not-featured">Không nổi bật</SelectItem>
              </SelectContent>
            </Select>
            {searchTerm && (
              <span className="text-xs text-slate-400">
                {filteredAndSortedCategories.length} kết quả
              </span>
            )}
          </div>
        )}

        {/* Reorder Notice */}
        {reorderMode && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-xl animate-slide-up">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-amber-900 text-sm">Chế độ sắp xếp</p>
              <p className="text-sm text-amber-700">
                Sử dụng nút mũi tên để di chuyển danh mục. Nhấn "Lưu thứ tự" khi hoàn tất.
              </p>
            </div>
          </div>
        )}

        {/* Bulk Actions - Floating Bar */}
        {selectedIds.size > 0 && !reorderMode && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl">
              <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
                <CheckSquare className="w-5 h-5 text-sky-400" />
                <span className="font-medium">{selectedIds.size} đã chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBulkFeaturedChange(true)}
                      disabled={bulkActionLoading}
                      className="text-white hover:bg-slate-800"
                    >
                      <Star className="h-4 w-4 mr-1" /> Nổi bật
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Đánh dấu nổi bật</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBulkFeaturedChange(false)}
                      disabled={bulkActionLoading}
                      className="text-white hover:bg-slate-800"
                    >
                      <StarOff className="h-4 w-4 mr-1" /> Bỏ
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bỏ nổi bật</TooltipContent>
                </Tooltip>
                <div className="w-px h-6 bg-slate-700" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteDialog({ open: true, bulk: true })}
                      disabled={bulkActionLoading}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Xóa danh mục</TooltipContent>
                </Tooltip>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedIds(new Set())}
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table Header Info */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              {!reorderMode && (
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => {
                    if (allSelected) setSelectedIds(new Set());
                    else setSelectedIds(new Set(filteredAndSortedCategories.map(c => c.id)));
                  }}
                />
              )}
              <span className="text-sm font-medium text-slate-600">
                {filteredAndSortedCategories.length} danh mục
              </span>
            </div>
            {!reorderMode && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Sắp xếp:</span>
                <button
                  onClick={() => handleSort('order')}
                  className={cn(
                    "px-2 py-1 rounded hover:bg-slate-100 transition",
                    sortField === 'order' && "bg-slate-100 font-medium text-slate-700"
                  )}
                >
                  Thứ tự
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={cn(
                    "px-2 py-1 rounded hover:bg-slate-100 transition",
                    sortField === 'name' && "bg-slate-100 font-medium text-slate-700"
                  )}
                >
                  Tên
                </button>
                <button
                  onClick={() => handleSort('products')}
                  className={cn(
                    "px-2 py-1 rounded hover:bg-slate-100 transition",
                    sortField === 'products' && "bg-slate-100 font-medium text-slate-700"
                  )}
                >
                  Sản phẩm
                </button>
              </div>
            )}
          </div>

          {/* Empty State */}
          {filteredAndSortedCategories.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                {searchTerm ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
              </h3>
              <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {searchTerm
                  ? `Không có danh mục nào phù hợp với "${searchTerm}"`
                  : 'Tạo danh mục đầu tiên để bắt đầu quản lý sản phẩm'}
              </p>
              {!searchTerm && (
                <Button asChild className="gradient-primary text-white border-0">
                  <Link href="/admin/categories/new">
                    <Plus className="mr-2 h-4 w-4" /> Tạo danh mục
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredAndSortedCategories.map((category, index) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 hover:bg-slate-50/80 transition-colors group",
                    selectedIds.has(category.id) && "bg-blue-50/50 hover:bg-blue-50/80",
                    reorderMode && "cursor-move"
                  )}
                >
                  {/* Checkbox / Reorder */}
                  {reorderMode ? (
                    <div className="flex items-center gap-0.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={() => moveCategory(category.id, 'up')}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-slate-600"
                        onClick={() => moveCategory(category.id, 'down')}
                        disabled={index === filteredAndSortedCategories.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Checkbox
                      checked={selectedIds.has(category.id)}
                      onCheckedChange={() => {
                        const next = new Set(selectedIds);
                        if (next.has(category.id)) next.delete(category.id);
                        else next.add(category.id);
                        setSelectedIds(next);
                      }}
                    />
                  )}

                  {/* Order Badge */}
                  <div className="w-7 h-7 bg-slate-100 rounded-md flex items-center justify-center text-xs font-medium text-slate-500">
                    {category.order}
                  </div>

                  {/* Icon & Name */}
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg border border-slate-200/50 group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: category.color || '#f3f4f6' }}
                    >
                      {category.icon && !category.icon.startsWith('/') ? category.icon : '📁'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono truncate">/{category.slug}</p>
                    </div>
                  </Link>

                  {/* Products Count - right aligned */}
                  <Link
                    href={`/admin/products?category=${category.id}`}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 tabular-nums transition-colors min-w-[50px] justify-end"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span className="font-medium">{category._count?.products || 0}</span>
                  </Link>

                  {/* Featured Toggle */}
                  <button
                    onClick={() => toggleFeatured(category.id, !category.featured)}
                    className={cn(
                      "hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      category.featured
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
                    )}
                  >
                    <Star className={cn("w-3.5 h-3.5", category.featured && "fill-amber-400")} />
                    {category.featured ? 'Nổi bật' : 'Thường'}
                  </button>

                  {/* Updated Date */}
                  <div className="hidden lg:flex items-center gap-1 text-xs text-slate-400 min-w-[90px]">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(category.updatedAt).toLocaleDateString('vi-VN')}
                  </div>

                  {/* Actions */}
                  {!reorderMode && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/categories/${category.id}`} className="flex items-center gap-2">
                            <Pencil className="w-4 h-4" /> Chỉnh sửa
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/category-manager/${category.id}`} className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" /> Manager V2
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded font-medium">NEW</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${category.slug}`} target="_blank" className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" /> Xem trên site
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleFeatured(category.id, !category.featured)}
                          className="flex items-center gap-2"
                        >
                          {category.featured ? (
                            <>
                              <StarOff className="w-4 h-4" /> Bỏ nổi bật
                            </>
                          ) : (
                            <>
                              <Star className="w-4 h-4" /> Đánh dấu nổi bật
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, id: category.id, name: category.name })}
                          className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa danh mục
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <DialogTitle className="text-center">Xác nhận xóa</DialogTitle>
              <DialogDescription className="text-center">
                {deleteDialog.bulk ? (
                  <>
                    Bạn có chắc muốn xóa <strong>{selectedIds.size} danh mục</strong> đã chọn?
                    <br />
                    <span className="text-amber-600">Thao tác này sẽ ảnh hưởng đến các sản phẩm liên quan.</span>
                  </>
                ) : (
                  <>
                    Bạn có chắc muốn xóa danh mục <strong>"{deleteDialog.name}"</strong>?
                    <br />
                    <span className="text-amber-600">Thao tác này không thể hoàn tác.</span>
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center gap-2 mt-4">
              <Button variant="outline" onClick={() => setDeleteDialog({ open: false })} className="min-w-[100px]">
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteDialog.bulk ? handleBulkDelete() : deleteCategory(deleteDialog.id!)}
                className="min-w-[100px]"
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
