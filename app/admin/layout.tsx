'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  FileText,
  Users,
  Home,
  TrendingUp,
  FileCode,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Bell,
  Search,
  Loader2,
  Menu,
  X,
  Plus,
  Settings,
  Layers,
} from 'lucide-react';

// Auth Context
interface AuthContextType {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Sidebar Navigation Items
const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'CONTENT',
    isSection: true,
  },
  {
    title: 'Quản lý nội dung',
    href: '/admin/category-manager',
    icon: Layers,
    isNew: true,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderOpen,
    children: [
      { title: 'All Categories', href: '/admin/categories' },
      { title: 'Add New', href: '/admin/categories/new' },
      { title: 'Category Groups', href: '/admin/category-groups' },
    ],
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
    children: [
      { title: 'All Products', href: '/admin/products' },
      { title: 'Add New', href: '/admin/products/new' },
    ],
  },
  {
    title: 'Articles',
    href: '/admin/articles',
    icon: FileText,
    children: [
      { title: 'All Articles', href: '/admin/articles' },
      { title: 'Add New', href: '/admin/articles/new' },
    ],
  },
  {
    title: 'Authors',
    href: '/admin/authors',
    icon: Users,
  },
  {
    title: 'SETTINGS',
    isSection: true,
  },
  {
    title: 'Homepage',
    href: '/admin/settings',
    icon: Home,
  },
  {
    title: 'Trending',
    href: '/admin/trending',
    icon: TrendingUp,
  },
  {
    title: 'Static Pages',
    href: '/admin/static-pages',
    icon: FileCode,
  },
];

// Login Form Component
function LoginForm({ onLogin, error, isLoading }: {
  onLogin: (username: string, password: string) => void;
  error: string;
  isLoading: boolean;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[420px] border border-white/20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl mb-4 shadow-lg">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TOP10 Admin</h1>
          <p className="text-gray-500 mt-1">Sign in to your dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-primary text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

// Sidebar Component
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className={`fixed left-0 top-0 h-full admin-sidebar text-white transition-all duration-300 z-50 flex flex-col ${collapsed ? 'w-[70px]' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">10</span>
            </div>
            <div>
              <span className="font-bold text-base text-white">TOP10</span>
              <span className="text-xs text-slate-500 block -mt-0.5">Admin Panel</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white font-bold text-sm">10</span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-100 transition z-50`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item, index) => {
          if (item.isSection) {
            return !collapsed ? (
              <div key={index} className="pt-6 pb-2 px-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {item.title}
                </span>
              </div>
            ) : (
              <div key={index} className="my-4 mx-3 border-t border-white/10" />
            );
          }

          const Icon = item.icon!;
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.title);
          const active = isActive(item.href!);

          return (
            <div key={index}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={`admin-sidebar-item w-full ${active ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {!collapsed && isExpanded && (
                    <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                      {item.children!.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            pathname === child.href
                              ? 'text-primary bg-primary/10 font-medium'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  className={`admin-sidebar-item ${active ? 'active' : ''}`}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-emerald-500 text-white rounded leading-none">
                          New
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Add Button */}
      {!collapsed && (
        <div className="p-3 border-t border-white/10">
          <Link
            href="/admin/articles/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 gradient-primary rounded-xl text-white text-sm font-medium hover:opacity-90 transition shadow-lg"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      )}
    </aside>
  );
}

// Header Component
function Header({ user, onLogout, sidebarCollapsed }: {
  user: { username: string } | null;
  onLogout: () => void;
  sidebarCollapsed: boolean;
}) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get page info from pathname
  const getPageInfo = () => {
    const routes: Record<string, { title: string; description: string }> = {
      '/admin': { title: 'Dashboard', description: 'Overview of your content' },
      '/admin/categories': { title: 'Categories', description: 'Manage product categories' },
      '/admin/products': { title: 'Products', description: 'Manage products and reviews' },
      '/admin/articles': { title: 'Articles', description: 'Manage blog posts and articles' },
      '/admin/authors': { title: 'Authors', description: 'Manage content authors' },
      '/admin/settings': { title: 'Homepage Settings', description: 'Configure homepage layout' },
      '/admin/trending': { title: 'Trending', description: 'Manage trending content' },
      '/admin/static-pages': { title: 'Static Pages', description: 'Manage static content pages' },
    };

    // Check for exact match first
    if (routes[pathname]) return routes[pathname];

    // Check for partial matches
    for (const route of Object.keys(routes)) {
      if (pathname.startsWith(route) && route !== '/admin') {
        return routes[route];
      }
    }

    return { title: 'Admin', description: '' };
  };

  const pageInfo = getPageInfo();

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 z-40 transition-all duration-300 ${sidebarCollapsed ? 'left-[70px]' : 'left-64'}`}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-bold text-slate-800">{pageInfo.title}</h1>
          {pageInfo.description && (
            <p className="text-xs text-slate-500 -mt-0.5">{pageInfo.description}</p>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <button className="w-9 h-9 rounded-lg border-0 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-lg border-0 bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </button>

          {/* View Site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Site</span>
          </Link>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 mx-1.5" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-lg border-0 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 gradient-primary rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-[11px]">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-slate-700">{user?.username || 'Admin'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200/80 py-1 z-50 animate-scale-in">
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Main Layout
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [error, setError] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser({ username: 'admin' });
      }
    }

    const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
    if (savedCollapsed) {
      setSidebarCollapsed(savedCollapsed === 'true');
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      setUser(data.user);
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
    setUser(null);
  };

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', String(newState));
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-slate-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={error} isLoading={isLoading} />;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login: handleLogin, logout: handleLogout }}>
      <div className="min-h-screen bg-[hsl(220,14%,96%)]">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <Header user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />
        <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'pl-[70px]' : 'pl-64'}`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthContext.Provider>
  );
}
