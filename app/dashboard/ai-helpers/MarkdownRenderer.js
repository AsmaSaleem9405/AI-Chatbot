'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Check, Copy } from 'lucide-react';

function CodeBlock({ language, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden my-4 border border-slate-700/50 bg-[#1e1e1e] text-xs sm:text-sm shadow-md not-prose">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-slate-400 border-b border-slate-700/50">
        <span className="font-mono lowercase text-xs">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 transition text-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Syntax Highlighter */}
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');

          if (!inline && match) {
            return <CodeBlock language={match[1]} value={codeString} />;
          }
          
          if (!inline && !match) {
            return <CodeBlock language="text" value={codeString} />;
          }

          return (
            <code className="bg-slate-200/70 text-indigo-600 px-1.5 py-0.5 rounded text-xs font-mono font-medium" {...props}>
              {children}
            </code>
          );
        },
        p({ children }) {
          const hasBlockElement = React.Children.toArray(children).some(
            (child) => React.isValidElement(child) && (child.type === CodeBlock || child.type === 'div' || child.type === 'pre')
          );

          if (hasBlockElement) {
            return <div className="mb-3 last:mb-0 leading-relaxed">{children}</div>;
          }

          return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
        },
        ul({ children }) {
          return <ul className="list-disc pl-5 mb-3 space-y-1.5">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-5 mb-3 space-y-1.5">{children}</ol>;
        },
        li({ children }) {
          return <li className="leading-relaxed">{children}</li>;
        },
        h1({ children }) {
          return <h1 className="text-xl font-bold mb-3 mt-4 text-slate-900">{children}</h1>;
        },
        h2({ children }) {
          return <h2 className="text-lg font-bold mb-2.5 mt-3 text-slate-900">{children}</h2>;
        },
        h3({ children }) {
          return <h3 className="text-base font-semibold mb-2 mt-2.5 text-slate-900">{children}</h3>;
        },
        strong({ children }) {
          return <strong className="font-semibold text-slate-900">{children}</strong>;
        },
        blockquote({ children }) {
          return <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 my-3 text-slate-600 italic bg-slate-50 rounded-r-lg">{children}</blockquote>;
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return <th className="bg-slate-100 p-2.5 text-xs font-semibold text-slate-700 border-b border-slate-200">{children}</th>;
        },
        td({ children }) {
          return <td className="p-2.5 text-xs text-slate-600 border-b border-slate-100">{children}</td>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}