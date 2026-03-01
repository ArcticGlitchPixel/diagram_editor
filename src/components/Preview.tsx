import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import mermaid from 'mermaid';
import { toPng, toJpeg } from 'html-to-image';
import { ZoomIn, ZoomOut, Maximize2, Move, Target } from 'lucide-react';
import type { ThemeConfig } from '../utils/themes';
import type { BackgroundStyle } from '../utils/backgrounds';
import type { FontOption } from '../utils/fonts';
import { useLanguage } from '../contexts/LanguageContext';
import ColorPicker from './ColorPicker';
import AnnotationLayer from './AnnotationLayer';
import AnnotationColorPicker from './AnnotationColorPicker';
import type { Annotation, AnnotationType, Point } from '../types/annotation';

interface PreviewProps {
  code: string;
  themeConfig: ThemeConfig;
  customBackground?: BackgroundStyle;
  customFont?: FontOption;
  onCodeChange?: (code: string) => void;
  selectedTool: AnnotationType | 'select' | null;
  onSelectTool: (tool: AnnotationType | 'select') => void;
  onAnnotationCountChange: (count: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export interface PreviewHandle {
  exportImage: (transparent: boolean) => Promise<void>;
  copyImage: (transparent: boolean) => Promise<void>;
  clearAnnotations: () => void;
  refresh: () => void;
}

// Initialize globally once
mermaid.initialize({
  startOnLoad: false,
  securityLevel: 'loose',
  suppressErrorRendering: true, 
});

const Preview = forwardRef<PreviewHandle, PreviewProps>(({ code, themeConfig, customBackground, customFont, onCodeChange, selectedTool, onSelectTool, onAnnotationCountChange, isFullscreen, onToggleFullscreen }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false); 
  const [copying, setCopying] = useState(false); 
  const [copySuccess, setCopySuccess] = useState(false); 
  const [renderKey, setRenderKey] = useState(0); 
  const { t } = useLanguage();
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPos, setColorPickerPos] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [selectedNodeDomId, setSelectedNodeDomId] = useState<string>(''); 
  
  const [nodeColors, setNodeColors] = useState<Record<string, { fill: string; stroke: string }>>({});
  
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<Point | null>(null);
  const [currentMousePos, setCurrentMousePos] = useState<Point | null>(null);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);
  const [showAnnotationColorPicker, setShowAnnotationColorPicker] = useState(false);
  const [annotationColorPickerPos, setAnnotationColorPickerPos] = useState({ x: 0, y: 0 });
  const svgOverlayRef = useRef<SVGSVGElement>(null);

  // Determine actual background and font to use
  const actualBg = customBackground?.id === 'default' ? themeConfig.bgClass : (customBackground?.bgClass || themeConfig.bgClass);
  const actualBgStyle = customBackground?.id === 'default' ? themeConfig.bgStyle : (customBackground?.bgStyle || themeConfig.bgStyle);
  const actualFont = customFont?.id === 'default' ? '' : (customFont?.fontFamily || '');
  
