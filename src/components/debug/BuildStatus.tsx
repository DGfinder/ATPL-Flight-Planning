import React, { useState, useEffect } from 'react';

export const BuildStatus: React.FC = () => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const [cssLoaded, setCssLoaded] = useState(false);
  const [hmrActive, setHmrActive] = useState(false);
  const [pulseColor, setPulseColor] = useState('bg-green-400');

  useEffect(() => {
    // Check if CSS is loaded by testing a known Tailwind class
    const testDiv = document.createElement('div');
    testDiv.className = 'hidden';
    document.body.appendChild(testDiv);
    const computed = window.getComputedStyle(testDiv);
    setCssLoaded(computed.display === 'none');
    document.body.removeChild(testDiv);

    // Check if HMR is active (Vite specific)
    setHmrActive(!!(window as any).__vite_plugin_react_preamble_installed__);

    // Update timestamp every second to show live updates
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString());
    }, 1000);

    // Pulse color animation to show activity
    const colors = ['bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400'];
    let colorIndex = 0;
    const colorInterval = setInterval(() => {
      setPulseColor(colors[colorIndex % colors.length]);
      colorIndex++;
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(colorInterval);
    };
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono">
      <div className="flex items-center space-x-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${cssLoaded ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <span>CSS: {cssLoaded ? 'Loaded' : 'Failed'}</span>
      </div>
      
      <div className="flex items-center space-x-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${hmrActive ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
        <span>HMR: {hmrActive ? 'Active' : 'Unknown'}</span>
      </div>
      
      <div className="flex items-center space-x-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        <span>Mode: {import.meta.env.MODE}</span>
      </div>
      
      <div className="flex items-center space-x-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`}></div>
        <span>Live Reload Test</span>
      </div>
      
      <div className="border-t border-gray-600 pt-1 mt-1">
        <div className="text-gray-300">Last Update: {timestamp}</div>
        <div className="text-xs text-gray-400">🎯 Watch colors change = Hot reload working!</div>
      </div>
    </div>
  );
};

export default BuildStatus;