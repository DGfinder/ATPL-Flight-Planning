import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Map, 
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  User,
  LogOut,
  Plane
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Breadcrumb from '../ui/Breadcrumb';

const Layout: React.FC = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Course Notes',
      path: '/notes',
      icon: BookOpen,
    },
    {
      name: 'Practice Questions',
      path: '/questions',
      icon: HelpCircle,
    },
    {
      name: 'Trial Exam',
      path: '/exam',
      icon: Clock,
    },
    {
      name: 'Flight Planning',
      path: '/flight-plan',
      icon: Map,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
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

  const SidebarContent = () => (
    <>
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-slate-200">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-aviation-primary to-aviation-secondary rounded-lg">
          <Plane className="w-4 h-4 text-white" />
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <div className="flex flex-col">
            <span className="font-bold text-aviation-navy text-sm leading-tight">Aviation Theory Services</span>
            <span className="text-xs text-aviation-muted leading-tight">ATPL Training Platform</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-aviation-primary text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-aviation-primary'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-aviation-primary'
                }`} />
                {(!sidebarCollapsed || isMobile) && (
                  <span className="truncate">{item.name}</span>
                )}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-slate-200 p-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-aviation-primary to-aviation-secondary text-xs font-semibold text-white">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-xs font-medium text-slate-900 truncate">
                      {user.email}
                    </span>
                    <span className="text-[10px] text-slate-500">Authenticated</span>
                  </div>
                  <ChevronLeft className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-90' : '-rotate-90'}`} />
                </>
              )}
            </button>

            {/* User Menu */}
            {showUserMenu && (!sidebarCollapsed || isMobile) && (
              <div className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200">
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="group flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-aviation-primary to-aviation-secondary px-3 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:from-aviation-navy hover:to-aviation-secondary hover:shadow-md"
          >
            {sidebarCollapsed && !isMobile ? (
              <User className="h-4 w-4" />
            ) : (
              'Sign In'
            )}
          </Link>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-light via-white to-aviation-accent">
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-lg border border-slate-200 text-slate-600 hover:text-aviation-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} fixed inset-y-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200 transition-all duration-300`}>
          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-aviation-primary transition-colors"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          
          {/* Mobile Sidebar */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className={`flex flex-1 flex-col ${isMobile ? '' : sidebarCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-aviation-navy via-aviation-primary to-aviation-navy text-white shadow-lg">
          <div className={`px-6 py-3 ${isMobile ? 'ml-16' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Breadcrumb />
              </div>
              <div className="flex items-center space-x-4">
                {/* Future: Quick actions or search */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-6">
            {/* DEBUG: Layout is rendering */}
            <div className="bg-blue-100 border border-blue-300 p-2 mb-4 text-xs">
              🔍 Layout Debug: Current path = {location.pathname} | Time = {new Date().toISOString()}
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Layout;