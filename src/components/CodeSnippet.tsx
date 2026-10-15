import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

interface CodeSnippetProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeSnippet: React.FC<CodeSnippetProps> = ({
  code,
  language = 'java',
  filename = 'Solution.java',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  // Simple token highlighter for Java
  const highlightJava = (line: string) => {
    // Comments
    if (line.trim().startsWith('//')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Split words while preserving symbols
    const parts = line.split(/(\b(?:public|private|protected|class|interface|extends|implements|static|final|void|return|new|if|else|for|while|try|catch|finally|throw|throws|default|import|package|volatile|synchronized|boolean|int|double|float|long|short|byte|char)\b|"(?:[^"\\]|\\.)*"|@\w+)/g);

    return parts.map((part, i) => {
      if (/^(public|private|protected|class|interface|extends|implements|static|final|void|return|new|if|else|for|while|try|catch|finally|throw|throws|default|import|package|volatile|synchronized)$/.test(part)) {
        return <span key={i} className="text-amber-400 font-semibold">{part}</span>;
      }
      if (/^(boolean|int|double|float|long|short|byte|char)$/.test(part)) {
        return <span key={i} className="text-cyan-400">{part}</span>;
      }
      if (part.startsWith('"') && part.endsWith('"')) {
        return <span key={i} className="text-emerald-400">{part}</span>;
      }
      if (part.startsWith('@')) {
        return <span key={i} className="text-purple-400 italic">{part}</span>;
      }
      return <span key={i} className="text-slate-200">{part}</span>;
    });
  };

  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900/90 text-sm font-mono my-3 shadow-inner">
      {/* Code Window Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-slate-300 font-medium">{filename}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-500 uppercase tracking-wider text-[10px]">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content with Line Numbers */}
      <div className="p-3 overflow-x-auto text-xs leading-relaxed max-h-96">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40">
                <td className="w-8 pr-3 text-right select-none text-slate-600 font-mono text-[11px] tabular-nums align-top">
                  {idx + 1}
                </td>
                <td className="pl-2 text-slate-200 whitespace-pre font-mono">
                  {highlightJava(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
