import React from 'react';

interface SidebarProps {
  notes: { id: string, title: string }[];
  onSelectNote: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, onSelectNote }) => {
  return (
    <div className="w-1/6 bg-background-sidebar p-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="cursor-pointer hover:bg-gray-200 p-2"
          onClick={() => onSelectNote(note.id)}
        >
          {note.title}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
