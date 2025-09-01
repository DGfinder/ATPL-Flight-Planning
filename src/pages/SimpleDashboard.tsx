import React from 'react';

const SimpleDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-aviation-navy to-aviation-primary rounded-xl p-6 text-white text-center">
        <h1 className="text-2xl font-bold mb-2">
          Simple Dashboard Test
        </h1>
        <p className="text-white/80">
          Testing basic dashboard rendering without complex state
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="aviation-card p-6">
          <h3 className="text-lg font-semibold text-aviation-navy mb-2">Course Notes</h3>
          <p className="text-aviation-muted">Access study materials</p>
        </div>
        
        <div className="aviation-card p-6">
          <h3 className="text-lg font-semibold text-aviation-navy mb-2">Practice Questions</h3>
          <p className="text-aviation-muted">Test your knowledge</p>
        </div>
        
        <div className="aviation-card p-6">
          <h3 className="text-lg font-semibold text-aviation-navy mb-2">Flight Planning</h3>
          <p className="text-aviation-muted">Plan your flights</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;