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
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form Section */}
      <div className={`${isDesktop ? 'w-1/2' : 'w-full'} flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 relative`}>
        {/* Subtle Aviation Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#1e40af" stroke-width="1" opacity="0.3">
                  <path d="M40 10 L60 30 L40 50 L20 30 Z"/>
                  <circle cx="40" cy="40" r="15"/>
                  <path d="M10 40 L70 40 M40 10 L40 70"/>
                </g>
              </svg>
            `)}")`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        <div className="relative z-10 w-full max-w-md px-6 py-8">
          {/* Mobile Header */}
          {!isDesktop && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-6">
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
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Aviation Theory Services</h1>
              <p className="text-sm text-slate-600">ATPL Training Platform</p>
            </div>
          )}

          {/* Main Form Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot-password' && 'Reset Password'}
              </h2>
              <p className="text-slate-600 mt-2">
                {mode === 'login' && 'Sign in to continue your training'}
                {mode === 'signup' && 'Join the aviation training platform'}
                {mode === 'forgot-password' && 'Enter your email to reset password'}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                  placeholder="your.email@domain.com"
                  required
                />
              </div>

              {/* Password Field (not for forgot password) */}
              {mode !== 'forgot-password' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    placeholder="Enter your password"
                    required
                    {...(mode === 'signup' ? { minLength: 6 } : {})}
                  />
                </div>
              )}

              {/* Confirm Password (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {/* Additional signup fields */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name <span className="text-slate-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Student ID <span className="text-slate-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Your student ID"
                    />
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] ${loading ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
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
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <div className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('signup')}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
              
              {mode === 'signup' && (
                <div className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}
              
              {mode === 'forgot-password' && (
                <div className="text-sm text-slate-600">
                  Remember your password?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>

            {/* Test Admin Login (Development Only) */}
            {mode === 'login' && (
              <div className="mt-6 pt-4 border-t border-slate-200">
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
                  className="w-full text-xs text-slate-500 hover:text-blue-600 transition-colors duration-200 py-2 px-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50"
                >
                  🔧 Fill Admin Credentials (Test)
                </button>
              </div>
            )}

            {/* Benefits and Security Notice */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center space-y-3">
                <div className="text-xs text-slate-700">
                  <p className="font-medium mb-2">Access Your ATPL Study Platform:</p>
                  <div className="space-y-1 text-slate-500">
                    <p>✈️ Comprehensive course notes</p>
                    <p>📝 Practice questions & exams</p>
                    <p>🗺️ Flight planning tools</p>
                    <p>📊 Progress analytics</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                  🔒 Secure authentication required
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-slate-500">
            <p>© 2024 Aviation Theory Services. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Aviation Hero Section */}
      {isDesktop && (
        <div className="w-1/2 relative overflow-hidden">
          {/* Main Hero Background with Aircraft Silhouette */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800">
            {/* Sky gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-blue-400/20"></div>
          </div>
          
          {/* Aircraft Silhouette - Large Commercial Jet */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-96 h-96 text-white/10 transform -rotate-12" 
              viewBox="0 0 400 400" 
              fill="currentColor"
            >
              {/* Commercial Aircraft Silhouette */}
              <path d="M200 50 L380 200 L360 220 L200 180 L40 220 L20 200 L200 50 Z M200 180 L200 350 L220 370 L240 350 L240 320 L200 320 L160 320 L160 350 L180 370 L200 350 Z M80 160 L120 180 L80 200 L60 180 Z M320 160 L360 180 L320 200 L340 180 Z"/>
              {/* Wings */}
              <ellipse cx="200" cy="200" rx="160" ry="20" opacity="0.3"/>
              {/* Fuselage highlight */}
              <ellipse cx="200" cy="200" rx="8" ry="140" opacity="0.5"/>
            </svg>
          </div>
          
          {/* Flight Path Lines */}
          <div className="absolute inset-0">
            <svg className="w-full h-full text-white/5" viewBox="0 0 500 500">
              <defs>
                <pattern id="flightPath" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M0,50 Q25,25 50,50 T100,50" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,10"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#flightPath)"/>
            </svg>
          </div>
          
          {/* Navigation Instruments Overlay */}
          <div className="absolute top-8 right-8 text-white/20">
            <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="40" strokeWidth="2"/>
              <path d="M50,10 L50,30 M50,70 L50,90 M10,50 L30,50 M70,50 L90,50" strokeWidth="1"/>
              <circle cx="50" cy="50" r="3" fill="currentColor"/>
              <path d="M50,20 L55,35 L50,50 L45,35 Z" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Altitude Indicator */}
          <div className="absolute bottom-8 left-8 text-white/20">
            <svg className="w-16 h-32" viewBox="0 0 60 120" fill="none" stroke="currentColor">
              <rect x="10" y="10" width="40" height="100" rx="20" strokeWidth="2"/>
              <path d="M15,30 L45,30 M15,40 L40,40 M15,50 L45,50 M15,60 L40,60 M15,70 L45,70 M15,80 L40,80 M15,90 L45,90" strokeWidth="1"/>
              <rect x="20" y="55" width="20" height="10" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full px-12 text-white">
            <div className="text-center max-w-md">
              {/* Logo with Glow Effect */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-lg rounded-2xl mb-8 shadow-2xl border border-white/20">
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
                        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 2-3.5 3.5L11 16l-8.2 1.8c-.5.1-.8.6-.8 1.1s.3 1 .8 1.1L11 21l5.5-1.5c.4-.1.8-.6.8-1.1s-.4-1-.5-1.2z" />
                        </svg>
                      `;
                    }
                  }}
                />
              </div>
              
              {/* Hero Text */}
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Aviation Theory Services
              </h1>
              <p className="text-xl text-blue-200 mb-8 font-light">
                Professional ATPL Training Platform
              </p>
              
              {/* Feature Highlights */}
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Comprehensive Flight Planning Tools</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Interactive Performance Calculations</span>
                </div>
                <div className="flex items-center space-x-3 text-white/80">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm">Real-World Aviation Scenarios</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle Animated Elements */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;