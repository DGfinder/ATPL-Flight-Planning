import React, { useState } from 'react';
import AtplDocumentViewer from './AtplDocumentViewer';
import RichContentViewer from '../content/RichContentViewer';
import type { AtplDocument } from '../../types';

interface DocumentLibraryProps {
  documents: AtplDocument[];
  title?: string;
  subjectId?: string;
  onDocumentOpen?: (documentId: string) => void;
  className?: string;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  title = 'Course Documents',
  subjectId,
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
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents available</h3>
          <p className="text-gray-600 max-w-md mx-auto">Course documents will be added soon. Check back later for comprehensive study materials.</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'viewer' && selectedDocument) {
    const isRichContent = selectedDocument.description && selectedDocument.description.length > 200;
    
    return (
      <div className={`document-library ${className}`}>
        {/* Back navigation */}
        <div className="mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 px-4 py-2 text-sm bg-aviation-primary/10 hover:bg-aviation-primary/20 text-aviation-primary rounded-xl transition-all duration-200 hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Topics</span>
          </button>
        </div>

        {/* Document content */}
        {isRichContent ? (
          <RichContentViewer
            title={selectedDocument.title}
            description={selectedDocument.description.split('\n')[0]}
            content={selectedDocument.description}
            subjectId={subjectId}
          />
        ) : (
          <AtplDocumentViewer document={selectedDocument} />
        )}
      </div>
    );
  }

  return (
    <div className={`document-library ${className}`}>
      {/* Modern Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-aviation-primary/5 to-blue-50 rounded-2xl p-6 border border-aviation-primary/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-aviation-primary text-white rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
              <p className="text-aviation-primary/80 font-medium">{sortedDocuments.length} documents available</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-aviation-primary">
                {sortedDocuments.filter(doc => doc.pdfUrl || doc.pdfPath).length}
              </div>
              <div className="text-xs text-gray-600">Ready Now</div>
            </div>
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
              className={`group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-aviation-primary/10 transition-all duration-300 transform hover:-translate-y-1 ${
                hasUrl ? 'cursor-pointer hover:border-aviation-primary/30' : 'cursor-not-allowed opacity-75'
              }`}
            >
              {/* Modern document preview */}
              <div className={`h-48 relative overflow-hidden ${
                hasUrl ? 'bg-gradient-to-br from-aviation-primary/5 via-blue-50 to-indigo-50' : 'bg-gray-50'
              }`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${hasUrl ? '1e3a8a' : '9ca3af'}' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>
                
                <div className="relative h-full flex items-center justify-center">
                  <div className={`text-center ${hasUrl ? 'text-aviation-primary' : 'text-gray-400'}`}>
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center ${
                      hasUrl ? 'bg-aviation-primary/10 group-hover:bg-aviation-primary/20' : 'bg-gray-100'
                    } transition-colors duration-300`}>
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold mb-1">
                      {hasUrl ? 'Interactive Theory' : 'Coming Soon'}
                    </p>
                    {document.pageCount && (
                      <p className="text-xs opacity-75">
                        {document.pageCount} sections
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Status badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  hasUrl 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {hasUrl ? 'Available' : 'Pending'}
                </div>
              </div>

              {/* Document info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-aviation-primary transition-colors">
                  {document.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {document.description?.split('\n')[0] || document.description}
                </p>

                {/* Subtopics */}
                {document.subtopics && document.subtopics.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {document.subtopics.slice(0, 3).map((subtopic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-aviation-primary/10 text-aviation-primary text-xs font-medium rounded-lg border border-aviation-primary/20"
                        >
                          {subtopic}
                        </span>
                      ))}
                      {document.subtopics.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                          +{document.subtopics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  {hasUrl ? (
                    <>
                      <button
                        onClick={() => handleDocumentSelect(document)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-aviation-primary text-white font-semibold rounded-xl hover:bg-aviation-primary/90 hover:shadow-lg hover:scale-105 transition-all duration-200 group"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>Study Theory</span>
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(document.pdfUrl || document.pdfPath, '_blank');
                          }}
                          className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>Open</span>
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
                          className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Download</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-500 text-sm font-medium rounded-xl">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Available Soon</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Analytics Dashboard */}
      <div className="mt-12 bg-gradient-to-br from-aviation-primary/5 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-aviation-primary/10">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
          <svg className="w-6 h-6 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Study Progress</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 7a2 2 0 002-2h10a2 2 0 002 2v2M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedDocuments.length}
                </div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedDocuments.filter(doc => doc.pdfUrl || doc.pdfPath).length}
                </div>
                <div className="text-sm text-gray-600">Available Now</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707L16.414 6.707A1 1 0 0015.586 6H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {sortedDocuments.reduce((total, doc) => total + (doc.pageCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Sections</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentLibrary;