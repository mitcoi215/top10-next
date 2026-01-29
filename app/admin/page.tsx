'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
      // Fetch stats
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
        articles: Array.isArray(articles) ? articles.length : 0,
        authors: Array.isArray(authors) ? authors.length : 0,
      });

      // Set recent items
      if (Array.isArray(articles)) {
        setRecentArticles(articles.slice(0, 5).map((a: { id: string; title: string; slug: string; createdAt: string; status: string }) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          createdAt: a.createdAt,
          status: a.status,
        })));
      }

      if (Array.isArray(products)) {
        setRecentProducts(products.slice(0, 5).map((p: { id: string; name: string; slug: string; createdAt: string; status: string }) => ({
          id: p.id,
          title: p.name,
          slug: p.slug,
          createdAt: p.createdAt,
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
      title: 'Danh mục',
      value: stats.categories,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      href: '/admin/categories',
    },
    {
      title: 'Sản phẩm',
      value: stats.products,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'from-emerald-500 to-emerald-600',
      href: '/admin/products',
    },
    {
      title: 'Bài viết',
      value: stats.articles,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      href: '/admin/articles',
    },
    {
      title: 'Tác giả',
      value: stats.authors,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      href: '/admin/authors',
    },
  ];

  const quickActions = [
    { title: 'Thêm bài viết', href: '/admin/articles/new', icon: '📝', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { title: 'Thêm sản phẩm', href: '/admin/products/new', icon: '📦', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
    { title: 'Thêm danh mục', href: '/admin/categories/new', icon: '📁', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { title: 'Cài đặt trang chủ', href: '/admin/settings', icon: '🏠', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { title: 'Danh mục xu hướng', href: '/admin/trending', icon: '📈', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { title: 'Xem website', href: '/', icon: '🌐', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200', external: true },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại!</h2>
        <p className="opacity-90">Quản lý nội dung website của bạn tại đây. Sử dụng sidebar để điều hướng giữa các mục.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white group-hover:scale-110 transition`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              target={action.external ? '_blank' : undefined}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${action.color}`}
            >
              <span>{action.icon}</span>
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Bài viết gần đây</h3>
            <Link href="/admin/articles" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentArticles.length > 0 ? (
              recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(article.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                    article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có bài viết nào</p>
                <Link href="/admin/articles/new" className="text-pink-600 hover:text-pink-700 font-medium text-sm mt-1 inline-block">
                  Tạo bài viết đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Sản phẩm gần đây</h3>
            <Link href="/admin/products" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.slug}</p>
                  </div>
                  <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>Chưa có sản phẩm nào</p>
                <Link href="/admin/products/new" className="text-pink-600 hover:text-pink-700 font-medium text-sm mt-1 inline-block">
                  Tạo sản phẩm đầu tiên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-900 rounded-xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Cần trợ giúp?</h3>
            <p className="text-sm text-slate-300 mb-3">
              Sử dụng sidebar để điều hướng giữa các mục quản lý website.
              Mỗi mục đều có danh sách và form chỉnh sửa riêng.
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-2 py-1 bg-white/10 rounded">Danh mục - Quản lý chủ đề</span>
              <span className="px-2 py-1 bg-white/10 rounded">Sản phẩm - Thêm/sửa sản phẩm</span>
              <span className="px-2 py-1 bg-white/10 rounded">Bài viết - Viết nội dung</span>
              <span className="px-2 py-1 bg-white/10 rounded">Trang chủ - Cấu hình homepage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
