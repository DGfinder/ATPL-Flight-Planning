import React, { useEffect, useState } from 'react';

interface CSSDiagnosticProps {
  enabled?: boolean;
}

export const CSSLoadingDiagnostic: React.FC<CSSDiagnosticProps> = ({ enabled = true }) => {
  const [diagnostics, setDiagnostics] = useState({
    tailwindLoaded: false,
    aviationColorsLoaded: false,
    stylesheetCount: 0,
    cssRules: 0,
    lastChecked: '',
  });

  useEffect(() => {
    if (!enabled) return;

    const checkCSSLoading = () => {
      try {
        // Check if Tailwind utility classes are working
        const testElement = document.createElement('div');
        testElement.className = 'hidden';
        document.body.appendChild(testElement);
        const hiddenWorks = window.getComputedStyle(testElement).display === 'none';
        document.body.removeChild(testElement);

        // Check if aviation colors are working
        const aviationTest = document.createElement('div');
        aviationTest.className = 'text-aviation-primary';
        document.body.appendChild(aviationTest);
        const aviationColor = window.getComputedStyle(aviationTest).color;
        const aviationColorsWork = aviationColor === 'rgb(30, 58, 138)' || aviationColor === '#1e3a8a';
        document.body.removeChild(aviationTest);

        // Count stylesheets and CSS rules
        const stylesheets = Array.from(document.styleSheets);
        let totalRules = 0;
        stylesheets.forEach(sheet => {
          try {
            totalRules += sheet.cssRules?.length || 0;
          } catch (e) {
            // Cross-origin stylesheets can't be accessed
          }
        });

        setDiagnostics({
          tailwindLoaded: hiddenWorks,
          aviationColorsLoaded: aviationColorsWork,
          stylesheetCount: stylesheets.length,
          cssRules: totalRules,
          lastChecked: new Date().toLocaleTimeString(),
        });

        // Add class to body to indicate aviation colors status
        if (aviationColorsWork) {
          document.body.classList.add('aviation-colors-loaded');
        } else {
          document.body.classList.remove('aviation-colors-loaded');
        }

      } catch (error) {
        console.warn('CSS diagnostic check failed:', error);
      }
    };

    // Initial check
    checkCSSLoading();

    // Check every 2 seconds for first 10 seconds
    const interval = setInterval(checkCSSLoading, 2000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled && process.env.NODE_ENV === 'production') {
    return null;
  }

  const { tailwindLoaded, aviationColorsLoaded, stylesheetCount, cssRules, lastChecked } = diagnostics;

  return (
    <>
      {/* CSS Loading Indicator */}
      <div className="css-loading-indicator">
        ⚠️ CSS Loading Issue Detected
      </div>

      {/* Diagnostic Panel */}
      <div 
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 9999,
          minWidth: '200px',
          lineHeight: '1.4',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#fbbf24' }}>
          🔍 CSS Diagnostics
        </div>
        
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: tailwindLoaded ? '#10b981' : '#ef4444' }}>
            {tailwindLoaded ? '✅' : '❌'}
          </span>
          {' '}Tailwind Base: {tailwindLoaded ? 'OK' : 'FAILED'}
        </div>
        
        <div style={{ marginBottom: '4px' }}>
          <span style={{ color: aviationColorsLoaded ? '#10b981' : '#ef4444' }}>
            {aviationColorsLoaded ? '✅' : '❌'}
          </span>
          {' '}Aviation Colors: {aviationColorsLoaded ? 'OK' : 'FAILED'}
        </div>
        
        <div style={{ marginBottom: '4px' }}>
          📄 Stylesheets: {stylesheetCount}
        </div>
        
        <div style={{ marginBottom: '4px' }}>
          📋 CSS Rules: {cssRules}
        </div>
        
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px' }}>
          Last Check: {lastChecked}
        </div>

        {!aviationColorsLoaded && (
          <div style={{ 
            marginTop: '8px', 
            padding: '6px', 
            background: '#dc2626', 
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            💡 Fallback CSS activated
          </div>
        )}
      </div>
    </>
  );
};

export default CSSLoadingDiagnostic;