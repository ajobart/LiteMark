import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialTitle, initialContent, onSave }) => {
  
  // State for the title of the note
  const [title, setTitle] = useState(initialTitle);

  // State for the content of the note
  const [content, setContent] = useState(initialContent);

  // Update the local title and content state if `initialTitle` or `initialContent` change
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Handle content changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Utility function for debouncing the save function
  function debounce(func: (title: string, content: string) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (title: string, content: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(title, content);
      }, delay);
    };
  }

  // Debounced save function to avoid saving too frequently
  const debounceSave = useCallback(
    debounce((newTitle: string, newContent: string) => {
      onSave(newTitle, newContent);
    }, 500),
    [onSave]
  );

  // Call debounceSave whenever the title or content changes
  useEffect(() => {
    debounceSave(title, content);
  }, [title, content, debounceSave]);

  return (
    <div className="w-3/4 p-4 h-screen w-full flex flex-row gap-2">
      <div className='w-full h-screen'>
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="w-full p-2 rounded mb-4 outline-none bg-background-page text-xl font-bold"
        />
        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full outline-none h-screen p-2 rounded mb-4 bg-background-page"
        />
      </div>
      {/* Separator */}
      <div className='h-full w-[2px] bg-background-border'></div>
      {/* Markdown Renderer */}
      <div className="p-4 box-border rounded w-full h-screen markdown-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {`# ${title}\n\n${typeof content === 'string' ? content : ''}`}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
