import LZString from 'lz-string';

/**
 */
export const compressToURL = (str: string): string => {
  try {
    return LZString.compressToEncodedURIComponent(str);
  } catch (error) {
    console.error('Compression error:', error);
    return '';
  }
};

/**
 */
export const decompressFromURL = (compressed: string): string => {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    return decompressed || '';
  } catch (error) {
    console.error('Decompression error:', error);
    return '';
  }
};

/**
 */
export interface ShareParams {
  code?: string;
  theme?: string;
  background?: string;
  font?: string;
  example?: string;
}

export const generateShareURL = (params: ShareParams): string => {
  const url = new URL(window.location.origin + window.location.pathname);
  
  if (params.code && params.code.trim()) {
    const compressed = compressToURL(params.code);
    if (compressed) {
      url.searchParams.set('c', compressed);
    }
  }
  
  if (params.theme) {
    url.searchParams.set('theme', params.theme);
  }
  
  if (params.background) {
    url.searchParams.set('bg', params.background);
  }
  
  if (params.font) {
    url.searchParams.set('font', params.font);
  }
  
  if (params.example) {
    url.searchParams.set('example', params.example);
  }
  
  return url.toString();
};

/**
 */
export const parseShareURL = (): ShareParams | null => {
  try {
    const url = new URL(window.location.href);
    const params: ShareParams = {};
    
    const compressedCode = url.searchParams.get('c');
    if (compressedCode) {
      const decompressed = decompressFromURL(compressedCode);
      if (decompressed) {
        params.code = decompressed;
      }
    }
    
    const theme = url.searchParams.get('theme');
    if (theme) {
      params.theme = theme;
    }
    
    const bg = url.searchParams.get('bg');
    if (bg) {
      params.background = bg;
    }
    
    const font = url.searchParams.get('font');
    if (font) {
      params.font = font;
    }
    
    const example = url.searchParams.get('example');
    if (example) {
      params.example = example;
    }
    
    if (Object.keys(params).length > 0) {
      return params;
    }
    
    return null;
  } catch (error) {
    console.error('Parse share URL error:', error);
    return null;
  }
};

