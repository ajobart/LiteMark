import { Note } from "../types/note.type";  

  // Storage key for notes
  const STORAGE_KEY = 'notes';

  // Default note
  const defaultNote: Note = {
    id: 'default-note',
    title: 'Bienvenue dans LiteMark',
    tags: [],
    lastModified: new Date(),
    content: `
Ce document est votre première note. Vous pouvez commencer à écrire en Markdown ici.
Si vous voulez en apprendre plus sur le Mardown, cliquez [ici](https://www.markdownguide.org/getting-started/)

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

  // Default long note
  const defaultLongNote: Note = {
    id: 'default-long-note',
    title: 'Long note',
    tags: [],
    lastModified: new Date(),
    content: `
Lorem ipsum odor amet, consectetuer adipiscing elit. Blandit at adipiscing varius torquent iaculis ipsum quis nunc. Tellus facilisis quisque maximus, ac malesuada vestibulum nascetur tincidunt. Litora volutpat volutpat blandit mollis fames himenaeos parturient nascetur. Convallis montes egestas viverra porttitor rhoncus ligula varius pulvinar class. Feugiat dui ullamcorper senectus est feugiat. Convallis enim facilisi faucibus suspendisse purus nec. Montes litora malesuada viverra enim dictum praesent. Pretium nam natoque, metus molestie integer elementum.

## Second heading
Consequat ut ut proin et donec luctus lacinia. Ridiculus ridiculus egestas dis ante convallis. Aenean leo tempus mus nulla euismod phasellus proin id. Nostra cursus dictum efficitur phasellus sapien. Nostra nisi habitasse arcu platea adipiscing; varius parturient blandit. Lectus platea class aptent diam leo nunc ultrices magna sit. Leo elit elit blandit massa, laoreet orci platea. Aliquam class volutpat egestas mi euismod tortor habitasse aliquam. Sociosqu lacus himenaeos praesent lacus tincidunt! Rhoncus porta platea platea mauris maximus malesuada.

## Third heading
Facilisi nibh dictum sapien facilisis feugiat. Urna varius gravida sollicitudin magna netus rutrum. Aptent et felis scelerisque lacus turpis turpis imperdiet ante consectetur. Imperdiet urna pulvinar tortor euismod cursus sagittis laoreet. Consectetur fames ipsum maximus sodales donec. Faucibus senectus nam consequat odio blandit netus. Neque mattis fringilla bibendum mattis neque; sodales magna sociosqu suspendisse. Nibh tortor urna ultrices; netus convallis at eros magna.

## Fourth heading
Auctor semper vitae; lorem parturient nullam mattis tellus. Enim congue integer nascetur, quam bibendum fusce. Hendrerit aenean maecenas habitasse vivamus auctor amet. Nisl vulputate porta mus aliquam ornare. Montes posuere vel lectus ex massa. Aid dapibus arcu maecenas porttitor condimentum lacinia. Pharetra conubia eros fames varius lectus turpis.

## Fifth heading
Nibh hac gravida aliquet varius; sed porttitor ut. Elementum massa sed nulla dis dolor pretium. Lobortis enim turpis nostra elit eget sapien nisi. Dignissim posuere lectus luctus accumsan netus vulputate. Sem porttitor gravida est placerat parturient. Luctus bibendum mattis sociosqu sagittis sem scelerisque donec praesent potenti. Conubia morbi sed felis aliquet felis habitasse eleifend. Tristique finibus sollicitudin magna eu etiam etiam iaculis. Nunc ridiculus natoque felis ac massa maecenas ut laoreet. Conubia a aptent non vulputate fames sociosqu risus sociosqu.

## Six heading
Consequat ut ut proin et donec luctus lacinia. Ridiculus ridiculus egestas dis ante convallis. Aenean leo tempus mus nulla euismod phasellus proin id. Nostra cursus dictum efficitur phasellus sapien. Nostra nisi habitasse arcu platea adipiscing; varius parturient blandit. Lectus platea class aptent diam leo nunc ultrices magna sit. Leo elit elit blandit massa, laoreet orci platea. Aliquam class volutpat egestas mi euismod tortor habitasse aliquam. Sociosqu lacus himenaeos praesent lacus tincidunt! Rhoncus porta platea platea mauris maximus malesuada.

## Seven heading
Facilisi nibh dictum sapien facilisis feugiat. Urna varius gravida sollicitudin magna netus rutrum. Aptent et felis scelerisque lacus turpis turpis imperdiet ante consectetur. Imperdiet urna pulvinar tortor euismod cursus sagittis laoreet. Consectetur fames ipsum maximus sodales donec. Faucibus senectus nam consequat odio blandit netus. Neque mattis fringilla bibendum mattis neque; sodales magna sociosqu suspendisse. Nibh tortor urna ultrices; netus convallis at eros magna.

## Eight heading
Auctor semper vitae; lorem parturient nullam mattis tellus. Enim congue integer nascetur, quam bibendum fusce. Hendrerit aenean maecenas habitasse vivamus auctor amet. Nisl vulputate porta mus aliquam ornare. Montes posuere vel lectus ex massa. Aid dapibus arcu maecenas porttitor condimentum lacinia. Pharetra conubia eros fames varius lectus turpis.

## Nine heading
Nibh hac gravida aliquet varius; sed porttitor ut. Elementum massa sed nulla dis dolor pretium. Lobortis enim turpis nostra elit eget sapien nisi. Dignissim posuere lectus luctus accumsan netus vulputate. Sem porttitor gravida est placerat parturient. Luctus bibendum mattis sociosqu sagittis sem scelerisque donec praesent potenti. Conubia morbi sed felis aliquet felis habitasse eleifend. Tristique finibus sollicitudin magna eu etiam etiam iaculis. Nunc ridiculus natoque felis ac massa maecenas ut laoreet. Conubia a aptent non vulputate fames sociosqu risus sociosqu.
`,
  }

  /**
   * Function to create a default note
   */
  export function initializeNotes(): void {
    const notes = getNotes();
    if (notes.length === 0) {
      addNote(defaultNote);
      addNote(defaultLongNote);
    }
  }
  
  /**
   * Function to get notes from localStorage
   * @returns - JSON object of all notes
   */
  export function getNotes(): Note[] {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  }
  
  // Function to save notes in local storage
  export function saveNotes(notes: Note[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  /**
   * Function to create a note
   * @param note - The note to create
   */
  export function addNote(note: Note): void {
    const notes = getNotes();
    notes.push(note);
    saveNotes(notes);
  };
  
  /**
   * Function to update a note
   * @param id - note to update
   * @param param1 - title, content, and tags object
   */
  export function updateNote(id: string, { title, content, tags }: { title: string; content: string; tags: string[] }): void {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex !== -1) {
      // Update the title, content, and tags of the selected note
      notes[noteIndex].title = title;
      notes[noteIndex].content = content;
      notes[noteIndex].tags = tags; // Ensure tags are updated
      notes[noteIndex].lastModified = new Date();
      saveNotes(notes);
    }
  };  
  
  /**
   * Function to delete note
   * @param id - of the note to delete
   */
  export function deleteNote(id: string): void {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };
  
