'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowUpDown, Pencil, Trash2, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LayoutGrid, LayoutList, FileText, Info, CheckSquare } from 'lucide-react';
import {
  Button,
  Input,
  Badge,
  Checkbox,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Card, CardContent,
} from '@/components/ui';

interface Article {
  id: string;
  title: string;
  slug: string;
  articleType: string;
  status: string;
  featuredImage?: string;
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  updatedAt: string;
  publishedAt?: string;
  createdAt?: string;
}

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  charticle: 'Charticle',
  blog: 'Blog',
  guide: 'Huong dan',
};

type SortField = 'title' | 'updatedAt' | 'status' | 'articleType';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grid' | 'table';

const ITEMS_PER_PAGE = 12;

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [filterType, setFilterType] = useState<'all' | 'charticle' | 'blog' | 'guide'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Get unique categories from articles
  const categories = useMemo(() => {
    const cats = new Map<string, { id: string; name: string; icon: string }>();
    articles.forEach(a => {
      if (a.category) {
        cats.set(a.category.id, a.category);
      }
    });
    return Array.from(cats.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [articles]);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterType, filterCategory, sortField, sortDirection]);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(articles.filter(a => a.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
    }
  };

  const updateArticleStatus = async (id: string, status: 'draft' | 'published') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setArticles(articles.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  // Bulk actions
  const handleSelectAll = () => {
    if (selectedIds.size === filteredAndSortedArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedArticles.map(a => a.id)));
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
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} article(s)?`)) return;

    setBulkActionLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      await Promise.all(
        Array.from(selectedIds).map(id =>
          fetch(`/api/articles/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setArticles(articles.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to delete articles:', error);
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
          fetch(`/api/articles/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
          })
        )
      );
      setArticles(articles.map(a => selectedIds.has(a.id) ? { ...a, status } : a));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Failed to update articles:', error);
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Filtering and sorting
  const filteredAndSortedArticles = useMemo(() => {
    let result = articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            a.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchesType = filterType === 'all' || a.articleType === filterType;
      const matchesCategory = filterCategory === 'all' || a.category?.id === filterCategory;
      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'articleType':
          comparison = a.articleType.localeCompare(b.articleType);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [articles, searchTerm, filterStatus, filterType, filterCategory, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredAndSortedArticles.slice(
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

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'charticle': return 'default';
      case 'blog': return 'warning';
      case 'guide': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bài viết</h1>
            <p className="text-sm text-slate-500">Quản lý nội dung và bài viết</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="admin-badge admin-badge-info">{filteredAndSortedArticles.length} / {articles.length}</span>
          <Button asChild className="gradient-primary text-white border-0">
            <Link href="/admin/articles/new">
              <Plus className="h-4 w-4 mr-2" />
              Thêm bài viết
            </Link>
          </Button>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          <strong>Hiển thị tại:</strong> Trang danh mục (phần bài viết), trang Trending, sidebar sản phẩm, blog listing
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
          />
        </div>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="published">Đã xuất bản</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="charticle">Charticle</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="guide">Hướng dẫn</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px] bg-white">
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

        {/* View Toggle */}
        <div className="flex border border-slate-200 rounded-lg overflow-hidden ml-auto bg-white">
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="rounded-none"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
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
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-slate-500">Đang tải bài viết...</p>
        </div>
      ) : filteredAndSortedArticles.length === 0 ? (
        <div className="admin-empty-state">
          <div className="admin-empty-state-icon">
            <FileText className="w-6 h-6" />
          </div>
          <p className="admin-empty-state-title">Không tìm thấy bài viết nào</p>
          <p className="admin-empty-state-text">Viết bài viết đầu tiên để bắt đầu.</p>
          <Button asChild className="gradient-primary text-white border-0 mt-2">
            <Link href="/admin/articles/new">
              <Plus className="w-4 h-4 mr-2" />
              Tạo bài viết đầu tiên
            </Link>
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="admin-card overflow-hidden">
          <Table className="admin-table">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectedIds.size === paginatedArticles.length && paginatedArticles.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <SortableHeader field="title">Tieu de</SortableHeader>
                <SortableHeader field="articleType">Loai</SortableHeader>
                <TableHead>Danh muc</TableHead>
                <SortableHeader field="status">Trang thai</SortableHeader>
                <TableHead>Tac gia</TableHead>
                <SortableHeader field="updatedAt">Cap nhat</SortableHeader>
                <TableHead>Thao tac</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedArticles.map((article) => (
                <TableRow
                  key={article.id}
                  className={selectedIds.has(article.id) ? 'bg-blue-50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(article.id)}
                      onCheckedChange={() => handleSelect(article.id)}
                    />
                  </TableCell>
                  <TableCell className="max-w-[350px]">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="flex items-center gap-3 hover:text-primary transition-colors"
                    >
                      {article.featuredImage && (
                        <Image
                          src={article.featuredImage}
                          alt=""
                          width={48}
                          height={36}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="font-medium truncate">{article.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(article.articleType)}>
                      {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.category && (
                      <span className="text-sm text-muted-foreground">
                        {article.category.icon && !article.category.icon.startsWith('/') ? article.category.icon + ' ' : ''}
                        {article.category.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={article.status === 'published' ? 'success' : 'warning'}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => updateArticleStatus(article.id, article.status === 'published' ? 'draft' : 'published')}
                    >
                      {article.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {article.author && (
                      <span className="text-sm text-muted-foreground">{article.author.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-8 w-8"
                      >
                        <Link href={`/admin/articles/${article.id}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteArticle(article.id)}
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
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedArticles.map((article) => (
            <Card
              key={article.id}
              className={`overflow-hidden transition-shadow hover:shadow-lg ${selectedIds.has(article.id) ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="absolute top-3 left-3 z-10">
                <Checkbox
                  checked={selectedIds.has(article.id)}
                  onCheckedChange={() => handleSelect(article.id)}
                  className="bg-white"
                />
              </div>
              {article.featuredImage && (
                <div className="h-[180px] overflow-hidden relative">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex gap-2 mb-3">
                  <Badge variant={getTypeBadgeVariant(article.articleType)}>
                    {ARTICLE_TYPE_LABELS[article.articleType] || article.articleType}
                  </Badge>
                  <Badge
                    variant={article.status === 'published' ? 'success' : 'warning'}
                    className="cursor-pointer"
                    onClick={() => updateArticleStatus(article.id, article.status === 'published' ? 'draft' : 'published')}
                  >
                    {article.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="block text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2"
                >
                  {article.title}
                </Link>
                <div className="flex gap-3 text-sm text-muted-foreground mb-2">
                  {article.category && (
                    <span>
                      {article.category.icon && !article.category.icon.startsWith('/') ? article.category.icon : ''} {article.category.name}
                    </span>
                  )}
                  {article.author && (
                    <span>boi {article.author.name}</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Cap nhat {new Date(article.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/articles/${article.id}`}>Sua</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteArticle(article.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Xoa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
