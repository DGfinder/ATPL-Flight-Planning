import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

const AppStatus: React.FC = () => {
  const { user, loading } = useAuth();
  const [supabaseStatus, setSupabaseStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('questions').select('count(*)').limit(1);
        if (error) {
          setSupabaseStatus('error');
          setError(error.message);
        } else {
          setSupabaseStatus('connected');
        }
      } catch (err) {
        setSupabaseStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 max-w-sm">
      <h3 className="font-bold text-lg mb-2 text-aviation-navy">App Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Auth Loading:</span>
          <span className={`text-sm px-2 py-1 rounded ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {loading ? 'Loading...' : 'Ready'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">User:</span>
          <span className="text-sm text-gray-600">
            {user ? user.email : 'Guest'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Supabase:</span>
          <span className={`text-sm px-2 py-1 rounded ${
            supabaseStatus === 'connected' ? 'bg-green-100 text-green-800' :
            supabaseStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {supabaseStatus === 'connected' ? '✅ Connected' :
             supabaseStatus === 'error' ? '❌ Error' :
             '🔄 Connecting...'}
          </span>
        </div>

        {error && (
          <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Environment: {import.meta.env.DEV ? 'Development' : 'Production'}
        </div>
      </div>
    </div>
  );
};

export default AppStatus;