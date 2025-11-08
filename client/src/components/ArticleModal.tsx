import React from 'react';
import { ArticleModalProps } from '../types/guide';

export default function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!isOpen || !article) return null;

  // Safe content access with fallbacks
  const headline = article.content?.headline || article.title;
  const intro = article.content?.intro || 'No introduction available.';
  const sections = article.content?.sections || [];
  const category = article.category || 'Uncategorized';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-6 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
              <h1 className="text-2xl font-bold mt-2">{headline}</h1>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 text-2xl ml-4 flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-700 text-lg mb-6">{intro}</p>

          {sections.length > 0 ? (
            sections.map((section: any, index: number) => (
              <div key={index} className="mb-6">
                <h2 className="text-xl font-bold text-bloomPink mb-3">
                  {section.title || `Section ${index + 1}`}
                </h2>
                {section.content && (
                  <p className="text-gray-700 mb-3">{section.content}</p>
                )}
                {section.points && section.points.length > 0 && (
                  <ul className="space-y-2">
                    {section.points.map((point: string, pointIndex: number) => (
                      <li key={pointIndex} className="flex items-start">
                        <span className="text-bloomPink mr-2 mt-1 flex-shrink-0">•</span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No detailed content available for this article.</p>
            </div>
          )}

          {/* External link button for full article */}
          {article.externalLink && (
            <div className="mt-8 text-center">
              <a
                href={article.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
              >
                <span>Read Full Article</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Opens in new window
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}