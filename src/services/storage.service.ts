import { Note } from "../types/note.type";  

  // Storage key for notes
  const STORAGE_KEY = 'notes';

  // Default note
  const defaultNote: Note = {
    id: 'default-note',
    title: 'Bienvenue dans LiteMark',
    content: `
        # Bienvenue dans LiteMark!
        
        Ce document est votre première note. Vous pouvez commencer à écrire en Markdown ici.
        
        ## Exemples :
        - **Gras** : \`**texte**\`
        - *Italique* : \`*texte*\`
        - [Lien](https://www.example.com)
        - ~~Texte barré~~ : \`~~texte~~\`
        - Liste de tâches :
            - [ ] À faire
            - [x] Fait
        
        Amusez-vous bien ! 🎉
        `,
  };

  // Create default note 
  export const initializeNotes = (): void => {
    const notes = getNotes();
    if (notes.length === 0) {
      addNote(defaultNote);
    }
  };
  
  // Function to get notes from localStorage
  export const getNotes = (): Note[] => {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  };
  
  // Function to save notes in local storage
  export const saveNotes = (notes: Note[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  };
  
  // Function to create a note
  export const addNote = (note: Note): void => {
    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);
  };
  
  // Function to update a note
  export const updateNote = (id: string, { title, content }: { title: string; content: string }): void => {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
  
    if (noteIndex !== -1) {
      // Update the title and content of the selected note
      notes[noteIndex].title = title;
      notes[noteIndex].content = content;
      saveNotes(notes);
    }
  };  
  
  // Function to delete note
  export const deleteNote = (id: string): void => {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };
  