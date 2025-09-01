import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FormulaBox from './FormulaBox';
import { FormulaDetection } from '../../utils/formulaDetection';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'example' | 'steps' | 'formula';
  order: number;
}

interface RichContentViewerProps {
  title: string;
  description: string;
  content: string;
  subjectId?: string;
  className?: string;
}

const RichContentViewer: React.FC<RichContentViewerProps> = ({
  title,
  description,
  content,
  subjectId,
  className = ''
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [readingProgress] = useState(0);

  // Parse content into structured sections
  const parseContent = (rawContent: string): ContentSection[] => {
    const sections: ContentSection[] = [];
    const lines = rawContent.split('\n').filter(line => line.trim());
    
    let currentSection: Partial<ContentSection> = {};
    let sectionCounter = 0;
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('Example') || trimmed.includes('Given:') || trimmed.includes('Calculate')) {
        if (currentSection.content) {
          sections.push({
            ...currentSection,
            id: `section-${sectionCounter++}`,
            order: sections.length
          } as ContentSection);
        }
        currentSection = {
          title: trimmed.includes('Example') ? 'Example Calculation' : 'Problem Setup',
          content: trimmed,
          type: 'example'
        };
      } else if (trimmed.match(/^Step \d+\./)) {
        if (currentSection.type !== 'steps') {
          if (currentSection.content) {
            sections.push({
              ...currentSection,
              id: `section-${sectionCounter++}`,
              order: sections.length
            } as ContentSection);
          }
          currentSection = {
            title: 'Calculation Steps',
            content: trimmed,
            type: 'steps'
          };
        } else {
          currentSection.content += '\n' + trimmed;
        }
      } else if (trimmed.includes('=') || trimmed.includes('kts') || trimmed.includes('knots')) {
        if (currentSection.type !== 'formula') {
          if (currentSection.content) {
            sections.push({
              ...currentSection,
              id: `section-${sectionCounter++}`,
              order: sections.length
            } as ContentSection);
          }
          currentSection = {
            title: 'Formulas & Results',
            content: trimmed,
            type: 'formula'
          };
        } else {
          currentSection.content += '\n' + trimmed;
        }
      } else {
        if (currentSection.type !== 'text') {
          if (currentSection.content) {
            sections.push({
              ...currentSection,
              id: `section-${sectionCounter++}`,
              order: sections.length
            } as ContentSection);
          }
          currentSection = {
            title: index === 0 ? 'Introduction' : 'Theory',
            content: trimmed,
            type: 'text'
          };
        } else {
          currentSection.content += '\n' + trimmed;
        }
      }
    });
    
    if (currentSection.content) {
      sections.push({
        ...currentSection,
        id: `section-${sectionCounter++}`,
        order: sections.length
      } as ContentSection);
    }
    
    return sections;
  };

  const sections = parseContent(content);
  
  // Get relevant formulas for this subject
  const subjectFormulas = subjectId ? FormulaDetection.getFormulasForSubject(subjectId) : [];
  const contentFormulas = FormulaDetection.extractFormulasFromContent(content);
  const allFormulas = [...subjectFormulas, ...contentFormulas];

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'example':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'steps':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
      case 'formula':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case 'example': return 'from-amber-50 to-orange-50 border-amber-200';
      case 'steps': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'formula': return 'from-green-50 to-emerald-50 border-green-200';
      default: return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  const renderFormattedContent = (content: string, type: string) => {
    if (type === 'steps') {
      return content.split('\n').map((step, index) => (
        <div key={index} className="flex items-start space-x-3 mb-3 last:mb-0">
          <div className="w-6 h-6 bg-aviation-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
            {index + 1}
          </div>
          <p className="text-gray-700 leading-relaxed flex-1">{step.replace(/^Step \d+\.\s*/, '')}</p>
        </div>
      ));
    }
    
    if (type === 'formula') {
      return content.split('\n').map((line, index) => (
        <div key={index} className="font-mono text-sm bg-gray-100 px-3 py-2 rounded mb-2 last:mb-0">
          {line}
        </div>
      ));
    }
    
    return (
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    );
  };

  return (
    <div className={`rich-content-viewer ${className}`}>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-aviation-primary via-blue-600 to-aviation-secondary rounded-2xl p-8 mb-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              <p className="text-blue-100 leading-relaxed">{description}</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
            <span className="text-sm text-blue-100">{Math.round(readingProgress)}% complete</span>
          </div>
        </div>
      </div>

      {/* Formula Boxes - Display when formulas are available */}
      {allFormulas.length > 0 && (
        <FormulaBox
          formulas={allFormulas}
          title="Aviation Formulas"
          className="mb-8"
        />
      )}

      {/* Content Sections */}
      <div className="space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gradient-to-br ${getSectionColor(section.type)} border rounded-xl p-6 group hover:shadow-lg transition-all duration-300`}
          >
            {/* Section Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-aviation-primary text-white rounded-lg flex items-center justify-center">
                {getSectionIcon(section.type)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="ml-auto w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg 
                  className={`w-6 h-6 transition-transform duration-200 ${activeSection === section.id ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Section Content */}
            <div className={`overflow-hidden transition-all duration-300 ${
              activeSection === section.id || section.type === 'text' ? 'max-h-none' : 'max-h-24'
            }`}>
              {renderFormattedContent(section.content, section.type)}
            </div>
            
            {/* Expand/Collapse for non-text sections */}
            {section.type !== 'text' && activeSection !== section.id && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                <button
                  onClick={() => setActiveSection(section.id)}
                  className="text-xs text-aviation-primary hover:text-aviation-secondary font-medium"
                >
                  Click to expand
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Concepts Summary */}
      <div className="mt-8 bg-gradient-to-br from-aviation-primary/5 to-blue-50 rounded-xl p-6 border border-aviation-primary/10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-aviation-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span>Key Concepts</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">TAS vs ETAS</h4>
            <p className="text-sm text-gray-600">Effective True Air Speed accounts for drift angle effects on actual track speed</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Wind Components</h4>
            <p className="text-sm text-gray-600">Crosswind and headwind/tailwind calculations using the flight computer</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Drift Angle</h4>
            <p className="text-sm text-gray-600">Calculate heading corrections for crosswind effects</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Ground Speed</h4>
            <p className="text-sm text-gray-600">Final ground speed after ETAS and wind component corrections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichContentViewer;