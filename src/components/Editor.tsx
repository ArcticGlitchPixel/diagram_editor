import React, { useRef, useEffect, useState } from 'react';

interface EditorProps {
  code: string;
  onChange: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current && lineNumberRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const highlightCode = (code: string): React.ReactElement[] => {
    if (!code) return [];
    
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => {
      const parts: React.ReactElement[] = [];
      let key = 0;

      const commentMatch = line.match(/%%.*$/);
      if (commentMatch && commentMatch.index !== undefined) {
        const beforeComment = line.substring(0, commentMatch.index);
        if (beforeComment) {
          parts.push(...highlightLineSegment(beforeComment, lineIndex, key));
          key += 100; 
        }
        parts.push(
          <span key={`${lineIndex}-${key++}`} className="text-gray-400 dark:text-gray-500 italic">
            {commentMatch[0]}
          </span>
        );
        return <div key={lineIndex}>{parts}</div>;
      }

      parts.push(...highlightLineSegment(line, lineIndex, key));
      return <div key={lineIndex}>{parts.length > 0 ? parts : '\u00A0'}</div>;
    });
  };

  const highlightLineSegment = (text: string, lineIndex: number, startKey: number): React.ReactElement[] => {
    if (!text) return [];
    
    const parts: React.ReactElement[] = [];
    let key = startKey;
    
    const patterns = [
      { 
        regex: /(\[([^\[\]]*)\]|\(([^()]*)\)|\{([^{}]*)\}|"([^"]*)"|'([^']*)')/g,
        className: 'text-orange-600 dark:text-orange-400'
      },
      { 
        regex: /\b(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|gitGraph|mindmap|timeline|quadrantChart|xyChart)\b/gi,
        className: 'text-purple-600 dark:text-purple-400 font-semibold'
      },
      { 
        regex: /\b(TD|TB|BT|RL|LR)\b/g,
        className: 'text-blue-600 dark:text-blue-400 font-semibold'
      },
      { 
        regex: /\b(style|class|classDef|click|subgraph|end|participant|activate|deactivate|Note|loop|alt|opt|par)\b/gi,
        className: 'text-pink-600 dark:text-pink-400 font-semibold'
      },
      { 
        regex: /(-->|---|-\.->|\.-|===>|==>|->|<--|<->)/g,
        className: 'text-green-600 dark:text-green-400 font-bold'
      },
    ];
    
    interface Match {
      start: number;
      end: number;
      text: string;
      className: string;
      priority: number; 
    }
    
    const matches: Match[] = [];
    
    patterns.forEach((pattern, priority) => {
      let match;
      const regex = new RegExp(pattern.regex);
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          className: pattern.className,
          priority
        });
      }
    });
    
    matches.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      if (a.end !== b.end) return b.end - a.end; 
      return a.priority - b.priority;
    });
    
    const filteredMatches: Match[] = [];
    for (const match of matches) {
      const hasOverlap = filteredMatches.some(
        existing => !(match.end <= existing.start || match.start >= existing.end)
      );
      if (!hasOverlap) {
        filteredMatches.push(match);
      }
    }
    
    filteredMatches.sort((a, b) => a.start - b.start);
    
    let lastIndex = 0;
    for (const match of filteredMatches) {
      if (match.start > lastIndex) {
        const plainText = text.substring(lastIndex, match.start);
        parts.push(<span key={`${lineIndex}-${key++}`}>{plainText}</span>);
      }
      
      parts.push(
        <span key={`${lineIndex}-${key++}`} className={match.className}>
          {match.text}
        </span>
      );
      
      lastIndex = match.end;
    }
    
    if (lastIndex < text.length) {
      const plainText = text.substring(lastIndex);
      parts.push(<span key={`${lineIndex}-${key++}`}>{plainText}</span>);
    }
    
    return parts;
  };

  return (
    <div className="h-full relative flex overflow-hidden">
      <div className="flex-shrink-0 w-12 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
        <div 
          ref={lineNumberRef}
          className="h-full py-6 px-2 text-right text-sm leading-relaxed font-mono overflow-hidden"
        >
          {lineNumbers.map((lineNum) => (
            <div 
              key={lineNum} 
              className="text-gray-400 dark:text-gray-600 select-none"
            >
              {lineNum}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative bg-white dark:bg-gray-800 overflow-hidden">
        <div
          ref={highlightRef}
          className="absolute inset-0 p-6 font-mono text-sm leading-relaxed overflow-auto pointer-events-none select-none text-gray-800 dark:text-gray-200"
          style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            tabSize: 2,
            whiteSpace: 'pre-wrap'
          }}
        >
          {code ? highlightCode(code) : <div className="text-gray-400 dark:text-gray-500">Enter Mermaid code here...</div>}
        </div>

        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full p-6 m-0 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-transparent transition-colors duration-200 overflow-auto"
          style={{
            color: 'transparent',
            caretColor: '#6366f1', // indigo-500
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            tabSize: 2,
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            outline: 'none'
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
};

export default Editor;
