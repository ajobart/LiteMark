import React, { useState } from 'react';
import Sidebar from '../../molecule/sidebar/sidebar';
import MarkdownEditor from '../../molecule/markdown-editor/markdown-editor';

const Home: React.FC = () => {
    // State to get the notes list
    const [notes, setNotes] = useState<{ id: string, title: string }[]>([
        { id: '1', title: 'Note 1' },
        { id: '2', title: 'Note 2' },
      ]);

  // State to store the content of actual note
  const [noteContent, setNoteContent] = useState<string>('## Ma première note\n\nEcrivez ici...');
  
  // Function to save the content
  const handleSaveContent = (content: string) => {
    setNoteContent(content);
    console.log('Contenu sauvegardé:', content);
    // TODO : Save on localstorage
  };

  /**
   * Function to select a note
   * @param id - of the selected note
   */
  const handleSelectNote = (id: string) => {
    console.log(`Note sélectionnée : ${id}`);
  };

  return (
    <div className="w-full h-screen flex">
      <Sidebar notes={notes} onSelectNote={handleSelectNote} />
      <div className="flex-1 bg-background-page h-screen">
        <h1 className="text-center text-2xl my-4">Bienvenue sur LiteMark !</h1>
        <MarkdownEditor initialContent={noteContent} onSave={handleSaveContent} />
      </div>
    </div>
  );
};

export default Home;
