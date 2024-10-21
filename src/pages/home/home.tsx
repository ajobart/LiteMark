import React, { useState, useEffect } from 'react';
import Sidebar from '../../molecule/sidebar/sidebar';
import MarkdownEditor from '../../molecule/markdown-editor/markdown-editor';
import { getNotes, addNote, initializeNotes, updateNote } from '../../services/storage.service';

const Home: React.FC = () => {

  // State for list of notes
  const [notes, setNotes] = useState<{ id: string, title: string }[]>([]);

  // State to keep selected note
  const [selectedNote, setSelectedNote] = useState<{ id: string, title: string, content: string } | null>(null);

  /**
   * Effect to init notes
   */
  useEffect(() => {
    initializeNotes();
    const loadedNotes = getNotes();
    setNotes(loadedNotes.map(note => ({ id: note.id, title: note.title })));
    
    // Select the first note if any exist
    if (loadedNotes.length > 0) {
      const firstNote = loadedNotes[0];
      setSelectedNote({ id: firstNote.id, title: firstNote.title, content: firstNote.content });
    }
  }, []);

  // Save the note's title and content when changes are made
  const handleSaveContent = (title: string, content: string) => {
    if (selectedNote && (selectedNote.title !== title || selectedNote.content !== content)) { 
      // Only update if there is a change in title or content
      updateNote(selectedNote.id, { title, content });
      setSelectedNote({ ...selectedNote, title, content });
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === selectedNote.id ? { ...note, title } : note))
      );
      console.log('Content saved:', content);
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
          setSelectedNote({ id: selected.id, title: selected.title, content: selected.content });
          console.log(`Note selected: ${id}`);
        }
      }
    }
  };

  // Handle creating a new note
  const handleCreateNote = () => {
    const newNote = {
      id: new Date().toISOString(),
      title: `New Note ${notes.length + 1}`,
      content: '',
    };

    addNote(newNote);
    setNotes([...notes, { id: newNote.id, title: newNote.title }]);
    setSelectedNote({ id: newNote.id, title: newNote.title, content: newNote.content });
  };

  return (
    <div className="w-full h-screen flex">
      <Sidebar
        notes={notes}
        selectedNoteId={selectedNote?.id || null}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
      />
      <div className="flex-1 bg-background-page h-screen">
        <h1 className="text-center text-2xl my-4">Welcome to LiteMark!</h1>
        {selectedNote ? (
          <MarkdownEditor
            key={selectedNote.id} // Add key here to force re-render
            initialTitle={selectedNote.title}
            initialContent={selectedNote.content}
            onSave={handleSaveContent}
          />
        ) : (
          <p className="text-center">No note selected</p>
        )}
      </div>
    </div>
  );
};

export default Home;
