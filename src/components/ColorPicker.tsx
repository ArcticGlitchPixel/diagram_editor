import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ColorPickerProps {
  position: { x: number; y: number };
  onClose: () => void;
  onSelectColor: (color: string) => void;
  nodeId: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ position, onClose, onSelectColor, nodeId }) => {
  const { t } = useLanguage();
  const [customColor, setCustomColor] = useState('#3b82f6');

  const presetColors = [
    { name: t.red || 'Red', value: '#fecaca' },      
    { name: t.orange || 'Orange', value: '#fed7aa' },   
    { name: t.yellow || 'Yellow', value: '#fef08a' },   
    { name: t.green || 'Green', value: '#bbf7d0' },    
    { name: t.blue || 'Blue', value: '#bfdbfe' },     
    { name: t.purple || 'Purple', value: '#e9d5ff' },   
    { name: t.pink || 'Pink', value: '#fbcfe8' },     
    { name: t.gray || 'Gray', value: '#e5e7eb' },     
  ];

  const handleColorSelect = (color: string) => {
    onSelectColor(color);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[200]" onClick={onClose} />
      
      <div
        className="fixed z-[210] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -10px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {t.changeNodeColor || 'Change node color'}: {nodeId}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.presetColors || 'Preset colors'}</p>
          <div className="grid grid-cols-4 gap-2">
            {presetColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className="group relative w-full aspect-square rounded-md border-2 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all hover:scale-110 cursor-pointer"
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-white drop-shadow-md">✓</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t.customColor || 'Custom color'}</p>
          <div className="flex gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              placeholder="#3b82f6"
            />
            <button
              onClick={() => handleColorSelect(customColor)}
              className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-medium rounded hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              {t.apply || 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
