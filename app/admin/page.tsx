'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderOpen,
  Package,
  FileText,
  Users,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Eye,
  Home,
  Sparkles,
  Zap,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface Stats {
  categories: number;
  products: number;
  articles: number;
  authors: number;
}

interface RecentItem {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  status?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ categories: 0, products: 0, articles: 0, authors: 0 });
  const [recentArticles, setRecentArticles] = useState<RecentItem[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [categoriesRes, productsRes, articlesRes, authorsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/articles'),
        fetch('/api/authors'),
      ]);

      const categories = await categoriesRes.json();
      const products = await productsRes.json();
      const articles = await articlesRes.json();
      const authors = await authorsRes.json();

      setStats({
        categories: Array.isArray(categories) ? categories.length : 0,
        products: Array.isArray(products) ? products.length : 0,
        articles: Array.isArray(articles.articles) ? articles.articles.length : (Array.isArray(articles) ? articles.length : 0),
        authors: Array.isArray(authors) ? authors.length : 0,
      });

      const articlesList = articles.articles || articles;
      if (Array.isArray(articlesList)) {
        setRecentArticles(articlesList.slice(0, 5).map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          createdAt: a.createdAt || a.updatedAt,
          status: a.status,
        })));
      }

      if (Array.isArray(products)) {
        setRecentProducts(products.slice(0, 5).map((p: any) => ({
          id: p.id,
          title: p.name,
          slug: p.slug,
          createdAt: p.createdAt || p.updatedAt,
          status: p.status,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Categories',
      value: stats.categories,
      icon: FolderOpen,
      gradient: 'gradient-blue',
      href: '/admin/categories',
      change: '+2 this week',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      gradient: 'gradient-green',
      href: '/admin/products',
      change: '+12 this week',
    },
    {
      title: 'Articles',
      value: stats.articles,
      icon: FileText,
      gradient: 'gradient-purple',
      href: '/admin/articles',
      change: '+5 this week',
    },
    {
      title: 'Authors',
      value: stats.authors,
      icon: Users,
      gradient: 'gradient-orange',
      href: '/admin/authors',
      change: '+1 this week',
    },
  ];

  const quickActions = [
    { title: 'New Article', href: '/admin/articles/new', icon: FileText, color: 'bg-purple-500', desc: 'Write content' },
    { title: 'New Product', href: '/admin/products/new', icon: Package, color: 'bg-emerald-500', desc: 'Add product' },
    { title: 'New Category', href: '/admin/categories/new', icon: FolderOpen, color: 'bg-blue-500', desc: 'Create category' },
    { title: 'Homepage', href: '/admin/settings', icon: Home, color: 'bg-pink-500', desc: 'Edit homepage' },
    { title: 'Trending', href: '/admin/trending', icon: TrendingUp, color: 'bg-orange-500', desc: 'Manage trending' },
    { title: 'View Site', href: '/', icon: ExternalLink, color: 'bg-slate-600', desc: 'Open website', external: true },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center animate-pulse">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden gradient-primary rounded-2xl p-6 text-white shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-white/80 text-sm font-medium">Welcome back!</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Good to see you, Admin</h2>
            <p className="text-white/70 text-sm max-w-md">
              Manage your content, products, and settings from this dashboard. Use the sidebar to navigate.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admin/articles/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              <Plus className="w-4 h-4" />
              New Article
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-primary rounded-xl text-sm font-medium hover:bg-white/90 transition shadow-lg"
            >
              <Eye className="w-4 h-4" />
              View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="stat-card group"
              style={{ '--stat-gradient': stat.gradient === 'gradient-blue' ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)' :
                        stat.gradient === 'gradient-green' ? 'linear-gradient(90deg, #10b981, #059669)' :
                        stat.gradient === 'gradient-purple' ? 'linear-gradient(90deg, #8b5cf6, #6d28d9)' :
                        'linear-gradient(90deg, #f97316, #ea580c)' } as React.CSSProperties}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="stat-card-label">{stat.title}</p>
                  <p className="stat-card-value mt-1">{stat.value}</p>
                </div>
                <div className={`stat-card-icon ${stat.gradient}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-primary transition flex items-center gap-1">
                  View all
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="admin-card-title">Quick Actions</span>
          </div>
        </div>
        <div className="admin-card-body">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition group"
                >
                  <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-800">{action.title}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              <span className="admin-card-title">Recent Articles</span>
            </div>
            <Link href="/admin/articles" className="text-xs text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-primary transition">
                      {article.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`admin-badge ${article.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      <span className={`status-dot ${article.status === 'published' ? 'status-dot-live' : 'status-dot-draft'}`} />
                      {article.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="admin-empty-state">
                <div className="admin-empty-state-icon">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="admin-empty-state-title">No articles yet</p>
                <p className="admin-empty-state-text">Create your first article to get started.</p>
                <Link href="/admin/articles/new" className="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
                  <Plus className="w-4 h-4" />
                  Create Article
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" />
              <span className="admin-card-title">Recent Products</span>
            </div>
            <Link href="/admin/products" className="text-xs text-primary hover:underline font-medium">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-primary transition">
                      {product.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      /{product.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`admin-badge ${product.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      <span className={`status-dot ${product.status === 'published' ? 'status-dot-live' : 'status-dot-draft'}`} />
                      {product.status === 'published' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="admin-empty-state">
                <div className="admin-empty-state-icon">
                  <Package className="w-6 h-6" />
                </div>
                <p className="admin-empty-state-title">No products yet</p>
                <p className="admin-empty-state-text">Add your first product to get started.</p>
                <Link href="/admin/products/new" className="inline-flex items-center gap-2 px-4 py-2 gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="admin-card bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
        <div className="admin-card-body flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Need help getting started?</h3>
            <p className="text-sm text-slate-300 mb-4">
              Use the sidebar to navigate between different sections. Each section has its own list view and edit forms.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">Categories - Manage topics</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">Products - Add/edit products</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">Articles - Write content</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">Homepage - Configure layout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
