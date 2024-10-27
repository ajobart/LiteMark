import React, { useState, useEffect } from 'react';
import Sidebar from '../../molecule/sidebar/sidebar';
import MarkdownEditor from '../../molecule/markdown-editor/markdown-editor';
import { getNotes, addNote, initializeNotes, updateNote, deleteNote } from '../../services/storage.service';
import { Note } from '../../types/note.type';
import Image from '../../atoms/image/image';

const Home: React.FC = () => {

  // State for list of notes
  const [notes, setNotes] = useState<Note[]>([]);

  // State to keep selected note
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // State to control sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  /**
   * Effect to init notes
   */
  useEffect(() => {
    initializeNotes();
    const loadedNotes = getNotes();
    setNotes(loadedNotes.map(note => ({ id: note.id, content: note.content, lastModified: note.lastModified, title: note.title })));

    // Select the first note if any exist
    if (loadedNotes.length > 0) {
      const firstNote = loadedNotes[0];
      setSelectedNote({ id: firstNote.id, title: firstNote.title, lastModified: firstNote.lastModified, content: firstNote.content });
    }
  }, []);

  // Save the note's title and content when changes are made
  const handleSaveContent = (title: string, content: string) => {
    if (selectedNote && (selectedNote.title !== title || selectedNote.content !== content)) {
      // Only update if there is a change in title or content
      updateNote(selectedNote.id, { title, content });

      // Update the lastModified date in the selected note
      const updatedNote = { ...selectedNote, title, content, lastModified: new Date() }
      setSelectedNote(updatedNote);
      // Update content here
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === selectedNote.id ? updatedNote : note))
      );
    }
  };

  // Handle selecting a note from the sidebar
  const handleSelectNote = (id: string) => {
    // Only update if the selected note is different
    if (selectedNote?.id !== id) {
      const selected = getNotes().find(note => note.id === id);
      if (selected) {
        // Prevent looping by checking if the note is different
        if (selectedNote?.id !== selected.id) {
          setSelectedNote({ id: selected.id, title: selected.title, lastModified: selected.lastModified, content: selected.content });
        }
      }
    }
  };

  // Handle creating a new note
  const handleCreateNote = () => {
    const newNote = {
      id: new Date().toISOString(),
      title: `New Note`,
      lastModified: new Date(),
      content: '',
    };

    addNote(newNote);
    // Update the notes state immediately after adding the new note
    setNotes(prevNotes => [...prevNotes, newNote]);
    setSelectedNote({ id: newNote.id, title: newNote.title, lastModified: newNote.lastModified, content: newNote.content });
  };

  // Handle deleting a note
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      // Deselect the note if it was deleted
      setSelectedNote(null);
    }
  };

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(prev => !prev);
  };

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden flex">
      <div className={`h-screen transition-all duration-300 ${isSidebarVisible ? 'w-[350px]' : 'w-0 overflow-hidden'}`}>
        <Sidebar
          // Force re-render when the number of notes changes
          key={notes.length}
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
      <div className="flex-1 bg-background-page h-screen overflow-hidden">
        <button 
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-10 bg-background-border hover:bg-background-selected transition ease-in-out duration-250 p-1 box-border rounded"
        >
          {isSidebarVisible ? <Image className='size-6' path='/icons/sidebar-hide.svg'></Image> : <Image className='size-6' path='/icons/sidebar-show.svg'></Image>}
        </button>
        {selectedNote ? (
          <MarkdownEditor
            // Add key here to force re-render
            key={selectedNote.id}
            initialTitle={selectedNote.title}
            initialContent={selectedNote.content}
            onSave={handleSaveContent}
            isSidebarVisible={isSidebarVisible}
            onDelete={handleDeleteNote}
            noteId={selectedNote.id}
          />
        ) : (
          <div className='w-full h-screen flex flex-col items-center justify-center'>
            <p className="text-center text-3xl font-bold">LiteMark</p>
            <p className="text-center text-lg">No note selected.</p>
            <p className="text-center text-lg">Create a new note or select one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
