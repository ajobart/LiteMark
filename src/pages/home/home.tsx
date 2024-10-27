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
    setNotes(loadedNotes.map(note => ({ id: note.id, content: note.content, lastModified: note.lastModified, title: note.title, tags: note.tags })));

    // Select the most recently modified note by default
    if (loadedNotes.length > 0) {
      const mostRecentNote = loadedNotes.reduce((prev, current) => {
        return new Date(prev.lastModified) > new Date(current.lastModified) ? prev : current;
      });
      setSelectedNote({ ...mostRecentNote });
    }
  }, []);

  /**
   * Function to save the note's title when changes are made
   * @param title - of the note
   * @param content - of the note
   * @param tags - of the note
   */
  function handleSaveContent(title: string, content: string, tags: string[]) {
    if (selectedNote && (selectedNote.title !== title || selectedNote.content !== content || selectedNote.tags !== tags)) {
      // Only update if there is a change in title or content or tags
      updateNote(selectedNote.id, { title, content, tags });

      // Update the lastModified date in the selected note
      const updatedNote = { ...selectedNote, title, content, lastModified: new Date(), tags }
      setSelectedNote(updatedNote);
      // Update content here
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === selectedNote.id ? updatedNote : note))
      );
    }
  }

  /**
   * Function to handle selecting a notre from the sidebar
   * @param id - of the note selected
   */
  function handleSelectNote(id: string) {
    // Only update if the selected note is different
    if (selectedNote?.id !== id) {
      const selected = getNotes().find(note => note.id === id);
      if (selected) {
        // Prevent looping by checking if the note is different
        if (selectedNote?.id !== selected.id) {
          setSelectedNote({ id: selected.id, title: selected.title, lastModified: selected.lastModified, content: selected.content, tags: selected.tags });
        }
      }
    }
  }

  /**
   * Function to handle creating a new note
   */
  function handleCreateNote() {
    const newNote = {
      id: new Date().toISOString(),
      title: `New Note`,
      lastModified: new Date(),
      content: '',
      tags: []
    };

    addNote(newNote);
    // Update the notes state immediately after adding the new note
    setNotes(prevNotes => [...prevNotes, newNote]);
    setSelectedNote({ id: newNote.id, title: newNote.title, lastModified: newNote.lastModified, content: newNote.content, tags: newNote.tags });
  }

  /**
   * Function to handle deleting a note
   * @param id - of the note to delete
   */
  function handleDeleteNote(id: string) {
    deleteNote(id);
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      // Deselect the note if it was deleted
      setSelectedNote(null);
    }
  }

  // Function to toggle sidebar visibility
  function toggleSidebar() {
    setIsSidebarVisible(prev => !prev);
  }

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden flex">
      <div className={`h-screen transition-all duration-300 ${isSidebarVisible ? 'w-[320px]' : 'w-0 overflow-hidden'}`}>
        <Sidebar
          // Force re-render when the number of notes changes
          key={notes.length}
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
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
            initialTags={selectedNote.tags}
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
