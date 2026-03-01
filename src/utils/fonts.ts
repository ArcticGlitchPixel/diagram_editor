export interface FontOption {
  id: string;
  name: Record<string, string>;
  fontFamily: string;
  previewText: Record<string, string>;
}

export const fonts: FontOption[] = [
  {
    id: 'default',
    name: {
      'en': 'Default (Theme)',
      'ja': 'デフォルト（テーマ）',
      'es': 'Por defecto (Tema)',
      'pt': 'Padrão (Tema)',
    },
    fontFamily: '',
    previewText: {
      'en': 'Default Font',
      'ja': 'デフォルトフォント',
      'es': 'Fuente predeterminada',
      'pt': 'Fonte padrão',
    },
  },
  {
    id: 'inter',
    name: {
      'en': 'Inter (Modern)',
      'ja': 'Inter（モダン）',
      'es': 'Inter (Moderno)',
      'pt': 'Inter (Moderno)',
    },
    fontFamily: '"Inter", "Noto Sans SC", sans-serif',
    previewText: {
      'en': 'Inter Font',
      'ja': 'Inter フォント',
      'es': 'Fuente Inter',
      'pt': 'Fonte Inter',
    },
  },
  {
    id: 'mono',
    name: {
      'en': 'JetBrains Mono',
      'ja': 'JetBrains Mono（コード）',
      'es': 'JetBrains Mono (Código)',
      'pt': 'JetBrains Mono (Código)',
    },
    fontFamily: '"JetBrains Mono", "Noto Sans SC", monospace',
    previewText: {
      'en': 'Mono Font',
      'ja': 'モノフォント',
      'es': 'Fuente Mono',
      'pt': 'Fonte Mono',
    },
  },
  {
    id: 'serif',
    name: {
      'en': 'Noto Serif (Elegant)',
      'ja': 'Noto Serif（エレガント）',
      'es': 'Noto Serif (Elegante)',
      'pt': 'Noto Serif (Elegante)',
    },
    fontFamily: '"Noto Serif SC", "Noto Sans SC", serif',
    previewText: {
      'en': 'Serif Font',
      'ja': 'セリフフォント',
      'es': 'Fuente Serif',
      'pt': 'Fonte Serif',
    },
  },
  {
    id: 'handwriting',
    name: {
      'en': 'Caveat (Handwriting)',
      'es': 'Caveat (Manuscrita)',
      'pt': 'Caveat (Manuscrita)',
    },
    fontFamily: '"Caveat", "Patrick Hand", cursive',
    previewText: {
      'en': 'Handwriting',
      'es': 'Manuscrita',
      'pt': 'Manuscrita',
    },
  },
  {
    id: 'rounded',
    name: {
      'en': 'Nunito (Rounded)',
      'es': 'Nunito (Redondeada)',
      'pt': 'Nunito (Arredondada)',
    },
    fontFamily: '"Nunito", "Noto Sans SC", sans-serif',
    previewText: {
      'en': 'Rounded Font',
      'es': 'Fuente redondeada',
      'pt': 'Fonte arredondada',
    },
  },
  {
    id: 'system',
    name: {
      'en': 'System Default',
      'ja': 'システムデフォルト',
      'es': 'Sistema predeterminado',
      'pt': 'Sistema padrão',
    },
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", sans-serif',
    previewText: {
      'en': 'System Font',
      'ja': 'システムフォント',
      'es': 'Fuente del sistema',
      'pt': 'Fonte do sistema',
    },
  },
];

