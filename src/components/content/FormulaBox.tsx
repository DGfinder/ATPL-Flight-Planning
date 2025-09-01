import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Formula {
  name: string;
  expression: string;
  description: string;
  variables: Array<{ symbol: string; description: string; unit?: string }>;
  category: 'speed' | 'fuel' | 'navigation' | 'performance' | 'weight';
}

interface FormulaBoxProps {
  formulas: Formula[];
  title?: string;
  className?: string;
}

const FormulaBox: React.FC<FormulaBoxProps> = ({
  formulas,
  title = "Key Formulas",
  className = ""
}) => {
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed': return 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700';
      case 'fuel': return 'from-amber-50 to-orange-50 border-amber-200 text-amber-700';
      case 'navigation': return 'from-green-50 to-emerald-50 border-green-200 text-green-700';
      case 'performance': return 'from-purple-50 to-violet-50 border-purple-200 text-purple-700';
      case 'weight': return 'from-red-50 to-rose-50 border-red-200 text-red-700';
      default: return 'from-gray-50 to-slate-50 border-gray-200 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'fuel':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'navigation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        );
      case 'performance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'weight':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  if (formulas.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`formula-box-container ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-aviation-primary/10 via-blue-50 to-indigo-50 rounded-t-2xl p-6 border border-aviation-primary/20 border-b-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-aviation-primary text-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-aviation-primary/70">{formulas.length} formula{formulas.length !== 1 ? 's' : ''} available</p>
          </div>
        </div>
      </div>

      {/* Formula Cards */}
      <div className="bg-white rounded-b-2xl border border-aviation-primary/20 border-t-0 p-6 space-y-4">
        {formulas.map((formula, index) => (
          <motion.div
            key={formula.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-gradient-to-br ${getCategoryColor(formula.category)} border rounded-xl p-6 group hover:shadow-lg transition-all duration-300 formula-box-glow`}
          >
            {/* Formula Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-current text-white rounded-lg flex items-center justify-center bg-opacity-80">
                  {getCategoryIcon(formula.category)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{formula.name}</h4>
                  <p className="text-sm opacity-80 capitalize">{formula.category} calculation</p>
                </div>
              </div>
              <button
                onClick={() => setExpandedFormula(expandedFormula === formula.name ? null : formula.name)}
                className="w-8 h-8 bg-white/50 hover:bg-white/70 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${expandedFormula === formula.name ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Formula Expression */}
            <div className="formula-expression rounded-lg p-4 mb-4 shadow-sm">
              <div className="formula-math-notation text-lg font-bold text-center tracking-wide text-gray-900">
                {formula.expression}
              </div>
            </div>

            {/* Formula Description */}
            <p className="text-sm mb-4 opacity-90 leading-relaxed">
              {formula.description}
            </p>

            {/* Variable Definitions - Expandable */}
            <motion.div
              initial={false}
              animate={{
                height: expandedFormula === formula.name ? 'auto' : 0,
                opacity: expandedFormula === formula.name ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {expandedFormula === formula.name && (
                <div className="bg-white/40 rounded-lg p-4 border border-white/60">
                  <h5 className="font-semibold text-sm mb-3 opacity-90">Variable Definitions:</h5>
                  <div className="space-y-2">
                    {formula.variables.map((variable, varIndex) => (
                      <div key={varIndex} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-aviation-primary/20 text-aviation-primary rounded-lg flex items-center justify-center text-sm font-mono font-bold">
                          {variable.symbol}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{variable.description}</div>
                          {variable.unit && (
                            <div className="text-xs text-gray-600 mt-1">Unit: {variable.unit}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Quick reference badge */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium border border-white/40">
              {formula.category.toUpperCase()}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FormulaBox;