import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
        if (error) throw error;
        
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
      setError(err instanceof Error ? err.message : 'Authentication failed');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-aviation-light via-white to-aviation-accent flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
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

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-aviation-navy to-aviation-primary rounded-2xl shadow-lg mb-6">
            <img 
              src="/favicon.png" 
              alt="Aviation Theory Services"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement;
                if (fallback) {
                  fallback.innerHTML = `
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  `;
                }
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-aviation-navy mb-2">Aviation Theory Services</h1>
          <p className="text-aviation-muted">ATPL Training Platform</p>
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

          {/* Guest Access */}
          <div className="mt-8 pt-6 border-t border-aviation-border">
            <div className="text-center">
              <p className="text-xs text-aviation-muted mb-3">
                Want to try before signing up?
              </p>
              <Link
                to="/dashboard"
                className="aviation-button-ghost inline-flex items-center space-x-2 px-4 py-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Continue as Guest</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-aviation-muted">
          <p>© 2024 Aviation Theory Services. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;