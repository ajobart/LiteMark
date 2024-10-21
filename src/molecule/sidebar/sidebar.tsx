import React from 'react';

interface SidebarProps {
  notes: { id: string, title: string }[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote }) => {
  return (
    <div className="w-1/6 bg-background-sidebar p-4 flex flex-col">
      <button
        onClick={onCreateNote}
        className="bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
      >
        Create Note
      </button>
      {notes.map((note) => (
        <div
          key={note.id}
          className={`cursor-pointer p-2 rounded ${
            note.id === selectedNoteId ? 'bg-background-selected' : 'hover:bg-background-selected'
          }`}
          onClick={() => onSelectNote(note.id)}
        >
          {note.title}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
