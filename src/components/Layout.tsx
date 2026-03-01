import { useRef, useState, useEffect } from 'react';
import Editor from './Editor';
import Preview from './Preview';
import type { PreviewHandle } from './Preview';
import Header from './Header';
import Toolbar from './Toolbar';
import ExampleSelector from './ExampleSelector';
import ResizableDivider from './ResizableDivider';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';
import { themes } from '../utils/themes';
import type { ThemeType } from '../utils/themes';
import { backgrounds, type BackgroundStyle } from '../utils/backgrounds';
import { fonts, type FontOption } from '../utils/fonts';
import type { AnnotationType } from '../types/annotation';
import { useLanguage } from '../contexts/LanguageContext';
import { X, RefreshCw } from 'lucide-react';
import { findExampleById } from '../utils/examples';
import { generateShareURL, parseShareURL } from '../utils/compression';

const Layout: React.FC = () => {
  const defaultCode = `graph TD
  A[Start] --> B{Is it working?}
  B -- Yes --> C[Great!]
  B -- No --> D[Debug]`;
  
  const [code, setCode] = useState<string>(defaultCode);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('linearLight');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundStyle>(backgrounds[0]);
  const [selectedFont, setSelectedFont] = useState<FontOption>(fonts[0]);
  const [selectedTool, setSelectedTool] = useState<AnnotationType | 'select' | null>('select');
  const [annotationCount, setAnnotationCount] = useState<number>(0);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(30); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showClearAnnotationsDialog, setShowClearAnnotationsDialog] = useState(false);
  const [loadedFromUrl, setLoadedFromUrl] = useState<boolean>(false); 
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true); 
  const [customStylesLoaded, setCustomStylesLoaded] = useState<boolean>(false); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const previewRef = useRef<PreviewHandle>(null);
  const { t, language } = useLanguage();

  const handleDownload = (transparent: boolean) => {
    if (previewRef.current) {
      previewRef.current.exportImage(transparent);
    }
  };

  const handleCopy = (transparent: boolean) => {
    if (previewRef.current) {
      previewRef.current.copyImage(transparent);
    }
  };

  const handleShare = () => {
    const shareURL = generateShareURL({
      code: code,
      theme: currentTheme,
      background: selectedBackground.id,
      font: selectedFont.id
    });
    navigator.clipboard.writeText(shareURL).then(() => {
      setToastMessage(t.shareCopied);
      setShowToast(true);
    }).catch((err) => {
      console.error('Failed to copy share link:', err);
      prompt(t.share, shareURL);
    });
  };

  const handleBackgroundChange = (bg: BackgroundStyle) => {
    setSelectedBackground(bg);
    setCustomStylesLoaded(false);
  };

  const handleFontChange = (font: FontOption) => {
    setSelectedFont(font);
    setCustomStylesLoaded(false);
  };

  const handleClearEditor = () => {
    setShowClearDialog(true);
  };

  const confirmClearEditor = () => {
    setCode('');
    
    const url = new URL(window.location.href);
    if (url.searchParams.has('example')) {
      url.searchParams.delete('example');
      window.history.replaceState({}, '', url.toString());
    }
    setLoadedFromUrl(false);
  };

  const handleRefreshEditor = () => {
    if (previewRef.current) {
      previewRef.current.refresh();
    }
  };

  const handleSelectTool = (tool: AnnotationType | 'select') => {
    setSelectedTool(tool);
  };

  const handleClearAnnotations = () => {
    if (annotationCount > 0) {
      setShowClearAnnotationsDialog(true);
    }
  };

  const confirmClearAnnotations = () => {
    if (previewRef.current && 'clearAnnotations' in previewRef.current) {
      (previewRef.current as any).clearAnnotations();
    }
    setShowClearAnnotationsDialog(false);
  };

  const handleAnnotationCountChange = (count: number) => {
    setAnnotationCount(count);
  };

  const handleResize = (width: number) => {
    setLeftPanelWidth(width);
  };

  const handleToggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
  };

  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
    
    const url = new URL(window.location.href);
    url.searchParams.set('theme', theme);
    window.history.pushState({}, '', url.toString());
  };

  const handleExampleSelect = (exampleCode: string, exampleId?: string) => {
    setCode(exampleCode);
    setLoadedFromUrl(true);
    
    if (exampleId) {
      const url = new URL(window.location.href);
      url.searchParams.set('example', exampleId);
      url.searchParams.set('theme', currentTheme);
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    
    if (loadedFromUrl) {
      const url = new URL(window.location.href);
      if (url.searchParams.has('example')) {
        url.searchParams.delete('example');
        window.history.replaceState({}, '', url.toString());
        setLoadedFromUrl(false);
      }
    }
  };

  useEffect(() => {
    const shareParams = parseShareURL();
    
    if (shareParams) {
      const hasCustomStyles = !!(shareParams.background || shareParams.font);
      if (hasCustomStyles) {
        setCustomStylesLoaded(true);
      }
      
      if (shareParams.background) {
        const bg = backgrounds.find(b => b.id === shareParams.background);
        if (bg) {
          setSelectedBackground(bg);
        }
      }
      
      if (shareParams.font) {
        const font = fonts.find(f => f.id === shareParams.font);
        if (font) {
          setSelectedFont(font);
        }
      }
      
      if (shareParams.theme) {
        const validThemes: ThemeType[] = ['linearLight', 'linearDark', 'notion', 'ghibli', 'spotless', 'brutalist', 'glassmorphism', 'memphis', 'softPop', 'cyberpunk', 'monochrome', 'darkMinimal', 'wireframe', 'handDrawn', 'grafana', 'noir', 'material', 'aurora'];
        if (validThemes.includes(shareParams.theme as ThemeType)) {
          setCurrentTheme(shareParams.theme as ThemeType);
        }
      }
      
      setIsInitialLoad(false);
      
      if (shareParams.code) {
        setCode(shareParams.code);
        setLoadedFromUrl(true);
      } else if (shareParams.example) {
        const found = findExampleById(shareParams.example);
        if (found) {
          const exampleCode = found.example.code[language];
          setCode(exampleCode);
          setLoadedFromUrl(true);
        }
      }
    } else {
      setIsInitialLoad(false);
    }
  }, []); 

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Reset background and font when theme changes (but not on initial load or if custom styles were loaded from URL)
  useEffect(() => {
    if (!isInitialLoad && !customStylesLoaded) {
      setSelectedBackground(backgrounds[0]); // Reset to default
      setSelectedFont(fonts[0]); // Reset to default
    }
  }, [currentTheme, isInitialLoad, customStylesLoaded]);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200">
      {!isFullscreen && <Header />}
      <main 
        className={`flex-1 flex flex-col md:flex-row overflow-hidden ${isFullscreen ? '' : ''}`}
      >
        {/* Left Pane: Editor */}
        {!isFullscreen && (
          <div 
            className="border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800 shadow-sm z-10"
            style={{ width: `${leftPanelWidth}%` }}
          >
           <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
             <div className="flex items-center gap-3">
               <span>{t.editor}</span>
               <ExampleSelector onSelectExample={handleExampleSelect} />
               
               <div className="flex items-center gap-2">
                 <button
                   onClick={handleRefreshEditor}
                   className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors cursor-pointer"
                   title={t.refreshEditor}
                 >
                   <RefreshCw className="w-4 h-4" />
                 </button>
                 <button
                   onClick={handleClearEditor}
                   className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors cursor-pointer"
                   title={t.clearEditor}
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
             </div>
             <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-400 dark:text-gray-500">{t.editorSubtitle}</span>
           </div>
           <div className="flex-1 overflow-hidden min-h-0">
             <Editor code={code} onChange={handleCodeChange} />
           </div>
        </div>
        )}
        
        {!isFullscreen && <ResizableDivider onResize={handleResize} />}
        
        {/* Right Pane: Preview */}
        <div 
          className="bg-gray-50 dark:bg-gray-900 flex flex-col relative flex-1"
          style={{ width: isFullscreen ? '100%' : `${100 - leftPanelWidth}%` }}
        >
           <div className="absolute top-4 right-4 z-10 flex items-start gap-2">
              <Toolbar 
                currentTheme={currentTheme} 
                onThemeChange={handleThemeChange}
                onDownload={handleDownload}
                onCopy={handleCopy}
                onShare={handleShare}
                selectedBackground={selectedBackground.id}
                onBackgroundChange={handleBackgroundChange}
                selectedFont={selectedFont.id}
                onFontChange={handleFontChange}
                selectedTool={selectedTool}
                onSelectTool={handleSelectTool}
                onClearAnnotations={handleClearAnnotations}
                annotationCount={annotationCount}
              />
           </div>
           <Preview 
             ref={previewRef} 
             code={code} 
             themeConfig={themes[currentTheme]}
             customBackground={selectedBackground}
             customFont={selectedFont}
             onCodeChange={setCode}
             selectedTool={selectedTool}
             onSelectTool={handleSelectTool}
             onAnnotationCountChange={handleAnnotationCountChange}
             isFullscreen={isFullscreen}
             onToggleFullscreen={handleToggleFullscreen}
           />
        </div>
      </main>

      <ConfirmDialog
        isOpen={showClearDialog}
        title={t.clearEditor}
        message={t.confirmClear}
        onConfirm={confirmClearEditor}
        onCancel={() => setShowClearDialog(false)}
        variant="danger"
      />

      <ConfirmDialog
        isOpen={showClearAnnotationsDialog}
        title={t.clearAnnotations}
        message={t.confirmClearAnnotations}
        onConfirm={confirmClearAnnotations}
        onCancel={() => setShowClearAnnotationsDialog(false)}
        variant="danger"
      />

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          duration={3000}
          type="success"
        />
      )}
    </div>
  );
};

export default Layout;
