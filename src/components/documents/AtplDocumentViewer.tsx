import React, { useState, useRef, useEffect } from 'react';
import type { AtplDocument } from '../../types';

interface AtplDocumentViewerProps {
  document: AtplDocument;
  className?: string;
}

const AtplDocumentViewer: React.FC<AtplDocumentViewerProps> = ({
  document,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get document URL - prefer pdfUrl over pdfPath
  const documentUrl = document.pdfUrl || document.pdfPath;
  const isTextContent = !documentUrl && document.description && document.description.length > 200;

  useEffect(() => {
    if (documentUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [documentUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleIframeError = () => {
    setError('Failed to load document. Please check your internet connection or try downloading the PDF.');
    setIsLoading(false);
  };

  const handleFullscreenToggle = () => {
    if (!fullscreen && containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setFullscreen(true);
      }
    } else {
      if (window.document.exitFullscreen) {
        window.document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const handleDownload = () => {
    if (documentUrl) {
      const link = window.document.createElement('a');
      link.href = documentUrl;
      link.download = `${document.title}.pdf`;
      link.click();
    }
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    } else if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  if (!documentUrl) {
    return (
      <div className={`atpl-document-viewer ${className}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{document.title}</h3>
            <p className="text-gray-600 mb-4">{document.description}</p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
              <span>📄</span>
              <span>Document will be available soon</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`atpl-document-viewer ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Document Header */}
        <div className="bg-gray-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{document.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{document.description}</p>
              {document.subtopics && document.subtopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.subtopics.map((subtopic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {subtopic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Document Info */}
            <div className="ml-4 flex items-center space-x-4 text-sm text-gray-600">
              {document.pageCount && (
                <span>📄 {document.pageCount} pages</span>
              )}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Zoom controls */}
              <div className="flex items-center space-x-1 bg-white rounded border border-gray-300">
                <button
                  onClick={zoomOut}
                  className="p-1 hover:bg-gray-100 text-sm"
                  title="Zoom Out"
                >
                  🔍-
                </button>
                <span className="px-2 text-xs text-gray-600 min-w-[50px] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-1 hover:bg-gray-100 text-sm"
                  title="Zoom In"
                >
                  🔍+
                </button>
                <button
                  onClick={resetZoom}
                  className="p-1 hover:bg-gray-100 text-xs border-l border-gray-300"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Action buttons */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="Print"
              >
                <span>🖨️</span>
                <span className="hidden sm:inline">Print</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="Download"
              >
                <span>⬇️</span>
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={handleFullscreenToggle}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                title="Fullscreen"
              >
                <span>{fullscreen ? '🔍️' : '🔍'}</span>
                <span className="hidden sm:inline">{fullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>

              <button
                onClick={() => window.open(documentUrl, '_blank')}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Open in new tab"
              >
                <span>🔗</span>
                <span className="hidden sm:inline">New Tab</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="relative" style={{ height: '600px' }}>
          {isTextContent ? (
            // Text content display
            <div className="h-full overflow-y-auto p-6 bg-white">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed" style={{ fontSize: `${scale}em` }}>
                  {document.description}
                </div>
              </div>
            </div>
          ) : documentUrl ? (
            // PDF viewer
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    <p className="text-gray-600 text-sm">Loading document...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                  <div className="text-center max-w-md">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <p className="text-red-600 text-sm mb-4">{error}</p>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setError(null);
                          setIsLoading(true);
                          if (iframeRef.current) {
                            iframeRef.current.src = documentUrl;
                          }
                        }}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Retry
                      </button>
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Download Instead
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                src={documentUrl}
                title={document.title}
                className={`w-full h-full border-0 ${isLoading || error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </>
          ) : (
            // No content available
            <div className="h-full flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Coming Soon</h3>
                <p className="text-gray-600">This topic content will be available soon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with reading progress */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>📖 {document.title}</span>
              {document.pageCount && (
                <span>Page 1 of {document.pageCount}</span>
              )}
            </div>
            <div className="text-xs">
              <span>Use browser controls to navigate pages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtplDocumentViewer;