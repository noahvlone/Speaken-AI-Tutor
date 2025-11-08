import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h3 className="font-semibold text-base mt-2 mb-1">{children}</h3>
  ),
  h2: ({ children }) => (
    <h4 className="font-semibold text-sm mt-2 mb-1">{children}</h4>
  ),
  p: ({ children }) => <p className="mb-2">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-3 italic my-2">
      {children}
    </blockquote>
  ),
  hr: () => <div className="my-3 border-t border-gray-200" />,
  // ✅ Perbaikan utama: pakai signature props yang benar dari react-markdown
  code: (props: any) => {
    const { inline, children, ...rest } = props;
    return inline ? (
        <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-800" {...rest}>
        {children}
        </code>
    ) : (
        <pre className="p-3 bg-gray-900 text-gray-100 rounded overflow-x-auto text-xs">
        <code {...rest}>{children}</code>
        </pre>
    );
  },
};

export function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="text-sm leading-6 break-words whitespace-pre-wrap">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
