'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Save token to localStorage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Enter username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Default: admin / admin123
            </p>
          </form>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      title: 'Products',
      description: 'Manage products, rankings, reviews, and comparisons',
      icon: '📦',
      links: [
        { href: '/admin/products', label: 'All Products' },
        { href: '/admin/products/new', label: 'Add New Product' },
      ],
      color: 'bg-blue-500',
    },
    {
      title: 'Categories',
      description: 'Manage categories, hero sections, and methodology',
      icon: '📁',
      links: [
        { href: '/admin/categories', label: 'All Categories' },
        { href: '/admin/categories/new', label: 'Add New Category' },
      ],
      color: 'bg-green-500',
    },
    {
      title: 'Articles',
      description: 'Manage blog posts, charticles, and guides',
      icon: '📝',
      links: [
        { href: '/admin/articles', label: 'All Articles' },
        { href: '/admin/articles/new', label: 'Add New Article' },
      ],
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as <strong>{JSON.parse(localStorage.getItem('admin_user') || '{}').username || 'admin'}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Content Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className={`${section.color} px-4 py-3 flex items-center gap-3`}>
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats (placeholder) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h2>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/products"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                View All Products
              </Link>
              <Link
                href="/admin/categories"
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                View All Categories
              </Link>
              <Link
                href="/admin/articles"
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                View All Articles
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
