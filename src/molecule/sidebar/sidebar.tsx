import React from 'react';
import Image from '../image/image';
import { Note } from '../../types/note.type';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote }) => {

  // Function to truncate the content preview
  function getPreview(content: string, maxLength: number) {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }

  console.log('notes:', notes);

  return (
    <div className="w-[275px] bg-background-sidebar p-4 flex flex-col">
      <h1 className="text-center text-2xl my-4">LiteMark</h1>
      <div className='flex items-center justify-end'>
        <button
          onClick={onCreateNote}
          className="bg-background-page hover:bg-background-selected transition ease-in-out duration-250 text-white p-2 w-fit rounded mb-4"
        >
          <Image className='size-4' path='/icons/create-icon.svg'></Image>
        </button>
      </div>
      <ul className='flex flex-col gap-2'>
      {notes.map((note) => (
        <li
          key={note.id}
          className={`cursor-pointer flex flex-col p-2 rounded ${note.id === selectedNoteId ? 'bg-background-selected/60' : 'hover:bg-background-selected'
            }`}
          onClick={() => onSelectNote(note.id)}
        >
          <p className='text-md'>{note.title}</p>
          <p className="text-sm text-white/60">
            {getPreview(note.content, 60)}
          </p>
        </li>
      ))}
      </ul>
    </div>
  );
};

export default Sidebar;
