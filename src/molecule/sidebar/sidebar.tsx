import React, { useState } from 'react';
import Image from '../../atoms/image/image';
import { Note } from '../../types/note.type';
import { timeAgo } from '../../services/helper.service';
import { clearAllDeletedNotes } from '../../services/storage.service';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  deletedNotes: Note[];
  onClearAllDeletedNotes: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, selectedNoteId, onSelectNote, onCreateNote, deletedNotes, onClearAllDeletedNotes }) => {
  // State for the value to search
  const [searchQuery, setSearchQuery] = useState('');

  // State to toggle between tabs
  const [activeTab, setActiveTab] = React.useState<'notes' | 'tags' | 'trash'>('notes');

  // State to manage expanded tags
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  // Filter notes based on the search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  /**
   * Function to extract unique tags and their counts
   * @returns the notes counts of tags
   */
  function getTagsWithCounts() {
    const tagCounts: { [key: string]: number } = {};
    notes.forEach(note => {
      note.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts);
  }

  /**
   * Function to expand a tag
   * @param tag - to expand
   */
  function toggleTag(tag: string) {
    setExpandedTag(expandedTag === tag ? null : tag);
  }

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

  /**
   * Function to clear all deleted notes
   */
  function handleClearAllDeletedNotes() {
    clearAllDeletedNotes();
    onClearAllDeletedNotes();
  }

  return (
    <div className="w-full h-full overflow-scroll bg-background-sidebar p-4 flex flex-col">
      <div className='flex items-center justify-center w-full'>
        <Image path='/images/litemark-test.png' className='size-16'></Image>
        <h1 className="text-center text-2xl my-4">LiteMark</h1>
      </div>
      {/* ACTIONS BUTTONS */}
      <div className='relative flex items-center justify-center w-full'>
        <div className='absolute right-0'>
          <button
            onClick={onCreateNote}
            className="bg-background-border hover:bg-background-selected transition ease-in-out duration-250 text-white p-2 w-fit rounded mb-4"
          >
            <Image className='size-4' path='/icons/create-icon.svg'></Image>
          </button>
        </div>
        <div className='flex flex-row items-center justify-center w-full my-4'>
          <button
            onClick={() => setActiveTab('notes')}
            className={`hover:bg-background-border flex items-center justify-center transition ease-in-out duration-250 text-white p-2 w-[70px] ${activeTab === 'notes' ? 'border-b-2 border-bg-background-selected' : 'border-b-2 border-transparent'}`}
          >
            <Image path='/icons/note.svg' className='size-5'></Image>
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`hover:bg-background-border flex items-center justify-center transition ease-in-out duration-250 text-white p-2 w-[70px] ${activeTab === 'tags' ? 'border-b-2 border-bg-background-selected' : 'border-b-2 border-transparent'}`}
          >
            <Image path='/icons/tag.svg' className='size-5'></Image>
          </button>
          <button onClick={() => setActiveTab('trash')}
            className={`hover:bg-background-border flex items-center justify-center transition ease-in-out duration-250 text-white p-2 w-[70px] ${activeTab === 'trash' ? 'border-b-2 border-bg-background-selected' : 'border-b-2 border-transparent'}`}
          >
            <Image path='/icons/trash-gray.svg' className='size-5'></Image>
          </button>
        </div>
      </div>
      {/* SEARCH */}
      <div className='mt-2 mb-4 w-full bg-background-search p-2 box-border rounded-md border-2 border-background-border h-10 flex items-center justify-start gap-2'>
        <Image path='/icons/search.svg' className='size-4'></Image>
        <input
          placeholder='Search title or in content note, tags..'
          className='h-full w-full bg-transparent text-sm outline-none border-none'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* TAGS TAB */}
      {activeTab === 'tags' && (
        <div>
          <div className='flex flex-row items-center justify-start gap-1'>
            <h2 className="text-lg font-bold py-2 pl-2">Tags</h2>
            <p className='text-md font-medium'>{`(${getTagsWithCounts().length})`}</p>
          </div>
          {getTagsWithCounts().length === 0 ? (
            <p className="text-center mt-4">No tags created.</p>
          ) : (
            <ul className='flex flex-col gap-2'>
              {getTagsWithCounts().filter(([tag]) =>
                // Check if the tag matches the search query
                tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // Check if any note associated with the tag matches the search query in title or content
                notes.some(note => note.tags?.includes(tag) &&
                  (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              ).map(([tag, count]) => (
                <li key={tag} className="cursor-pointer">
                  <div onClick={() => toggleTag(tag)} className="flex justify-between items-center p-2 rounded hover:bg-background-selected text-[#9CA3AF]">
                    <span>{tag} ({count})</span>
                    <span>{expandedTag === tag ? '-' : '+'}</span>
                  </div>
                  {expandedTag === tag && (
                    <ul className="flex flex-col gap-2">
                      {notes.filter(note =>
                        // Check if the note belongs to the current tag
                        note.tags?.includes(tag) &&
                        // Check if the note title matches the search query
                        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          // Check if the note content matches the search query
                          note.content.toLowerCase().includes(searchQuery.toLowerCase()))
                      ).map(note => (
                        // TAG NOTES LIST
                        <li key={note.id} className={`cursor-pointer w-full h-[95px] min-h-[80px] gap-2 flex flex-row items-center justify-between p-2 rounded ${note.id === selectedNoteId ? 'bg-background-selected/60' : 'hover:bg-background-selected'
                          }`} onClick={() => onSelectNote(note.id)}>
                          <div className='h-full flex items-start justify-start flex-col overflow-x-hidden'>
                            <p className='text-md'>{note.title}</p>
                            <div className='w-full flex gap-1'>
                              <p className="text-xs w-fit min-w-fit text-white/40">
                                {timeAgo(new Date(note.lastModified))}
                              </p>
                              {note.tags && note.tags.length > 0 && (
                                <ul className="flex flex-row w-auto gap-1 items-start overflow-hidden">
                                  {note.tags.map((tag, index) => (
                                    <li key={index} className="inline-flex items-center justify-center rounded-md bg-gray-400/10 hover:bg-gray-400/20 transition ease-in-out duration-300 py-0.5 px-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                                      {tag}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <p className="text-sm text-white/60">
                              {getPreview(note.content, 60)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* NOTES TAB */}
      {activeTab === 'notes' && (
        /** NOTES TAB **/
        <div>
          <div className='flex flex-row items-center justify-start gap-1'>
            <h2 className="text-lg font-bold py-2 pl-2">Notes</h2>
            <p className='text-md font-medium'>{`(${sortedNotes.length})`}</p>
          </div>
          {sortedNotes.length === 0 ? (
            <p className="text-center mt-4">No notes created.</p>
          ) : (
            <ul className='flex flex-col gap-2'>
              {sortedNotes.map((note) => (
                <li
                  key={note.id}
                  className={`cursor-pointer w-full h-[95px] min-h-[80px] gap-2 flex flex-row items-center justify-between p-2 rounded ${note.id === selectedNoteId ? 'bg-background-selected/60' : 'hover:bg-background-selected'
                    }`}
                  onClick={() => onSelectNote(note.id)}
                >
                  {/* Note */}
                  <div className='h-full flex items-start justify-start flex-col overflow-x-hidden'>
                    <p className='text-md'>{note.title}</p>
                    <div className='w-full flex gap-1'>
                      <p className="text-xs w-fit min-w-fit text-white/40">
                        {timeAgo(new Date(note.lastModified))}
                      </p>
                      {/* Tags list */}
                      {note.tags && note.tags.length > 0 && (
                        <ul className="flex flex-row w-auto gap-1 items-start overflow-hidden">
                          {note.tags.map((tag, index) => (
                            <li key={index} className="inline-flex items-center justify-center rounded-md bg-gray-400/10 hover:bg-gray-400/20 transition ease-in-out duration-300 py-0.5 px-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <p className="text-sm text-white/60">
                      {getPreview(note.content, 60)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* TRASH TABS */}
      {activeTab === 'trash' && (
        <div>
          {/* Header */}
          <div className='flex flex-row items-center justify-between'>
            <div className='flex items-center gap-1'>
              <h2 className="text-lg font-bold py-2 pl-2">Trash</h2>
              <p className='text-md font-medium'>{`(${deletedNotes.length})`}</p>
            </div>
            <button
              onClick={handleClearAllDeletedNotes}
              className="bg-background-border hover:bg-red-400/10 hover:text-red-400 hover:ring-1 hover:ring-inset hover:ring-red-400/20 transition ease-in-out duration-250 text-white text-sm p-1 rounded"
            >
              Clear All
            </button>
          </div>
          {deletedNotes.length === 0 ? (
            <p className="text-center mt-4">No deleted notes.</p>
          ) : (
            <ul className='flex flex-col gap-2'>
              {deletedNotes.map((note) => (
                <li
                  key={note.id}
                  className={`cursor-pointer w-full h-[95px] min-h-[80px] gap-2 flex flex-row items-center justify-between p-2 rounded ${note.id === selectedNoteId ? 'bg-background-selected/60' : 'hover:bg-background-selected'
                    }`}
                  onClick={() => onSelectNote(note.id)}
                >
                  {/* Note */}
                  <div className='h-full flex items-start justify-start flex-col overflow-x-hidden'>
                    <p className='text-md'>{note.title}</p>
                    <div className='w-full flex gap-1'>
                      <p className="text-xs w-fit min-w-fit text-white/40">
                        {timeAgo(new Date(note.lastModified))}
                      </p>
                      {/* Tags list */}
                      {note.tags && note.tags.length > 0 && (
                        <ul className="flex flex-row w-auto gap-1 items-start overflow-hidden">
                          {note.tags.map((tag, index) => (
                            <li key={index} className="inline-flex items-center justify-center rounded-md bg-gray-400/10 hover:bg-gray-400/20 transition ease-in-out duration-300 py-0.5 px-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <p className="text-sm text-white/60">
                      {getPreview(note.content, 60)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
