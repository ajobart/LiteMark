import React, { useState, useEffect, useCallback, useRef, AnchorHTMLAttributes, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from '../../atoms/image/image';

interface MarkdownEditorProps {
  initialTitle: string;
  initialContent: string;
  onSave: (title: string, content: string) => void;
  isSidebarVisible: boolean;
  onDelete: (id: string) => void;
  noteId: string;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialTitle, initialContent, onSave, isSidebarVisible, onDelete, noteId }) => {

  // State for the title of the note
  const [title, setTitle] = useState(initialTitle);

  // State to track hover status
  const [isHovered, setIsHovered] = useState(false);

  // State for the content of the note
  const [content, setContent] = useState(initialContent);

  // State to track if it's the first load
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Refs for the title, textarea and the markdown preview div
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Update the local title and content state if `initialTitle` or `initialContent` change
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);

    // Focus the title input only when it's the first load (new note is opened)
    if (isFirstLoad && titleRef.current) {
      titleRef.current.focus();
      setIsFirstLoad(false);
    }
  }, [initialTitle, initialContent, isFirstLoad]);

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

  // Function to handle scroll synchronization
  function handleEditorScroll() {
    if (editorRef.current && previewRef.current) {
      const editor = editorRef.current;
      const preview = previewRef.current;

      // Calculate scroll percentage of the editor
      const scrollPercentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

      // Sync the scroll position of the preview
      preview.scrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight);
    }
  }

  // Function to handle scroll synchronization
  /*function handlePreviewScroll() {
    if (previewRef.current && editorRef.current) {
      const editor = editorRef.current;
      const preview = previewRef.current;

      // Calculate scroll percentage of the preview
      const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);

      // Sync the scroll position of the editor
      editor.scrollTop = scrollPercentage * (editor.scrollHeight - editor.clientHeight);
    }
  }*/

  /**
   * Handle key press events on the title input
   * @param e - KeyboardEvent
   */
  const handleTitleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editorRef.current) {
      // Prevent the default behavior of Enter
      e.preventDefault();
      // Focus the textarea when Enter is pressed
      editorRef.current.focus();
    }
  };

  // Custom link component compatible with react-markdown
  const customLink = ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );

  // Custom code block component for react-markdown
  const customCodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={dracula}
        language={match[1]}
        showLineNumbers={true}
        PreTag="div"
        className="text-xs"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  /**
   * Function to export the note as a .md file
   */
  function exportNote() {
    const blob = new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Sanitize the title for the filename
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Clean up the URL object
    URL.revokeObjectURL(url);
  }

  /**
   * Function to insert Markdown at the cursor position
   * @param markdown - The markdown to insert
   */
  function insertMarkdown(markdown: string) {
    const editor = editorRef.current;
    if (editor) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const currentContent = content;

      // Insert the markdown at the cursor position
      const newContent = currentContent.substring(0, start) + markdown + currentContent.substring(end);
      setContent(newContent);

      // Move the cursor to the position after the inserted markdown
      setTimeout(() => {
        editor.selectionStart = editor.selectionEnd = start + markdown.length;
        editor.focus();
      }, 0);
    }
  }

  /**
   * Function to insert H1
   */
  function handleH1Click() {
    insertMarkdown('# ');
  }

  /**
   * Function to insert H2
   */
  function handleH2Click() {
    insertMarkdown('## ');
  }

  /**
   * Function to insert bold
   */
  function handleBoldClick() {
    insertMarkdown('****');
    setTimeout(() => {
      const editor = editorRef.current;
      if (editor) {
        const start = editor.selectionStart;
        // Move cursor at the middle for bold text
        editor.selectionStart = editor.selectionEnd = start - 2;
        editor.focus();
      }
    }, 0);
  }

  /**
   * Function to insert italic
   */
  function handleItalicClick() {
    insertMarkdown('*')
    setTimeout(() => {
      const editor = editorRef.current;
      if (editor) {
        const start = editor.selectionStart;
        // Move cursor to the correct position for italic text
        editor.selectionStart = editor.selectionEnd = start - 1;
        editor.focus();
      }
    }, 0);
  }

  /**
   * Function to insert table
   */
  function handleTableClick() {
    insertMarkdown('\n| Header | Header |\n| ------ | ------ |\n| Row 1 | Row 1 |\n| Row 2 | Row 2 |\n');
  }

  /**
   * Function to insert code block
   */
  function handleCodeClick() {
    insertMarkdown('\n```js\n\n```')
    setTimeout(() => {
      const editor = editorRef.current;
      if (editor) {
        const start = editor.selectionStart;
        // Move cursor to the correct position for code bloc
        editor.selectionStart = editor.selectionEnd = start - 4;
        editor.focus();
      }
    }, 0);
  }

  /**
   * Function to insert checkbox
   */
  function handleCheckboxClick() {
    insertMarkdown('\n- [ ] ');
  }

  /**
  * Function to insert checkbox
  */
  function handleLinkClick() {
    insertMarkdown('[Lien]()');
    setTimeout(() => {
      const editor = editorRef.current;
      if (editor) {
        const start = editor.selectionStart;
        // Move cursor to the correct position for code bloc
        editor.selectionStart = editor.selectionEnd = start - 1;
        editor.focus();
      }
    }, 0);
  }

  /**
   * Function to delete note
   */
  function handleDeleteClick() {
    onDelete(noteId);
  }

  return (
    <div className="w-3/4 p-4 box-border h-screen w-full flex flex-row mt-2 gap-2">
      <div className='w-full h-screen overflow-x-hidden max-h-screen overflow-scroll'>
        <div className='mb-1 pb-4 box-border border-b border-background-border w-full sticky top-0 bg-background-page'>
          {/* Title Input */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Note Title"
            className={`w-full ${isSidebarVisible ? '' : 'ml-14 mb-4 animation ease-in-out duration-300'} p-0 rounded mb-2 outline-none bg-background-page text-xl font-bold`}
          />
          {/* TOOLBAR */}
          <ul className='flex w-full gap-1.5'>
            {/* Insert h1 */}
            <li>
              <button
                onClick={handleH1Click}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/h1.svg" className='size-5' />
              </button>
            </li>
            {/* Insert h2 */}
            <li>
              <button
                onClick={handleH2Click}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/h2.svg" className='size-5' />
              </button>
            </li>
            {/* Insert bold */}
            <li>
              <button
                onClick={handleBoldClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/bold.svg" className='size-5' />
              </button>
            </li>
            {/* Insert italic */}
            <li>
              <button
                onClick={handleItalicClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/italic.svg" className='size-5' />
              </button>
            </li>
            {/* Insert table */}
            <li>
              <button
                onClick={handleTableClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/table.svg" className='size-5' />
              </button>
            </li>
            {/* Insert checkbox */}
            <li>
              <button
                onClick={handleCheckboxClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/checkbox.svg" className='size-5' />
              </button>
            </li>
            {/* Insert link */}
            <li>
              <button
                onClick={handleLinkClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/link.svg" className='size-5' />
              </button>
            </li>
            {/* Insert code */}
            <li>
              <button
                onClick={handleCodeClick}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/code.svg" className='size-5' />
              </button>
            </li>
            {/* Export */}
            <li>
              <button
                onClick={exportNote}
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
              >
                <Image path="/icons/export.svg" className='size-5' />
              </button>
            </li>
            {/* Delete */}
            <li>
              <button
                className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-1 rounded"
                onClick={handleDeleteClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Image path={isHovered ? '/icons/trash-red.svg' : '/icons/trash-gray.svg'} className={`size-5 transition-transform transition-opacity duration-300 ${isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-50'}`} />
              </button>
            </li>
          </ul>
        </div>
        {/* Content Textarea */}
        <textarea
          ref={editorRef}
          value={content}
          placeholder='Type something here...'
          onChange={handleContentChange}
          onScroll={handleEditorScroll}
          className="w-full resize-none outline-none h-screen p-2 rounded mb-4 bg-background-page"
        />
      </div>
      {/* Separator */}
      <div className='h-full w-[2px] bg-background-border'></div>
      {/* Markdown Renderer */}
      {/* To fix : onScroll={handlePreviewScroll} */}
      <div ref={previewRef} className="p-4 box-border rounded w-full h-screen max-h-screen overflow-scroll markdown-body">
        <ReactMarkdown
          components={{
            // Use custom compnents
            a: customLink,
            code: customCodeBlock
          }}
          remarkPlugins={[remarkGfm]}
        >
          {`# ${title}\n\n${typeof content === 'string' ? content : ''}`}
        </ReactMarkdown>
      </div>
    </div >
  );
};

export default MarkdownEditor;
