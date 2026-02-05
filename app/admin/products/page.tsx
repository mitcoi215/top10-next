'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowUpDown, Pencil, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Package, Info, CheckSquare } from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  Checkbox,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui';

interface Product {
  id: string;
  name: string;
  slug: string;
  status: string;
  rank: number;
  logo?: string;
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
  updatedAt: string;
}

type SortField = 'name' | 'rank' | 'status' | 'updatedAt' | 'category';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 20;

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string; icon?: string }>();
    products.forEach(p => {
      if (p.category) {
        cats.set(p.category.id, p.category);
      }
    });
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterCategory, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const updateProductStatus = async (id: string, status: 'draft' | 'published') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, status } : p));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProducts.map(p => p.id)));
    }
  };

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
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} product(s)?`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setProducts(products.filter(p => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete products:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusChange = async (status: 'draft' | 'published') => {
    if (selectedIds.size === 0) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          })
        )
      );
      setProducts(products.map(p => selectedIds.has(p.id) ? { ...p, status } : p));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update products:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || p.category?.id === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rank':
          comparison = (a.rank || 999) - (b.rank || 999);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'category':
          comparison = (a.category?.name || '').localeCompare(b.category?.name || '');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [products, searchTerm, filterStatus, filterCategory, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`h-4 w-4 ${sortField === field ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-green rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Sản phẩm</h1>
            <p className="text-sm text-slate-500">Quản lý sản phẩm và xếp hạng</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="admin-badge admin-badge-info">{filteredAndSortedProducts.length} / {products.length}</span>
          <Button asChild size="sm" className="gradient-primary text-white border-0">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          <strong>Hiển thị tại:</strong> Trang danh mục (Top 10 list), trang so sánh sản phẩm, trang review chi tiết, sidebar bài viết
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[260px] pl-9 h-7 bg-white border-slate-200 rounded-md text-xs"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-[160px] bg-white h-9 rounded-lg text-sm">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="published">Đã xuất bản</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[200px] bg-white h-9 rounded-lg text-sm">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon && !cat.icon.startsWith('/') ? cat.icon + ' ' : ''}{cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-sky-500" />
            <span className="font-medium text-sky-700">Đã chọn {selectedIds.size}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange('published')}
              disabled={bulkActionLoading}
              className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200"
            >
              Xuất bản
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkStatusChange('draft')}
              disabled={bulkActionLoading}
              className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"
            >
              Gỡ xuất bản
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
            >
              Xóa
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon animate-pulse">
            <Package className="w-6 h-6" />
          </div>
          <p className="text-slate-500">Đang tải sản phẩm...</p>
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">
            <Package className="w-6 h-6" />
          </div>
          <p className="admin-empty-state-title">Không tìm thấy sản phẩm nào</p>
          <p className="admin-empty-state-text">Thêm sản phẩm đầu tiên để bắt đầu.</p>
          <Button asChild className="gradient-primary text-white border-0 mt-2">
            <Link href="/admin/products/new">
              <Plus className="w-4 h-4 mr-2" />
              Tạo sản phẩm đầu tiên
            </Link>
          </Button>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <Table className="admin-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedIds.size === paginatedProducts.length && paginatedProducts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <SortableHeader field="rank">Hạng</SortableHeader>
                <SortableHeader field="name">Tên</SortableHeader>
                <SortableHeader field="category">Danh mục</SortableHeader>
                <SortableHeader field="status">Trạng thái</SortableHeader>
                <SortableHeader field="updatedAt">Cập nhật</SortableHeader>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow
                  key={product.id}
                  className={selectedIds.has(product.id) ? 'bg-blue-50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(product.id)}
                      onCheckedChange={() => handleSelect(product.id)}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    #{product.rank}
                  </TableCell>
                  <TableCell className="max-w-[350px]">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      {product.logo && (
                        <Image
                          src={product.logo}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded bg-muted p-1 object-contain"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-muted-foreground">/{product.slug}</span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {product.category && (
                      <span className="text-sm text-muted-foreground">
                        {product.category.icon && !product.category.icon.startsWith('/') ? product.category.icon + ' ' : ''}
                        {product.category.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status === 'published' ? 'success' : 'warning'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => updateProductStatus(product.id, product.status === 'published' ? 'draft' : 'published')}
                    >
                      {product.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link href={`/admin/products/${product.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProduct(product.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) <= 1) return true;
                return false;
              })
              .map((page, idx, arr) => (
                <Fragment key={page}>
                  {idx > 0 && arr[idx - 1] !== page - 1 && (
                    <span className="px-1 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-9 min-w-[36px]"
                  >
                    {page}
                  </Button>
                </Fragment>
              ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>

          <span className="ml-4 text-sm text-muted-foreground">
            Trang {currentPage} / {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
