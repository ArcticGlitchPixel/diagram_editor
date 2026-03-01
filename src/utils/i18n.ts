export type Language = 'en' | 'es';

export interface Translation {
  // Header
  appTitle: string;
  share: string;
  shareSuccess: string;
  shareCopied: string;
  
  // Editor
  editor: string;
  editorSubtitle: string;
  clearEditor: string;
  refreshEditor: string;
  confirmClear: string;
  
  // Preview
  preview: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  dragToMove: string;
  wheelToZoom: string;
  scrollZoom: string;
  dragMove: string;
  
  // Toolbar
  theme: string;
  export: string;
  exportDesc: string;
  copy: string;
  copyDesc: string;
  copying: string;
  copyingDesc: string;
  copySuccess: string;
  copySuccessDesc: string;
  copyWithBackground: string;
  copyWithBackgroundDesc: string;
  copyTransparent: string;
  copyTransparentDesc: string;
  withBackground: string;
  withBackgroundDesc: string;
  transparent: string;
  transparentDesc: string;
  
  // Language
  language: string;
  languageName: string;
  
  // Examples
  examples: string;
  selectExample: string;
  loadExample: string;
  
  // Background
  background: string;
  selectBackground: string;
  
  // Font
  font: string;
  selectFont: string;
  
  // Annotations
  annotations: string;
  select: string;
  arrow: string;
  text: string;
  rectangle: string;
  circle: string;
  line: string;
  clearAll: string;
  clearAnnotations: string;
  confirmClearAnnotations: string;
  doubleClickToEdit: string;
  copyAnnotation: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  normal: string;
  bold: string;
  strokeWidth: string;
  
  // Color Picker
  changeNodeColor: string;
  presetColors: string;
  customColor: string;
  apply: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  blue: string;
  purple: string;
  pink: string;
  gray: string;
  
  // Fullscreen
  enterFullscreen: string;
  exitFullscreen: string;
  
  // Cookie Consent
  cookieTitle: string;
  cookieMessage: string;
  cookieAccept: string;
  cookieDecline: string;
  
  // Dialog
  confirm: string;
  cancel: string;
}

