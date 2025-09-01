import React, { useState } from 'react';
import AtplDocumentViewer from './AtplDocumentViewer';
import type { AtplDocument } from '../../types';

interface DocumentLibraryProps {
  documents: AtplDocument[];
  title?: string;
  onDocumentOpen?: (documentId: string) => void;
  className?: string;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  title = 'Course Documents',
  onDocumentOpen,
  className = ''
}) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    documents.length > 0 ? documents[0].id : null
  );
  const [viewMode, setViewMode] = useState<'list' | 'viewer'>('list');

  // Sort documents by order
  const sortedDocuments = [...documents].sort((a, b) => a.order - b.order);
  const selectedDocument = selectedDocumentId
    ? sortedDocuments.find(doc => doc.id === selectedDocumentId)
    : null;

  const handleDocumentSelect = (document: AtplDocument) => {
    setSelectedDocumentId(document.id);
    setViewMode('viewer');
    onDocumentOpen?.(document.id);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDocumentId(null);
  };

  if (sortedDocuments.length === 0) {
    return (
      <div className={`document-library ${className}`}>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents available</h3>
          <p className="text-gray-600">Course documents will be added soon.</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'viewer' && selectedDocument) {
    return (
      <div className={`document-library ${className}`}>
        {/* Back navigation */}
        <div className="mb-4">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>←</span>
            <span>Back to Document List</span>
          </button>
        </div>

        {/* Document viewer */}
        <AtplDocumentViewer document={selectedDocument} />
      </div>
    );
  }

  return (
    <div className={`document-library ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-2xl">📚</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{sortedDocuments.length} documents available</p>
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDocuments.map((document) => {
          const hasUrl = document.pdfUrl || document.pdfPath;
          
          return (
            <div
              key={document.id}
              className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 ${
                hasUrl ? 'cursor-pointer hover:border-blue-300' : 'cursor-not-allowed'
              }`}
            >
              {/* Document preview/thumbnail */}
              <div className={`h-48 flex items-center justify-center ${
                hasUrl ? 'bg-gradient-to-br from-red-50 to-red-100' : 'bg-gray-50'
              }`}>
                <div className={`text-center ${hasUrl ? 'text-red-600' : 'text-gray-400'}`}>
                  <div className="text-6xl mb-2">📄</div>
                  <p className="text-sm font-medium">
                    {hasUrl ? 'PDF Document' : 'Coming Soon'}
                  </p>
                  {document.pageCount && (
                    <p className="text-xs text-gray-500 mt-1">
                      {document.pageCount} pages
                    </p>
                  )}
                </div>
              </div>

              {/* Document info */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {document.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {document.description}
                </p>

                {/* Subtopics */}
                {document.subtopics && document.subtopics.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {document.subtopics.slice(0, 3).map((subtopic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {subtopic}
                        </span>
                      ))}
                      {document.subtopics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{document.subtopics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  {hasUrl ? (
                    <>
                      <button
                        onClick={() => handleDocumentSelect(document)}
                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📖 View Document
                      </button>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(document.pdfUrl || document.pdfPath, '_blank');
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                        >
                          🔗 Open in Tab
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const url = document.pdfUrl || document.pdfPath;
                            if (url) {
                              const link = window.document.createElement('a');
                              link.href = url;
                              link.download = `${document.title}.pdf`;
                              link.click();
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full px-4 py-2 bg-gray-100 text-gray-500 text-sm text-center rounded-lg">
                      📄 Available Soon
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {sortedDocuments.length}
            </div>
            <div className="text-sm text-blue-800">Total Documents</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {sortedDocuments.filter(doc => doc.pdfUrl || doc.pdfPath).length}
            </div>
            <div className="text-sm text-green-800">Available Now</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {sortedDocuments.reduce((total, doc) => total + (doc.pageCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-800">Total Pages</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;