  const [scale, setScale] = useState(1); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.2, 5);    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.2, 0.5);    setScale(newScale);
  };

  const handleResetZoom = () => {    
    if (!containerRef.current || !contentRef.current) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    const svgElement = content.querySelector('svg');
    
    if (!svgElement) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      return;
    }

    try {
      let svgWidth = 0;
      let svgHeight = 0;

      const widthAttr = svgElement.getAttribute('width');
      const heightAttr = svgElement.getAttribute('height');

      if (widthAttr && heightAttr) {
        svgWidth = parseFloat(widthAttr);
        svgHeight = parseFloat(heightAttr);
      }

      if ((!svgWidth || !svgHeight) && svgElement.getAttribute('viewBox')) {
        const viewBox = svgElement.getAttribute('viewBox');
        const parts = viewBox!.split(/\s+/).map(Number);
        if (parts.length === 4) {
          svgWidth = parts[2];
          svgHeight = parts[3];
        }
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      if (svgWidth > 0 && svgHeight > 0 && containerWidth > 0 && containerHeight > 0) {
        const targetWidthRatio = 0.75;
        const targetHeightRatio = 0.75;

        const scaleX = (containerWidth * targetWidthRatio) / svgWidth;
        const scaleY = (containerHeight * targetHeightRatio) / svgHeight;

        let autoScale = Math.min(scaleX, scaleY);

        autoScale = Math.max(0.5, Math.min(3, autoScale));

        if (svgWidth < containerWidth * 0.3 && svgHeight < containerHeight * 0.3) {
          autoScale = Math.max(1.2, autoScale);
        }

        setScale(autoScale);
        setPosition({ x: 0, y: 0 });
      } else {
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    } catch (err) {
      console.error('Reset zoom calculation error:', err);
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.02 : 0.02;
      setScale(prev => Math.max(0.5, Math.min(5, prev + delta)));
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const screenToSVGCoords = (clientX: number, clientY: number): Point | null => {
    if (!containerRef.current) return null;

    const rect = containerRef.current.getBoundingClientRect();
    const containerX = clientX - rect.left;
    const containerY = clientY - rect.top;

    const svgX = (containerX - rect.width / 2 - position.x) / scale;
    const svgY = (containerY - rect.height / 2 - position.y) / scale;

    return { x: svgX, y: svgY };
  };

  const handleAnnotationMouseDown = (e: React.MouseEvent) => {
    if (!selectedTool || selectedTool === 'select') return;

    const coords = screenToSVGCoords(e.clientX, e.clientY);
    if (!coords) return;

    setIsDrawing(true);
    setDrawStart(coords);
    setCurrentMousePos(coords);

    if (selectedTool === 'text') {
      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        type: 'text',
        position: coords,
        text: t.doubleClickToEdit,
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
        color: themeConfig.annotationColors.text,
        strokeWidth: 2
      };
      setAnnotations(prev => [...prev, newAnnotation]);
      onSelectTool('select');
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentMousePos(null);
    }
  };

  const handleAnnotationMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return;

    const coords = screenToSVGCoords(e.clientX, e.clientY);
    if (!coords) return;

    setCurrentMousePos(coords);
  };

  const handleAnnotationMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !selectedTool || selectedTool === 'select') {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentMousePos(null);
      return;
    }

    const coords = screenToSVGCoords(e.clientX, e.clientY);
    if (!coords) {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentMousePos(null);
      return;
    }

    const { x, y } = coords;

    const distance = Math.sqrt((x - drawStart.x) ** 2 + (y - drawStart.y) ** 2);
    if (distance < 10 && selectedTool !== 'text') {
      setIsDrawing(false);
      setDrawStart(null);
      return;
    }

    const newAnnotation: Annotation | null = (() => {
      const baseId = `annotation-${Date.now()}`;
      const primaryColor = themeConfig.annotationColors.primary;

      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      switch (selectedTool) {
        case 'arrow':
          return {
            id: baseId,
            type: 'arrow' as const,
            start: drawStart,
            end: { x, y },
            color: primaryColor,
            strokeWidth: 3
          };

        case 'line':
          return {
            id: baseId,
            type: 'line' as const,
            start: drawStart,
            end: { x, y },
            color: primaryColor,
            strokeWidth: 3
          };

        case 'rect':
          return {
            id: baseId,
            type: 'rect' as const,
            position: {
              x: Math.min(drawStart.x, x),
              y: Math.min(drawStart.y, y) 
            },
            width: Math.abs(x - drawStart.x),
            height: Math.abs(y - drawStart.y),
            color: primaryColor,
            fill: hexToRgba(primaryColor, 0.1),
            opacity: 0.8,
            strokeWidth: 2
          };

        case 'circle':
          const radius = Math.sqrt((x - drawStart.x) ** 2 + (y - drawStart.y) ** 2);
          return {
            id: baseId,
            type: 'circle' as const,
            center: drawStart,
            radius,
            color: primaryColor,
            fill: hexToRgba(primaryColor, 0.1),
            opacity: 0.8,
            strokeWidth: 2
          };

        default:
          return null;
      }
    })();

    if (newAnnotation) {
      setAnnotations(prev => [...prev, newAnnotation]);
      onSelectTool('select');
    }

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentMousePos(null);
  };

  useEffect(() => {
    if (selectedTool === 'select' || selectedTool === null) {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentMousePos(null);
    }
  }, [selectedTool]);

  useEffect(() => {
    onAnnotationCountChange(annotations.length);
  }, [annotations.length, onAnnotationCountChange]);

  useEffect(() => {
    const colors = themeConfig.annotationColors;
    setAnnotations(prev => prev.map(annotation => {
      let newColor = colors.primary;
      if (annotation.type === 'text') {
        newColor = colors.text;
      } else if (annotation.id.endsWith('1')) {
        newColor = colors.secondary;
      }

      return {
        ...annotation,
        color: newColor,
      } as Annotation;
    }));
  }, [themeConfig]);

  const handleUpdateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...updates } as Annotation : a));
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const handleCopyAnnotation = (annotation: Annotation) => {
    const offset = 20;
    let newAnnotation: Annotation;

    if (annotation.type === 'arrow') {
      newAnnotation = {
        ...annotation,
        id: `annotation-${Date.now()}`,
        start: {
          x: annotation.start.x + offset,
          y: annotation.start.y + offset
        },
        end: {
          x: annotation.end.x + offset,
          y: annotation.end.y + offset
        }
      };
    } else if (annotation.type === 'line') {
      newAnnotation = {
        ...annotation,
        id: `annotation-${Date.now()}`,
        start: {
          x: annotation.start.x + offset,
          y: annotation.start.y + offset
        },
        end: {
          x: annotation.end.x + offset,
          y: annotation.end.y + offset
        }
      };
    } else if (annotation.type === 'text') {
      newAnnotation = {
        ...annotation,
        id: `annotation-${Date.now()}`,
        position: {
          x: annotation.position.x + offset,
          y: annotation.position.y + offset
        }
      };
    } else if (annotation.type === 'rect') {
      newAnnotation = {
        ...annotation,
        id: `annotation-${Date.now()}`,
        position: {
          x: annotation.position.x + offset,
          y: annotation.position.y + offset
        }
      };
    } else if (annotation.type === 'circle') {
      newAnnotation = {
        ...annotation,
        id: `annotation-${Date.now()}`,
        center: {
          x: annotation.center.x + offset,
          y: annotation.center.y + offset
        }
      };
    } else {
      return; 
    }

    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedAnnotationId(newAnnotation.id);
  };

  const handleShowAnnotationColorPicker = (position: { x: number; y: number }) => {
    setAnnotationColorPickerPos(position);
    setShowAnnotationColorPicker(true);
  };

  const handleApplyAnnotationColor = (color: string) => {
    if (selectedAnnotationId) {
      handleUpdateAnnotation(selectedAnnotationId, { color });
      setShowAnnotationColorPicker(false);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; 
    if (selectedTool && selectedTool !== 'select') return; 
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    dragStartPos.current = { ...position };
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setPosition({
      x: dragStartPos.current.x + deltaX,
      y: dragStartPos.current.y + deltaY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (selectedAnnotationId) {
      setSelectedAnnotationId(null);
    }

    const target = e.target as HTMLElement;
    
    let nodeElement: HTMLElement | null = target;
    let nodeId = '';
    let domId = '';
    
    while (nodeElement && nodeElement !== contentRef.current) {
      if (nodeElement.tagName === 'g' && nodeElement.id) {
        const rawId = nodeElement.id;
        domId = rawId; 
        
        // 1. Flowchart: "flowchart-A-123"
        let match = rawId.match(/flowchart-([A-Za-z0-9_]+)-\d+/);
        
        if (!match) {
          match = rawId.match(/^state-(.+?)-\d+$/);
        }
        
        // 3. Sequence diagram: "actor-User-123"
        if (!match) {
          match = rawId.match(/^actor-(.+?)-\d+$/);
        }
        
        if (!match) {
          match = rawId.match(/^([A-Za-z0-9_]+)-\d+$/);
        }
        
        if (!match) {
          match = rawId.match(/^[a-z]+-(.+?)-\d+$/);
        }
        
        if (match) {
          nodeId = match[1];
          break;
        }
      }
      
      if (nodeElement.classList.contains('node') || 
          nodeElement.classList.contains('actor') ||
          nodeElement.classList.contains('task') ||
          nodeElement.classList.contains('section') ||
          nodeElement.classList.contains('state')) {
        const rawId = nodeElement.id || nodeElement.getAttribute('data-id') || '';
        if (rawId) {
          domId = rawId;
          const match = rawId.match(/flowchart-([A-Za-z0-9_]+)-\d+/) || 
                       rawId.match(/^state-(.+?)-\d+$/) ||
                       rawId.match(/^actor-(.+?)-\d+$/) ||
                       rawId.match(/^([A-Za-z0-9_]+)-\d+$/) ||
                       rawId.match(/^[a-z]+-(.+?)-\d+$/) ||
                       rawId.match(/^(.+)$/);
          nodeId = match ? match[1] : rawId;
          if (nodeId) break;
        }
      }
      
      nodeElement = nodeElement.parentElement;
    }
    
    if (nodeId && domId) {
      console.log('Selected node - ID:', nodeId, 'DOM ID:', domId); 
      setSelectedNodeId(nodeId);
      setSelectedNodeDomId(domId);
      setColorPickerPos({ x: e.clientX, y: e.clientY });
      setShowColorPicker(true);
    }
  };

  const darkenColor = (hexColor: string): string => {
    const hex = hexColor.replace('#', '');
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const newR = Math.floor(r * 0.6);
    const newG = Math.floor(g * 0.6);
    const newB = Math.floor(b * 0.6);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const needsQuotes = (id: string): boolean => {
    return /[^a-zA-Z0-9_]/.test(id);
  };

  const detectDiagramType = (code: string): string => {
    const firstLine = code.trim().split('\n')[0].toLowerCase();
    if (firstLine.includes('statediagram')) return 'state';
    if (firstLine.includes('sequencediagram')) return 'sequence';
    if (firstLine.includes('gantt')) return 'gantt';
    if (firstLine.includes('classdiagram')) return 'class';
    if (firstLine.includes('erdiagram')) return 'er';
    if (firstLine.includes('journey')) return 'journey';
    if (firstLine.includes('pie')) return 'pie';
    if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'flowchart';
    return 'flowchart'; // default
  };

  const handleApplyColor = (color: string) => {
    if (!selectedNodeId || !selectedNodeDomId) return;
    
    const diagramType = detectDiagramType(code);
    
    const strokeColor = darkenColor(color);
    
    const useCssHack = ['state', 'sequence', 'gantt', 'class', 'er', 'journey', 'pie'].includes(diagramType);
    
    if (useCssHack) {
      setNodeColors(prev => ({
        ...prev,
        [selectedNodeDomId]: { fill: color, stroke: strokeColor }
      }));
      console.log(`Applied CSS hack color for ${diagramType} diagram:`, selectedNodeDomId);
    } else {
      if (!onCodeChange) return;
      
      const lines = code.split('\n');
      const shouldQuote = needsQuotes(selectedNodeId);
      const quotedNodeId = shouldQuote ? `"${selectedNodeId}"` : selectedNodeId;
      const escapedNodeId = selectedNodeId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      const styleRegex = new RegExp(`^\\s*style\\s+(?:"${escapedNodeId}"|${escapedNodeId})\\s+`, 'i');
      let styleLineIndex = -1;
      
      for (let i = 0; i < lines.length; i++) {
        if (styleRegex.test(lines[i])) {
          styleLineIndex = i;
          break;
        }
      }
      
      const styleDefinition = `    style ${quotedNodeId} fill:${color},stroke:${strokeColor},stroke-width:2px`;
      
      if (styleLineIndex >= 0) {
        lines[styleLineIndex] = styleDefinition;
      } else {
        let lastNonEmptyIndex = lines.length - 1;
        while (lastNonEmptyIndex >= 0 && lines[lastNonEmptyIndex].trim() === '') {
          lastNonEmptyIndex--;
        }
        lines.splice(lastNonEmptyIndex + 1, 0, styleDefinition);
      }
      
      const newCode = lines.join('\n');
      onCodeChange(newCode);
    }
  };

  useImperativeHandle(ref, () => ({
    clearAnnotations: () => {
      setAnnotations([]);
      setSelectedAnnotationId(null);
    },
    refresh: () => {
      setRenderKey(prev => prev + 1);
    },
    copyImage: async (transparent: boolean) => {
      if (!contentRef.current || !svg) return;

      setCopying(true); 
      setCopySuccess(false);

      try {
        const node = contentRef.current;

        const originalTransform = node.style.transform;
        const originalTransition = node.style.transition;

        node.style.transform = 'translate(0px, 0px) scale(1)';
        node.style.transition = 'none';

        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));

        const svgElement = node.querySelector('svg');
        if (svgElement) {
          const textSelectors = [
            'text',
            'tspan',
            '.label',
            '.nodeLabel',
            '.edgeLabel',
            '.labelText',
            'foreignObject div',
            'foreignObject span',
            'foreignObject p'
          ];
          
          textSelectors.forEach(selector => {
            const elements = svgElement.querySelectorAll(selector);
            
            elements.forEach((textEl: any) => {
              const computedStyle = window.getComputedStyle(textEl);
              const fillColor = computedStyle.fill;
              const color = computedStyle.color;
              
              if (textEl.tagName === 'text' || textEl.tagName === 'tspan') {
                const colorToUse = fillColor !== 'none' ? fillColor : color;
                if (colorToUse && colorToUse !== 'none') {
                  textEl.setAttribute('fill', colorToUse);
                }
              } else if (textEl.tagName === 'DIV' || textEl.tagName === 'SPAN' || textEl.tagName === 'P') {
                if (color && color !== 'none') {
                  textEl.style.setProperty('color', color, 'important');
                  textEl.style.setProperty('-webkit-text-fill-color', color, 'important');
                }
              }
              
              const childTexts = textEl.querySelectorAll('text, tspan');
              if (childTexts.length > 0) {
                childTexts.forEach((child: any) => {
                  const childColor = fillColor !== 'none' ? fillColor : color;
                  if (childColor && childColor !== 'none') {
                    child.setAttribute('fill', childColor);
                  }
                });
              }
            });
          });
          
          const foreignObjects = svgElement.querySelectorAll('foreignObject');
          foreignObjects.forEach((fo: any) => {
            const foComputedStyle = window.getComputedStyle(fo);
            const foColor = foComputedStyle.color;
            if (foColor && foColor !== 'none') {
              fo.style.setProperty('color', foColor, 'important');
            }
          });
        }

        const exportScale = 3; 

        let bgColor = transparent ? undefined : getComputedStyle(containerRef.current!).backgroundColor;
        if (!transparent && actualBgStyle?.backgroundColor) {
          bgColor = actualBgStyle.backgroundColor;
        }

        let targetWidth = node.offsetWidth;
        let targetHeight = node.offsetHeight;

        if (svgElement) {
          const svgWidth = svgElement.getAttribute('width');
          const svgHeight = svgElement.getAttribute('height');
          if (svgWidth && svgHeight) {
            targetWidth = Math.max(parseFloat(svgWidth) + 96, node.offsetWidth);
            targetHeight = Math.max(parseFloat(svgHeight) + 96, node.offsetHeight);
          }
        }

        const baseStyle: any = {
          transform: 'scale(1)',
          transformOrigin: 'center',
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
        };

        if (!transparent && actualBgStyle) {
          Object.assign(baseStyle, actualBgStyle);
        }

        const param = {
          quality: 0.98,
          backgroundColor: bgColor,
          pixelRatio: exportScale,
          width: targetWidth,
          height: targetHeight,
          style: baseStyle,
          cacheBust: true,
          skipAutoScale: true,
          fontEmbedCSS: '',
          filter: (node: HTMLElement) => {
            if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
              const href = node.getAttribute('href');
              if (href && (href.includes('fonts.googleapis.com') || href.startsWith('http'))) {
                return false;
              }
            }
            return true;
          },
        };

        const dataUrl = await toPng(node, {
          ...param,
          backgroundColor: transparent ? undefined : bgColor,
          style: transparent ? { ...baseStyle, backgroundColor: 'transparent' } : baseStyle
        });

        node.style.transform = originalTransform;
        node.style.transition = originalTransition;

        const response = await fetch(dataUrl);
        const blob = await response.blob();

        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ]);
        setCopying(false);
        setCopySuccess(true);

        setTimeout(() => {
          setCopySuccess(false);
        }, 2000);
      } catch (err) {
        console.error('Copy failed', err);
        setCopying(false);
        setError('Copy failed: ' + (err as Error).message);

        setTimeout(() => {
          setError(null);
        }, 3000);

        if (contentRef.current) {
          contentRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
          contentRef.current.style.transition = isDragging ? 'none' : 'transform 0.1s ease-out';
        }
      }
    },
    exportImage: async (transparent: boolean) => {
      if (!contentRef.current || !svg) return;
      
      setExporting(true); 
      
      try {
        const node = contentRef.current;
        
        const originalTransform = node.style.transform;
        const originalTransition = node.style.transition;
        
        node.style.transform = 'translate(0px, 0px) scale(1)';
        node.style.transition = 'none';
        
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const svgElement = node.querySelector('svg');
        if (svgElement) {
          const textSelectors = [
            'text',
            'tspan',
            '.label',
            '.nodeLabel',
            '.edgeLabel',
            '.labelText',
            'foreignObject div',
            'foreignObject span',
            'foreignObject p'
          ];
          
          textSelectors.forEach(selector => {
            const elements = svgElement.querySelectorAll(selector);
            
            elements.forEach((textEl: any) => {
              const computedStyle = window.getComputedStyle(textEl);
              const fillColor = computedStyle.fill;
              const color = computedStyle.color;
              
              if (textEl.tagName === 'text' || textEl.tagName === 'tspan') {
                const colorToUse = fillColor !== 'none' ? fillColor : color;
                if (colorToUse && colorToUse !== 'none') {
                  textEl.setAttribute('fill', colorToUse);
                }
              } else if (textEl.tagName === 'DIV' || textEl.tagName === 'SPAN' || textEl.tagName === 'P') {
                if (color && color !== 'none') {
                  textEl.style.setProperty('color', color, 'important');
                  textEl.style.setProperty('-webkit-text-fill-color', color, 'important');
                }
              }
              
              const childTexts = textEl.querySelectorAll('text, tspan');
              if (childTexts.length > 0) {
                childTexts.forEach((child: any) => {
                  const childColor = fillColor !== 'none' ? fillColor : color;
                  if (childColor && childColor !== 'none') {
                    child.setAttribute('fill', childColor);
                  }
                });
              }
            });
          });
          
          const foreignObjects = svgElement.querySelectorAll('foreignObject');
          foreignObjects.forEach((fo: any) => {
            const foComputedStyle = window.getComputedStyle(fo);
            const foColor = foComputedStyle.color;
            if (foColor && foColor !== 'none') {
              fo.style.setProperty('color', foColor, 'important');
            }
          });
        }
        
        const exportScale = 3; 
        
        let bgColor = transparent ? undefined : getComputedStyle(containerRef.current!).backgroundColor;
        if (!transparent && actualBgStyle?.backgroundColor) {
          bgColor = actualBgStyle.backgroundColor;
        }
        
        let targetWidth = node.offsetWidth;
        let targetHeight = node.offsetHeight;
        
        if (svgElement) {
          const svgWidth = svgElement.getAttribute('width');
          const svgHeight = svgElement.getAttribute('height');
          if (svgWidth && svgHeight) {
            targetWidth = Math.max(parseFloat(svgWidth) + 96, node.offsetWidth); 
            targetHeight = Math.max(parseFloat(svgHeight) + 96, node.offsetHeight);
          }
        }
        
        const baseStyle: any = {
             transform: 'scale(1)',
             transformOrigin: 'center',
             width: `${targetWidth}px`,
             height: `${targetHeight}px`,
        };

        if (!transparent && actualBgStyle) {
          Object.assign(baseStyle, actualBgStyle);
        }

        const param = {
             quality: 0.98, 
             backgroundColor: bgColor,
             pixelRatio: exportScale, 
             width: targetWidth,
             height: targetHeight,
             style: baseStyle,
             cacheBust: true,
             skipAutoScale: true, 
             fontEmbedCSS: '', 
             filter: (node: HTMLElement) => {
               if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
                 const href = node.getAttribute('href');
                 if (href && (href.includes('fonts.googleapis.com') || href.startsWith('http'))) {
                   return false;
                 }
               }
               return true;
             },
        };

        let dataUrl;
        if (transparent) {
             dataUrl = await toPng(node, { 
               ...param, 
               backgroundColor: undefined,
               style: { ...baseStyle, backgroundColor: 'transparent' }
             });
        } else {
             dataUrl = await toJpeg(node, param);
        }
        
        node.style.transform = originalTransform;
        node.style.transition = originalTransition;
        
        const link = document.createElement('a');
        link.download = `mermaid-diagram-${Date.now()}.${transparent ? 'png' : 'jpg'}`;
        link.href = dataUrl;
        link.click();
        setTimeout(() => {
          setExporting(false);
        }, 500);
      } catch (err) {
        console.error('Export failed', err);
        setExporting(false);
        alert('Export failed. Check console for details.\nError: ' + (err as Error).message);
        
        if (contentRef.current) {
          contentRef.current.style.transform = `translate(${position.x}px, ${position.y}px) scale(${scale})`;
          contentRef.current.style.transition = isDragging ? 'none' : 'transform 0.1s ease-out';
        }
      }
    }
  }));

  useEffect(() => {
    const renderDiagram = async () => {
      if (!code) {
          setSvg('');
          return;
      }
      
      setLoading(true);
      try {
        setError(null);
        // Unique ID for each render
        const id = `mermaid-${Date.now()}`;
        
        // Apply custom font if selected
        const configWithFont = actualFont ? {
          ...themeConfig.mermaidConfig,
          themeVariables: {
            ...themeConfig.mermaidConfig.themeVariables,
            fontFamily: actualFont,
          },
          themeCSS: `
            ${themeConfig.mermaidConfig.themeCSS || ''}
            /* Custom font override */
            * { 
              font-family: ${actualFont} !important; 
            }
            .node .label, .edgeLabel, .messageText, .noteText, .labelText, .loopText, 
            .actor text, .taskText, .sectionTitle, .titleText, text {
              font-family: ${actualFont} !important;
            }
          `
        } : themeConfig.mermaidConfig;

        mermaid.initialize({
            startOnLoad: false,
            suppressErrorRendering: true,
            ...configWithFont,
        });

        const { svg: renderedSvg } = await mermaid.render(id, code);
        
        // Post-process SVG
        let processedSvg = renderedSvg;

        processedSvg = processedSvg.replace(
          /(<svg[^>]*)\s+width=["']100%["']/gi,
          '$1'
        ).replace(
          /(<svg[^>]*)\s+height=["']100%["']/gi,
          '$1'
        );

        const viewBoxMatch = processedSvg.match(/viewBox=["']([^"']+)["']/);
        if (viewBoxMatch) {
          const viewBoxParts = viewBoxMatch[1].split(/\s+/).map(Number);
          if (viewBoxParts.length === 4) {
            const [, , width, height] = viewBoxParts;
            processedSvg = processedSvg.replace(
              /<svg/,
              `<svg width="${width}" height="${height}"`
            );
          }
        }

        // Post-process SVG to force dash array for specific themes
        if (themeConfig.mermaidConfig.themeVariables?.lineColor === '#ffffff' && 
            themeConfig.bgClass === 'bg-[#1a1a1a]') {
          // Dark Minimal theme - force dashed lines
          processedSvg = renderedSvg.replace(
            /<path class="path"/g, 
            '<path class="path" stroke-dasharray="10,8"'
          );
        }
        
        // Add hand-drawn filter for handDrawn theme
        if (themeConfig.bgClass === 'bg-[#fffef9]') {
          // Inject SVG filter definition for realistic hand-drawn effect
          const filterDef = `<defs>
  <filter id="roughen" x="-25%" y="-25%" width="150%" height="150%" filterUnits="objectBoundingBox">
    <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="3" result="noise" seed="2"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="2" result="noise2" seed="5"/>
    <feDisplacementMap in="displaced" in2="noise2" scale="1" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <filter id="roughen-line" x="-30%" y="-30%" width="160%" height="160%" filterUnits="objectBoundingBox">
    <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="3" result="noise" seed="1"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.02" numOctaves="2" result="noise2" seed="3"/>
    <feDisplacementMap in="displaced" in2="noise2" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs>`;
          // Find existing defs or insert new one
          if (processedSvg.includes('<defs>')) {
            processedSvg = processedSvg.replace(/<defs>/, filterDef);
          } else {
            processedSvg = processedSvg.replace(/<svg[^>]*>/, match => match + filterDef);
          }
        }
        
        // Apply custom font via style injection
        let customStyles = '';
        
        // IMPORTANT: Inject complete theme CSS first to ensure proper styling in exports
        if (themeConfig.mermaidConfig.themeCSS) {
          customStyles += `\n${themeConfig.mermaidConfig.themeCSS}\n`;
        }
        
        if (actualFont) {
          customStyles += `
  text, .label, .messageText, .noteText, .labelText, .loopText, .taskText, 
  .sectionTitle, .titleText, .legendText, tspan {
    font-family: ${actualFont} !important;
  }`;
        }
        
        // Apply node colors via CSS hack
        if (Object.keys(nodeColors).length > 0) {
          for (const [domId, colors] of Object.entries(nodeColors)) {
            customStyles += `
  #${domId} rect,
  #${domId} circle,
  #${domId} polygon,
  #${domId} path:not(.arrowhead):not(.path),
  #${domId} .note,
  #${domId} .actor {
    fill: ${colors.fill} !important;
    stroke: ${colors.stroke} !important;
    stroke-width: 2px !important;
  }`;
          }
        }

        if (customStyles) {
          const styleTag = `<style>${customStyles}</style>`;
          // Inject style after defs or at the beginning
          if (processedSvg.includes('</defs>')) {
            processedSvg = processedSvg.replace(/<\/defs>/, `</defs>${styleTag}`);
          } else if (processedSvg.includes('<defs>')) {
            processedSvg = processedSvg.replace(/<\/defs>/, `</defs>${styleTag}`);
          } else {
            processedSvg = processedSvg.replace(/<svg[^>]*>/, match => match + styleTag);
          }
        }
        
        setSvg(processedSvg);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError('Syntax Error: Please check your Mermaid syntax.');
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      renderDiagram();
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [code, themeConfig, actualFont, nodeColors, renderKey]);

  useEffect(() => {
    if (!svg || !containerRef.current || !contentRef.current) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      const content = contentRef.current;
      if (!container || !content) return;

      const svgElement = content.querySelector('svg');
      if (!svgElement) return;

      try {
        let svgWidth = 0;
        let svgHeight = 0;

        const widthAttr = svgElement.getAttribute('width');
        const heightAttr = svgElement.getAttribute('height');

        if (widthAttr && heightAttr) {
          svgWidth = parseFloat(widthAttr);
          svgHeight = parseFloat(heightAttr);
        }

        if ((!svgWidth || !svgHeight) && svgElement.getAttribute('viewBox')) {
          const viewBox = svgElement.getAttribute('viewBox');
          const parts = viewBox!.split(/\s+/).map(Number);
          if (parts.length === 4) {
            svgWidth = parts[2];
            svgHeight = parts[3];
          }
        }

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        if (svgWidth > 0 && svgHeight > 0 && containerWidth > 0 && containerHeight > 0) {
          const targetWidthRatio = 0.75;
          const targetHeightRatio = 0.75;

          const scaleX = (containerWidth * targetWidthRatio) / svgWidth;
          const scaleY = (containerHeight * targetHeightRatio) / svgHeight;

          let autoScale = Math.min(scaleX, scaleY);

          autoScale = Math.max(0.5, Math.min(3, autoScale));

          if (svgWidth < containerWidth * 0.3 && svgHeight < containerHeight * 0.3) {
            autoScale = Math.max(1.2, autoScale);
          }

          setScale(autoScale);
          setPosition({ x: 0, y: 0 }); 
        }
      } catch (err) {
        console.error('Auto-scale calculation error:', err);
      }
    }, 150); 

    return () => clearTimeout(timer);
  }, [svg]); 

  return (
    <div 
        className={`flex-1 min-h-0 overflow-hidden flex relative transition-colors duration-300 ${actualBg}`} 
        style={actualBgStyle}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
       {error && (
        <div className="absolute top-20 right-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-md text-sm shadow-sm z-20">
               {error}
           </div>
       )}
       
       {loading && !svg && (
           <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
           </div>
       )}
       
      {exporting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400"></div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">{t.export}...</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{t.exportDesc}</div>
              </div>
          </div>
      )}
      
     {copying && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400"></div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">{t.copying}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{t.copyingDesc}</div>
          </div>
        </div>
      )}

      {copySuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-gray-700 dark:text-gray-200 font-medium">{t.copySuccess}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{t.copySuccessDesc}</div>
          </div>
        </div>
      )}

       <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
         <button
           onClick={handleZoomIn}
          className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-md transition-colors cursor-pointer"
           title={t.zoomIn}
         >
          <ZoomIn size={20} className="text-gray-700 dark:text-gray-300" />
         </button>
         <button
           onClick={handleZoomOut}
          className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-md transition-colors cursor-pointer"
           title={t.zoomOut}
         >
          <ZoomOut size={20} className="text-gray-700 dark:text-gray-300" />
         </button>
         <button
           onClick={handleResetZoom}
          className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-md transition-colors cursor-pointer"
           title={t.resetView}
         >
          <Target size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg shadow-md transition-colors cursor-pointer"
          title={isFullscreen ? t.exitFullscreen || 'Exit fullscreen' : t.enterFullscreen || 'Enter fullscreen'}
        >
          <Maximize2 size={20} className="text-gray-700 dark:text-gray-300" />
         </button>
        <div className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md flex items-center justify-center" title={t.dragToMove}>
          <Move size={16} className="text-gray-500 dark:text-gray-400" />
         </div>
       </div>
       
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md text-sm text-gray-700 dark:text-gray-300 z-20">
         {Math.round(scale * 100)}%
       </div>
       
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-md text-xs text-gray-600 dark:text-gray-400 z-20">
         {t.scrollZoom} | {t.dragMove}
       </div>
       
       <div 
        className="w-full h-full flex items-center justify-center overflow-hidden relative"
         style={{
           cursor: selectedTool && selectedTool !== 'select' ? 'crosshair' : (isDragging ? 'grabbing' : 'grab'),
         }}
       >
         <div 
           ref={contentRef}
           className="p-12"
           onContextMenu={handleContextMenu}
          onClick={() => {
            if (selectedAnnotationId && selectedTool === 'select') {
              setSelectedAnnotationId(null);
            }
          }}
           style={{
             transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
             transformOrigin: 'center',
             transition: isDragging ? 'none' : 'transform 0.1s ease-out',
             fontFamily: actualFont || 'inherit',
           }}
           dangerouslySetInnerHTML={{ __html: svg }} 
         />

        {selectedTool === 'select' && selectedAnnotationId && (
          <div
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'auto', cursor: 'default' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedAnnotationId(null);
              }
            }}
            onMouseDown={(e) => {
              if (e.button === 0 && e.target === e.currentTarget) {
              }
            }}
          />
        )}

        <svg
          ref={svgOverlayRef}
          className="absolute inset-0 w-full h-full"
          style={{
            cursor: selectedTool && selectedTool !== 'select' ? 'crosshair' : 'inherit',
            pointerEvents: 'none',
          }}
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="transparent"
            style={{
              pointerEvents: selectedTool !== null && selectedTool !== 'select' ? 'auto' : 'none',
            }}
            onMouseDown={(e) => {
              if (selectedTool) {
                handleAnnotationMouseDown(e);
              }
            }}
            onMouseMove={handleAnnotationMouseMove}
            onMouseUp={handleAnnotationMouseUp}
          />

          <g
            transform={`translate(${containerRef.current ? containerRef.current.offsetWidth / 2 : 0}, ${containerRef.current ? containerRef.current.offsetHeight / 2 : 0})`}
          >
            <g transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
              <AnnotationLayer
                annotations={annotations}
                onUpdateAnnotation={handleUpdateAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                onCopyAnnotation={handleCopyAnnotation}
                selectedTool={selectedTool}
                scale={scale}
                position={position}
                selectedAnnotationId={selectedAnnotationId}
                onSelectAnnotation={setSelectedAnnotationId}
                onShowColorPicker={handleShowAnnotationColorPicker}
              />

              {isDrawing && drawStart && currentMousePos && (() => {
                const previewColor = themeConfig.annotationColors.secondary;
                const previewOpacity = 0.6;

                if (selectedTool === 'arrow') {
                  const angle = Math.atan2(currentMousePos.y - drawStart.y, currentMousePos.x - drawStart.x);
                  const arrowSize = 12;
                  return (
                    <g opacity={previewOpacity}>
                      <line
                        x1={drawStart.x}
                        y1={drawStart.y}
                        x2={currentMousePos.x}
                        y2={currentMousePos.y}
                        stroke={previewColor}
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                      />
                      <polygon
                        points={`
                         ${currentMousePos.x},${currentMousePos.y}
                         ${currentMousePos.x - arrowSize * Math.cos(angle - Math.PI / 6)},${currentMousePos.y - arrowSize * Math.sin(angle - Math.PI / 6)}
                         ${currentMousePos.x - arrowSize * Math.cos(angle + Math.PI / 6)},${currentMousePos.y - arrowSize * Math.sin(angle + Math.PI / 6)}
                       `}
                        fill={previewColor}
                      />
                    </g>
                  );
                } else if (selectedTool === 'line') {
                  return (
                    <line
                      x1={drawStart.x}
                      y1={drawStart.y}
                      x2={currentMousePos.x}
                      y2={currentMousePos.y}
                      stroke={previewColor}
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeDasharray="5,5"
                      opacity={previewOpacity}
                    />
                  );
                } else if (selectedTool === 'rect') {
                  const x = Math.min(drawStart.x, currentMousePos.x);
                  const y = Math.min(drawStart.y, currentMousePos.y);
                  const width = Math.abs(currentMousePos.x - drawStart.x);
                  const height = Math.abs(currentMousePos.y - drawStart.y);

                  const hex = previewColor;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  const fillColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fillColor}
                      stroke={previewColor}
                      strokeWidth={2}
                      strokeDasharray="5,5"
                      rx={4}
                      opacity={previewOpacity}
                    />
                  );
                } else if (selectedTool === 'circle') {
                  const radius = Math.sqrt((currentMousePos.x - drawStart.x) ** 2 + (currentMousePos.y - drawStart.y) ** 2);

                  const hex = previewColor;
                  const r = parseInt(hex.slice(1, 3), 16);
                  const g = parseInt(hex.slice(3, 5), 16);
                  const b = parseInt(hex.slice(5, 7), 16);
                  const fillColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

                  return (
                    <circle
                      cx={drawStart.x}
                      cy={drawStart.y}
                      r={radius}
                      fill={fillColor}
                      stroke={previewColor}
                      strokeWidth={2}
                      strokeDasharray="5,5"
                      opacity={previewOpacity}
                    />
                  );
                }
                return null;
              })()}
            </g>
          </g>
        </svg>
       </div>
       
       {showColorPicker && (
         <ColorPicker
           position={colorPickerPos}
           nodeId={selectedNodeId}
           onClose={() => setShowColorPicker(false)}
           onSelectColor={handleApplyColor}
         />
       )}

      {showAnnotationColorPicker && selectedAnnotationId && (
        <AnnotationColorPicker
          position={annotationColorPickerPos}
          currentColor={annotations.find(a => a.id === selectedAnnotationId)?.color || themeConfig.annotationColors.primary}
          onSelectColor={handleApplyAnnotationColor}
          onClose={() => setShowAnnotationColorPicker(false)}
        />
      )}
    </div>
  );
});

Preview.displayName = 'Preview';

export default Preview;
