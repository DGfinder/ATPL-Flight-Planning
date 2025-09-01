import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Breadcrumb from '../ui/Breadcrumb';

const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Course Notes',
      path: '/notes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Practice Questions',
      path: '/questions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Trial Exam',
      path: '/exam',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Flight Planning',
      path: '/flight-plan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-light via-white to-aviation-accent flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-slate-200 flex flex-col transition-all duration-300 shadow-sm z-30`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <img 
              src="/favicon.png" 
              alt="Aviation Theory Services"
              className={`${sidebarCollapsed ? 'h-8' : 'h-10'} w-auto object-contain transition-all duration-300`}
            />
            {!sidebarCollapsed && (
              <div>
                <div className="font-bold text-aviation-text text-sm">Aviation Theory Services</div>
                <div className="text-xs text-aviation-muted">ATPL Training Platform</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg 
              className={`w-4 h-4 text-slate-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`sidebar-nav-item flex items-center space-x-3 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'text-aviation-primary bg-aviation-primary/5 border border-aviation-primary/10'
                  : 'text-slate-700 hover:text-aviation-primary hover:bg-slate-50'
              }`}
            >
              <div className={`flex-shrink-0 ${isActivePath(item.path) ? 'text-aviation-primary' : 'text-slate-400'}`}>
                {item.icon}
              </div>
              {!sidebarCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-100">
          {user ? (
            <div className="space-y-3">
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {user.email}
                        </div>
                        <div className="text-xs text-slate-500">Authenticated</div>
                      </div>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>

                {showUserMenu && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-aviation-primary to-aviation-secondary hover:from-aviation-navy hover:to-aviation-secondary text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg text-center block"
            >
              {sidebarCollapsed ? (
                <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : (
                'Sign In'
              )}
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-aviation-navy via-aviation-primary to-aviation-navy text-white shadow-lg z-20">
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Breadcrumb */}
              <div className="flex-1">
                <Breadcrumb />
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Quick Actions can go here */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Layout;