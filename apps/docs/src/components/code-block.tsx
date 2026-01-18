'use client';

// @ts-ignore - react-syntax-highlighter types
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore - react-syntax-highlighter types
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'typescript' }: CodeBlockProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm shadow-2xl overflow-hidden">
      {/* Code block decoration */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-muted/30 border-b border-border flex items-center gap-2 px-4 z-10">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <div className="pt-12">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
