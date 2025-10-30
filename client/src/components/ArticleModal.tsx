import React from 'react';

interface ArticleModalProps {
  article: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <h1 className="text-2xl font-bold mt-2">{article.content.headline}</h1>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-700 text-lg mb-6">{article.content.intro}</p>

          {article.content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold text-bloomPink mb-3">{section.title}</h2>
              {section.content && <p className="text-gray-700 mb-3">{section.content}</p>}
              <ul className="space-y-2">
                {section.points.map((point: string, pointIndex: number) => (
                  <li key={pointIndex} className="flex items-start">
                    <span className="text-bloomPink mr-2">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">{article.content.source}</p>
          </div>
        </div>
      </div>
    </div>
  );
}