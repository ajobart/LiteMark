import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="w-3/4 p-4 h-fit w-full flex gap-2">
      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-screen p-2 rounded mb-4 bg-background-page"
      />
      {/* Separator */}
      <div className='h-screen w-[2px] bg-gray-300'></div>
      {/* Renderer */}
      <div className="p-4 rounded w-full h-screen markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
