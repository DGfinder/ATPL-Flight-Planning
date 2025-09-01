import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { databaseService } from '../services/database';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email) return 'Email is required';
    if (mode !== 'forgot-password' && !formData.password) return 'Password is required';
    
    // Only validate password length for signup, not login
    if (mode === 'signup') {
      if (formData.password.length < 6) return 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { error } = await databaseService.signIn(formData.email, formData.password);
        if (error) {
          throw error;
        }
        
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } 
      else if (mode === 'signup') {
        const { error } = await databaseService.signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          student_id: formData.studentId
        });
        if (error) throw error;
        
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setMode('login');
      }
      else if (mode === 'forgot-password') {
        // TODO: Implement forgot password with Supabase
        setSuccess('If an account with this email exists, you will receive a password reset link.');
      }
    } catch (err) {
      // Provide specific error messages based on error type
      if (err instanceof Error) {
        // Common Supabase auth error messages
        if (err.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (err.message.includes('Email not confirmed')) {
          setError('Please confirm your email address before signing in.');
        } else if (err.message.includes('Password should be at least')) {
          setError('Password does not meet requirements. Please try again or reset your password.');
        } else {
          setError(`Authentication failed: ${err.message}`);
        }
      } else {
        setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      studentId: ''
    });
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot-password') => {
    setMode(newMode);
    resetForm();
  };

  // Check if screen is desktop size (1024px+)
  const [isDesktop, setIsDesktop] = React.useState(false);
  
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        border: '2px solid red' // Debug border
      }}
    >
      {/* Left Side - Hero Image Section */}
      {isDesktop && (
        <div 
          style={{
            width: '50%',
            position: 'relative',
            display: 'flex',
            border: '2px solid blue' // Debug border
          }}
        >
        {/* Aviation Hero Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #dc2626 100%)',
          }}
        />
        
        {/* Aviation Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1">
                  <path d="M50 20 L70 40 L50 60 L30 40 Z M20 50 L80 50 M50 10 L50 90"/>
                  <circle cx="50" cy="50" r="25"/>
                </g>
              </svg>
            `)}")`,
            backgroundSize: '100px 100px',
            backgroundPosition: '0 0, 50px 50px'
          }}
        />
        
        {/* Subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <div className="max-w-md">
            {/* Large Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 2-3.5 3.5L11 16l-8.2 1.8c-.5.1-.8.6-.8 1.1s.3 1 .8 1.1L11 21l5.5-1.5c.4-.1.8-.6.8-1.1s-.4-1-.5-1.2z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2">Aviation Theory Services</h1>
              <p className="text-xl text-white/90">ATPL Training Platform</p>
            </div>
            
            {/* Hero Benefits */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span className="text-lg">Comprehensive ATPL Study Materials</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-lg">Practice Exams & Question Banks</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span className="text-lg">Flight Planning Tools</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <span className="text-lg">Progress Analytics & Tracking</span>
              </div>
            </div>
            
            {/* Professional Message */}
            <div className="mt-12 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-sm text-white/80 italic">
                "Elevate your aviation career with comprehensive ATPL training designed by industry professionals."
              </p>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Right Side - Login Form Section */}
      <div 
        style={{
          width: isDesktop ? '50%' : '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 50%, #f8fafc 100%)',
          position: 'relative',
          border: '2px solid green' // Debug border
        }}
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd">
                  <g fill="#1e3a8a" fill-opacity="0.1">
                    <path d="M30 0l30 30-30 30L0 30z"/>
                  </g>
                </g>
              </svg>
            `)}")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          {/* Mobile Logo (only visible on mobile) */}
          {!isDesktop && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-aviation-navy to-aviation-primary rounded-2xl shadow-lg mb-6">
            <img 
              src="/favicon.png" 
              alt="Aviation Theory Services"
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement;
                if (fallback) {
                  fallback.innerHTML = `
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 2-3.5 3.5L11 16l-8.2 1.8c-.5.1-.8.6-.8 1.1s.3 1 .8 1.1L11 21l5.5-1.5c.4-.1.8-.6.8-1.1s-.4-1-.5-1.2z" />
                    </svg>
                  `;
                }
              }}
            />
            </div>
          )}
          
          {/* Mobile Branding (only visible on mobile) */}
          {!isDesktop && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-aviation-navy mb-1">Aviation Theory Services</h1>
              <p className="text-sm text-aviation-muted">ATPL Training Platform</p>
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="aviation-card p-8 scale-in">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-aviation-text">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot-password' && 'Reset Password'}
            </h2>
            <p className="text-sm text-aviation-muted mt-1">
              {mode === 'login' && 'Sign in to continue your training'}
              {mode === 'signup' && 'Join the aviation training platform'}
              {mode === 'forgot-password' && 'Enter your email to reset password'}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-gradient-to-r from-aviation-secondary/10 to-aviation-secondary/5 border border-aviation-secondary/20 rounded-xl text-aviation-secondary text-sm">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-25 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-aviation-text mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="aviation-input w-full"
                placeholder="your.email@domain.com"
                required
              />
            </div>

            {/* Password Field (not for forgot password) */}
            {mode !== 'forgot-password' && (
              <div>
                <label className="block text-sm font-medium text-aviation-text mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="aviation-input w-full"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            )}

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-aviation-text mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="aviation-input w-full"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Additional signup fields */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-aviation-text mb-2">
                    Full Name <span className="text-aviation-muted text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="aviation-input w-full"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-aviation-text mb-2">
                    Student ID <span className="text-aviation-muted text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="aviation-input w-full"
                    placeholder="Your student ID"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`aviation-button w-full py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot-password' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Mode switching */}
          <div className="mt-6 text-center space-y-3">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('forgot-password')}
                  className="text-sm text-aviation-primary hover:underline"
                >
                  Forgot your password?
                </button>
                <div className="text-sm text-aviation-muted">
                  Don't have an account?{' '}
                  <button
                    onClick={() => switchMode('signup')}
                    className="text-aviation-primary hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}
            
            {mode === 'signup' && (
              <div className="text-sm text-aviation-muted">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-aviation-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
            
            {mode === 'forgot-password' && (
              <div className="text-sm text-aviation-muted">
                Remember your password?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="text-aviation-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>

          {/* Test Admin Login (Development Only) */}
          {mode === 'login' && (
            <div className="mt-6 pt-4 border-t border-aviation-border/30">
              <button
                type="button"
                onClick={() => {
                  // Pre-fill with admin credentials for testing
                  setFormData(prev => ({
                    ...prev,
                    email: 'admin@example.com',
                    password: 'admin'
                  }));
                  setError(null);
                }}
                className="w-full text-xs text-aviation-muted hover:text-aviation-primary transition-colors duration-200 py-2 px-3 border border-aviation-border/50 rounded-lg hover:border-aviation-primary/30"
              >
                🔧 Fill Admin Credentials (Test)
              </button>
            </div>
          )}

          {/* Benefits and Security Notice */}
          <div className="mt-8 pt-6 border-t border-aviation-border">
            <div className="text-center space-y-3">
              <div className="text-xs text-aviation-text">
                <p className="font-medium mb-2">Access Your ATPL Study Platform:</p>
                <div className="space-y-1 text-aviation-muted">
                  <p>✈️ Comprehensive course notes</p>
                  <p>📝 Practice questions & exams</p>
                  <p>🗺️ Flight planning tools</p>
                  <p>📊 Progress analytics</p>
                </div>
              </div>
              <p className="text-xs text-aviation-muted pt-2 border-t border-aviation-border/50">
                🔒 Secure authentication required
              </p>
            </div>
          </div>
        </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-aviation-muted">
            <p>© 2024 Aviation Theory Services. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;