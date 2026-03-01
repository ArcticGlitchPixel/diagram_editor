import React from 'react';
import { MousePointer, ArrowRight, Type, Square, Circle, Minus, Trash2 } from 'lucide-react';
import type { AnnotationType } from '../types/annotation';
import { useLanguage } from '../contexts/LanguageContext';

interface AnnotationToolbarProps {
  selectedTool: AnnotationType | 'select' | null;
  onSelectTool: (tool: AnnotationType | 'select') => void;
  onClearAll: () => void;
  annotationCount: number;
}

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  selectedTool,
  onSelectTool,
  onClearAll,
  annotationCount
}) => {
  const { t } = useLanguage();

  const tools = [
    { id: 'select' as const, icon: MousePointer, label: t.select || 'Select' },
    { id: 'arrow' as const, icon: ArrowRight, label: t.arrow || 'Arrow' },
    { id: 'text' as const, icon: Type, label: t.text || 'Text' },
    { id: 'rect' as const, icon: Square, label: t.rectangle || 'Rectangle' },
    { id: 'circle' as const, icon: Circle, label: t.circle || 'Circle' },
    { id: 'line' as const, icon: Minus, label: t.line || 'Line' },
  ];

  return (
    <div className="absolute top-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-40 flex flex-col gap-1">
      <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mb-1">
        {t.annotations || 'Annotation tools'} {annotationCount > 0 && `(${annotationCount})`}
      </div>
      
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
            title={tool.label}
          >
            <Icon size={18} />
            <span className="hidden sm:inline">{tool.label}</span>
          </button>
        );
      })}
      
      {annotationCount > 0 && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            title={t.clearAnnotations || 'Clear annotations'}
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">{t.clearAll || 'Clear'}</span>
          </button>
        </>
      )}
    </div>
  );
};

export default AnnotationToolbar;
