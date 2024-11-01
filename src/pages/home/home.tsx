import React, { useState, useEffect } from 'react';
import Sidebar from '../../molecule/sidebar/sidebar';
import MarkdownEditor from '../../molecule/markdown-editor/markdown-editor';
import { getNotes, addNote, initializeNotes, updateNote, getDeletedNotes, clearAllDeletedNotes, moveToRecycleBin, permanentlyDeleteNote, saveDeletedNotes, saveNotes } from '../../services/storage.service';
import { Note } from '../../types/note.type';
import Image from '../../atoms/image/image';

const Home: React.FC = () => {

    // To know if is mobile
    const [isMobile, setIsMobile] = useState(false)

  // State for list of notes
  const [notes, setNotes] = useState<Note[]>([]);

  // State for list of deleted notes
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);

  // State to keep selected note
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // State to control sidebar visibility
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  /**
   * Effect to init notes
   */
  useEffect(() => {
    const initialize = async () => {
        await initializeNotes();
        const loadedNotes = getNotes();
        setNotes(loadedNotes.map(note => ({ id: note.id, content: note.content, lastModified: note.lastModified, title: note.title, tags: note.tags })));
        const loadedDeletedNotes = getDeletedNotes();
        setDeletedNotes(loadedDeletedNotes);

        // Select the most recently modified note by default
        if (loadedNotes.length > 0) {
            const mostRecentNote = loadedNotes.reduce((prev, current) => {
                return new Date(prev.lastModified) > new Date(current.lastModified) ? prev : current;
            });
            setSelectedNote({ ...mostRecentNote });
        }
    };

    initialize();
  }, []);

    // Effect to know if is on mobile
  // TODO: Check to make it only on server side like in angular project
  useEffect(() => {
    if (window.innerWidth < 1000) {
      setIsMobile(true);
    }
  }, [window.innerWidth])

   // Function to toggle sidebar visibility
   function toggleSidebar() {
    setIsSidebarVisible(prev => !prev);
  }

  function handleClearAllDeletedNotes() {
    clearAllDeletedNotes();
    setDeletedNotes([]);
    setSelectedNote(null);
  }

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
    // Check if the note is in the normal notes or deleted notes
    const selected = [...notes, ...deletedNotes].find(note => note.id === id);
    if (selected) {
        setSelectedNote({ 
            id: selected.id, 
            title: selected.title, 
            lastModified: selected.lastModified, 
            content: selected.content, 
            tags: selected.tags 
        });
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

  // Function to handle deleting a note
  function handleDeleteNote(id: string) {
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      moveToRecycleBin(noteToDelete);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setDeletedNotes(prevDeleted => [...prevDeleted, noteToDelete]);
      if (selectedNote?.id === id) {
        setSelectedNote(null);
      }
    }
  }

  function handleRestoreNote(note: Note) {
    // Add the note back to the normal notes list
    setNotes(prevNotes => [...prevNotes, note]);
    
    // Remove the note from the deleted notes list
    setDeletedNotes(prevDeleted => prevDeleted.filter(deletedNote => deletedNote.id !== note.id));
    
    // Update the local storage
    const updatedDeletedNotes = deletedNotes.filter(deletedNote => deletedNote.id !== note.id);
    saveDeletedNotes(updatedDeletedNotes);
    
    // Optionally, you can also save the restored note back to the normal notes storage
    saveNotes([...notes, note]);
    
    // Clear the selected note if it was the restored note
    if (selectedNote?.id === note.id) {
        setSelectedNote(null);
    }
  }

  function handlePermanentlyDelete(id: string) {
    // Check if the note being deleted is the currently selected note
    if (selectedNote?.id === id) {
        // Clear the selected note
        setSelectedNote(null);
    }
    
    permanentlyDeleteNote(id);
    setDeletedNotes(prevDeleted => prevDeleted.filter(note => note.id !== id));
  }

  return (
    <div className="w-full h-screen max-h-screen overflow-hidden flex">
      <div className={`h-screen transition-all duration-300 ${!isMobile ? (isSidebarVisible ? 'w-[320px]' : 'w-0 overflow-hidden') : (isSidebarVisible ? 'w-full' : 'w-0 overflow-hidden')}`}>
        <Sidebar
          // Force re-render when the number of notes changes
          key={notes.length}
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          deletedNotes={deletedNotes}
          onClearAllDeletedNotes={handleClearAllDeletedNotes} 
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
            onRestore={handleRestoreNote}
            onPermanentlyDelete={handlePermanentlyDelete}
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