export const translations: Record<Language, Translation> = {
  'en': {
    // Header
    appTitle: 'Diagram Editor',
    share: 'Share',
    shareSuccess: 'Share link copied!',
    shareCopied: 'Link copied to clipboard successfully',
    
    // Editor
    editor: 'Editor',
    editorSubtitle: 'Mermaid Syntax',
    clearEditor: 'Clear',
    refreshEditor: 'Refresh',
    confirmClear: 'Are you sure you want to clear the editor?',
    
    // Preview
    preview: 'Preview',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    dragToMove: 'Drag to Move',
    wheelToZoom: 'Wheel to Zoom',
    scrollZoom: 'Scroll to zoom',
    dragMove: 'Drag to move',
    
    // Toolbar
    theme: 'Theme',
    export: 'Export',
    exportDesc: 'Export the diagram as an image',
    copy: 'Copy',
    copyDesc: 'Copy the diagram to clipboard',
    copying: 'Copying...',
    copyingDesc: 'Please wait, generating image',
    copySuccess: 'Copy successful!',
    copySuccessDesc: 'Image copied to clipboard',
    copyWithBackground: 'Copy with background',
    copyWithBackgroundDesc: 'Includes current background',
    copyTransparent: 'Copy transparent',
    copyTransparentDesc: 'PNG format, no background',
    withBackground: 'With Background',
    withBackgroundDesc: 'JPG - Includes background color',
    transparent: 'Transparent',
    transparentDesc: 'PNG - Transparent background',
    
    // Language
    language: 'Language',
    languageName: 'English',
    
    // Examples
    examples: 'Examples',
    selectExample: 'Select Example',
    loadExample: 'Load Example',
    
    // Background
    background: 'Background',
    selectBackground: 'Select Background',
    
    // Font
    font: 'Font',
    selectFont: 'Select Font',
    
    // Color Picker
    changeNodeColor: 'Change Node Color',
    presetColors: 'Preset Colors',
    customColor: 'Custom Color',
    apply: 'Apply',
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink',
    gray: 'Gray',
    
    // Annotations
    annotations: 'Annotations',
    select: 'Select',
    arrow: 'Arrow',
    text: 'Text',
    rectangle: 'Rectangle',
    circle: 'Circle',
    line: 'Line',
    clearAll: 'Clear All',
    clearAnnotations: 'Clear Annotations',
    confirmClearAnnotations: 'Are you sure you want to clear all annotations?',
    doubleClickToEdit: 'Double-click to edit',
    copyAnnotation: 'Copy annotation',
    fontSize: 'Font Size',
    fontWeight: 'Font Weight',
    fontFamily: 'Font Family',
    normal: 'Normal',
    bold: 'Bold',
    strokeWidth: 'Stroke Width',
    
    // Fullscreen
    enterFullscreen: 'Enter Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    
    // Cookie Consent
    cookieTitle: 'We use cookies',
    cookieMessage: 'We use cookies and similar technologies to improve your experience, analyze site traffic, and personalize content. By clicking "Accept", you consent to our use of cookies.',
    cookieAccept: 'Accept',
    cookieDecline: 'Decline',
    
    // Dialog
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  'es': {
    // Header
    appTitle: 'Editor de Diagramas',
    share: 'Compartir',
    shareSuccess: '¡Enlace copiado!',
    shareCopied: 'Enlace copiado al portapapeles correctamente',
    
    // Editor
    editor: 'Editor',
    editorSubtitle: 'Sintaxis de Mermaid',
    clearEditor: 'Limpiar',
    refreshEditor: 'Actualizar',
    confirmClear: '¿Está seguro de que desea limpiar el editor?',
    
    // Preview
    preview: 'Vista previa',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    resetView: 'Restablecer vista',
    dragToMove: 'Arrastrar para mover',
    wheelToZoom: 'Rueda para zoom',
    scrollZoom: 'Desplazar para zoom',
    dragMove: 'Arrastrar para mover',
    
    // Toolbar
    theme: 'Tema',
    export: 'Exportar',
    exportDesc: 'Exportar el diagrama como imagen',
    copy: 'Copiar',
    copyDesc: 'Copiar el diagrama al portapapeles',
    copying: 'Copiando...',
    copyingDesc: 'Por favor espere, generando imagen',
    copySuccess: '¡Copia exitosa!',
    copySuccessDesc: 'Imagen copiada al portapapeles',
    copyWithBackground: 'Copiar con fondo',
    copyWithBackgroundDesc: 'Incluye el fondo actual',
    copyTransparent: 'Copiar transparente',
    copyTransparentDesc: 'Formato PNG, sin fondo',
    withBackground: 'Con fondo',
    withBackgroundDesc: 'JPG - Incluye color de fondo',
    transparent: 'Fondo transparente',
    transparentDesc: 'PNG - Fondo transparente',
    
    // Language
    language: 'Idioma',
    languageName: 'Español',
    
    // Examples
    examples: 'Ejemplos',
    selectExample: 'Seleccionar ejemplo',
    loadExample: 'Cargar ejemplo',
    
    // Background
    background: 'Fondo',
    selectBackground: 'Seleccionar fondo',
    
    // Font
    font: 'Fuente',
    selectFont: 'Seleccionar fuente',
    
    // Color Picker
    changeNodeColor: 'Cambiar color del nodo',
    presetColors: 'Colores predefinidos',
    customColor: 'Color personalizado',
    apply: 'Aplicar',
    red: 'Rojo',
    orange: 'Naranja',
    yellow: 'Amarillo',
    green: 'Verde',
    blue: 'Azul',
    purple: 'Púrpura',
    pink: 'Rosa',
    gray: 'Gris',
    
    // Annotations
    annotations: 'Herramientas de anotación',
    select: 'Seleccionar',
    arrow: 'Flecha',
    text: 'Texto',
    rectangle: 'Rectángulo',
    circle: 'Círculo',
    line: 'Línea',
    clearAll: 'Limpiar todo',
    clearAnnotations: 'Limpiar anotaciones',
    confirmClearAnnotations: '¿Está seguro de que desea limpiar todas las anotaciones?',
    doubleClickToEdit: 'Doble clic para editar',
    copyAnnotation: 'Copiar anotación',
    fontSize: 'Tamaño de fuente',
    fontWeight: 'Grosor de fuente',
    fontFamily: 'Fuente',
    normal: 'Normal',
    bold: 'Negrita',
    strokeWidth: 'Grosor de línea',
    
    // Fullscreen
    enterFullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    
    // Cookie Consent
    cookieTitle: 'Usamos cookies',
    cookieMessage: 'Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el tráfico del sitio y personalizar el contenido. Al hacer clic en "Aceptar", usted acepta nuestro uso de cookies.',
    cookieAccept: 'Aceptar',
    cookieDecline: 'Rechazar',
    
    // Dialog
    confirm: 'Confirmar',
    cancel: 'Cancelar',
  },
};

export const getTranslation = (lang: Language): Translation => {
  return translations[lang] || translations['en'];
};
