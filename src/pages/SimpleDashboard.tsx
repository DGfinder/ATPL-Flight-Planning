import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-aviation-navy to-aviation-primary rounded-xl p-6 text-white text-center">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome to ATPL Training Platform
        </h1>
        <p className="text-white/80">
          Master aviation theory with confidence
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Course Notes */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/notes')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Course Notes</h3>
          <p className="text-slate-600 text-sm mb-4">Access comprehensive ATPL theory notes and study materials.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Reading</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Practice Questions */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/questions')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Practice Questions</h3>
          <p className="text-slate-600 text-sm mb-4">Test your knowledge with practice questions across all categories.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Practice</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Trial Exam */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/exam')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-secondary/10 to-aviation-secondary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-secondary/20 group-hover:to-aviation-secondary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Trial Exam</h3>
          <p className="text-slate-600 text-sm mb-4">Take a timed trial exam to simulate real exam conditions.</p>
          <div className="flex items-center text-aviation-secondary text-sm font-medium">
            <span>Start Exam</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Flight Planning */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/flight-plan')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Flight Planning</h3>
          <p className="text-slate-600 text-sm mb-4">Practice flight planning calculations and route optimization.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>Start Planning</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>

        {/* Analytics */}
        <div 
          className="aviation-card p-4 group hover-lift cursor-pointer"
          onClick={() => navigate('/analytics')}
        >
          <div className="relative mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-aviation-navy/10 to-aviation-primary/5 rounded-xl flex items-center justify-center group-hover:from-aviation-navy/20 group-hover:to-aviation-primary/10 transition-all duration-300">
              <svg className="w-4 h-4 text-aviation-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Analytics</h3>
          <p className="text-slate-600 text-sm mb-4">Review detailed analytics and track your learning progress.</p>
          <div className="flex items-center text-aviation-navy text-sm font-medium">
            <span>View Analytics</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;