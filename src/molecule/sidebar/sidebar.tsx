import React, { useState } from 'react';
import Image from '../../atoms/image/image';
import { Note } from '../../types/note.type';
import { timeAgo } from '../../services/helper.service';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote }) => {
  // State for the value to search
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notes based on the search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered notes by lastModified date (most recent first)
  const sortedNotes = filteredNotes.sort((a, b) => {
    return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
  });

  // Function to truncate the content preview
  function getPreview(content: string, maxLength: number) {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + '...';
    }
    return content;
  }


  return (
    <div className="w-[320px] h-full overflow-scroll bg-background-sidebar p-4 flex flex-col">
      <div className='flex items-center justify-center w-full'>
        <Image path='/images/litemark-test.png' className='size-16'></Image>
        <h1 className="text-center text-2xl my-4">LiteMark</h1>
      </div>
      {/* Buttons */}
      <div className='flex items-center justify-end'>
        <button
          onClick={onCreateNote}
          className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-2 w-fit rounded mb-4"
        >
          <Image className='size-4' path='/icons/create-icon.svg'></Image>
        </button>
      </div>
      {/* Search */}
      <div className='mt-2 mb-4 w-full bg-background-search p-2 box-border rounded-md border-2 border-background-border h-10 flex items-center justify-start gap-2'>
        <Image path='/icons/search.svg' className='size-4'></Image>
        <input
          placeholder='Search title or in content note..'
          className='h-full w-full bg-transparent text-sm outline-none border-none'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Notes list */}
      <ul className='flex flex-col gap-2'>
        {sortedNotes.map((note) => (
          <li
            key={note.id}
            className={`cursor-pointer w-full h-[95px] min-h-[80px] gap-2 flex flex-row items-center justify-between p-2 rounded ${note.id === selectedNoteId ? 'bg-background-selected/60' : 'hover:bg-background-selected'
              }`}
            onClick={() => onSelectNote(note.id)}
          >
            {/* Note */}
            <div className='h-full flex items-start justify-start flex-col'>
              <p className='text-md'>{note.title}</p>
              <p className="text-xs text-white/40">
                {timeAgo(new Date(note.lastModified))}
              </p>
              <p className="text-sm text-white/60">
                {getPreview(note.content, 60)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
