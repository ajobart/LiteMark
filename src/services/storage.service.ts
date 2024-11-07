import { Note } from "../types/note.type";
import { db } from '../services/firebase.service';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


// Storage key for notes
const STORAGE_KEY = 'notes';

// Storage key for deleted notes
const DELETED_STORAGE_KEY = 'deletedNotes';

// Default note
const defaultNote: Note = {
  id: 'default-note',
  title: 'Bienvenue dans LiteMark',
  tags: ['#tutorial'],
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
  tags: ['#tutorial'],
  lastModified: new Date(),
  content: `
Create sophisticated formatting for your notes on LiteMark with simple syntax.

This is intended as a quick reference and showcase.
For more complete info, see [John Gruber's original spec](https://daringfireball.net/projects/markdown/) and the [Github-flavored Markdown spec page](https://github.github.com/gfm/).

## Headings

To create a heading, add one to six \`#\` symbols before your heading text. The number of \`#\` you use will determine the hierarchy level and typeface size of the heading.

\`\`\`markdown
# A first-level heading

## A second-level heading

### A third-level heading
\`\`\`

It yields:

# A first-level heading

## A second-level heading

### A third-level heading

## Styling text

You can indicate emphasis with bold, italic, strikethrough, subscript, or superscript text in comment fields and \`.md\` files.

| Style                  | Syntax              | Example                                  | Output                                 |
| ---------------------- | ------------------- | ---------------------------------------- | -------------------------------------- |
| Bold                   | \`** **\` or \`__ __\`  |  \`**This is bold text**\`                  | **This is bold text**                  |
| Italic                 | \`* *\` or \`_ _\`      | \`_This text is italicized_\`              | _This text is italicized_              |
| Strikethrough          | \`~~ ~~\`             | \`~~This was mistaken text~~\`             | ~~This was mistaken text~~             |
| Bold and nested italic | \`** **\` and \`_ _\`   | \`**This text is _extremely_ important**\` | **This text is _extremely_ important** |
| All bold and italic    | \`*** ***\`           |  \`***All this text is important***\`       | **_All this text is important_**       |
| Subscript              | \`<sub> </sub>\`      |  \`This is a <sub>subscript</sub> text\`    | This is a <sub>subscript</sub> text    |
| Superscript            | \`<sup> </sup>\`      |  \`This is a <sup>superscript</sup> text\`  | This is a <sup>superscript</sup> text  |

## Quoting text

You can quote text with a \`>\`.

\`\`\`markdown
Text that is not a quote

> Text that is a quote
\`\`\`

Quoted text is indented, with a different type color.

Text that is not a quote

> Text that is a quote

## Quoting code

You can call out code or a command within a sentence with single backticks. The text within the backticks will not be formatted.

\`\`\`markdown
Use \`git status\` to list all new or modified files that haven't yet been committed.
\`\`\`

Use \`git status\` to list all new or modified files that haven't yet been committed.

To format code or text into its own distinct block, use triple backticks.

\`\`\`\`
Some basic Git commands are:
\`\`\`
git status
git add
git commit
\`\`\`
\`\`\`\`

Some basic Git commands are:

\`\`\`
git status
git add
git commit
\`\`\`

## Syntax highlighting

You can add an optional language identifier to enable syntax highlighting in your fenced code block.

Syntax highlighting changes the color and style of source code to make it easier to read.

For example, to syntax highlight Ruby code:

\`\`\`\`
\`\`\`ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
\`\`\`
\`\`\`\`

This will display the code block with syntax highlighting:

\`\`\`ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
\`\`\`

## Links

You can create an inline link by wrapping link text in brackets \`[ ]\`, and then wrapping the URL in parentheses \`( )\`.

\`\`\`
This note was written using [LiteMark](https://ajobart.github.io/LiteMark/).
\`\`\`

This note was written using [LiteMark](https://ajobart.github.io/LiteMark/).

## Images

You can display an image by adding \`!\` and wrapping the alt text in \`[ ]\`. Alt text is a short text equivalent of the information in the image. Then, wrap the link for the image in parentheses \`()\`.

\`\`\`
![Landscape](https://images.unsplash.com/photo-1527489377706-5bf97e608852?q=80&w=3059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
\`\`\`

![Landscape](https://images.unsplash.com/photo-1527489377706-5bf97e608852?q=80&w=3059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## Lists

You can make an unordered list by preceding one or more lines of text with \`-\`, \`*\`, or \`+\`.

\`\`\`markdown
- George Washington

* John Adams

- Thomas Jefferson
\`\`\`

- George Washington

* John Adams

- Thomas Jefferson

To order your list, precede each line with a number.

\`\`\`markdown
1. James Madison
1. James Monroe
1. John Quincy Adams
\`\`\`

1. James Madison
1. James Monroe
1. John Quincy Adams

### Nested Lists

You can create a nested list by indenting one or more list items below another item.

To create a nested list using the web editor on GitHub or a text editor that uses a monospaced font, you can align your list visually.
Type space characters in front of your nested list item until the list marker character (\`-\` or \`*\`) lies directly below the first character of the text in the item above it.

\`\`\`markdown
1. First list item
   - First nested list item
     - Second nested list item
\`\`\`

1. First list item
   - First nested list item
     - Second nested list item

For more examples, see the [GitHub Flavored Markdown Spec](https://github.github.com/gfm/#example-265).

## Task lists

To create a task list, preface list items with a hyphen and space followed by \`[ ]\`. To mark a task as complete, use \`[x]\`.

\`\`\`markdown
- [ ] Checkbox
- [x] Task
\`\`\`

- [ ] Checkbox
- [x] Task

## Using emoji

You can add emoji to your writing by typing \`:EMOJICODE:\`, a colon followed by the name of the emoji.

\`\`\`markdown
:white_check_mark: I've finished working on this feature. It's ready to merge! :tada:
\`\`\`

:white_check_mark: I've finished working on this feature. It's ready to merge! :tada:

For a full list of available emoji and codes, see [the Emoji-Cheat-Sheet](https://github.com/wooorm/gemoji/blob/main/support.md).

## Paragraphs

You can create a new paragraph by leaving a blank line between lines of text.

## Line Breaks

To create a line break or new line (\`<br>\`), end a line with two, more spaces or a backslash (\`\\\`), and then type return.

\`\`\`markdown
This is the first line.  
And this is the second line.\\
This is the third line.
\`\`\`

This is the first line.  
And this is the second line.\\
This is the third line.

## Ignoring Markdown formatting

You can tell to ignore (or escape) Markdown formatting by using \`\\\` before the Markdown character.

\`Let's rename \\*our-new-project\\* to \\*our-old-project\\*.\`

Let's rename \\*our-new-project\\* to \\*our-old-project\\*.

## Tables

GFM enables the \`table\` extension, where an additional leaf block type is available.

\`\`\`gfm
Colons can be used to align columns.

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | \`renders\` | **nicely** |
| 1        | 2         | 3          |
\`\`\`

Here are the rendered tables:

Colons can be used to align columns.

| Tables        |      Are      |  Cool |
| ------------- | :-----------: | ----: |
| col 3 is      | right-aligned | $1600 |
| col 2 is      |   centered    |   $12 |
| zebra stripes |   are neat    |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

| Markdown | Less      | Pretty     |
| -------- | --------- | ---------- |
| _Still_  | \`renders\` | **nicely** |
| 1        | 2         | 3          |
`,
};

/**
 * Function to get deleted notes from localStorage
 * @returns deletedNotes list
 */
export function getDeletedNotes(): Note[] {
  const deletedNotes = localStorage.getItem(DELETED_STORAGE_KEY);
  return deletedNotes ? JSON.parse(deletedNotes) : [];
}

/**
 * Function to save deleted notes in local storage
 * @param notes - to save
 */
export function saveDeletedNotes(notes: Note[]): void {
  localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(notes));
}

/**
 * Function to move a note to the recycle bin
 * @param note - to move
 */
export function moveToRecycleBin(note: Note): void {
  const deletedNotes = getDeletedNotes();
  deletedNotes.push(note);
  saveDeletedNotes(deletedNotes);

  // Remove the note from the normal notes list
  const notes = getNotes();
  const updatedNotes = notes.filter(n => n.id !== note.id);
  saveNotes(updatedNotes);
}

/**
 * Function to create a default note
 */
export function initializeNotes(): void {
  const notes = getNotes();
  const deletedNotes = getDeletedNotes();

  // Only add default notes if there are no normal notes and no deleted notes
  if (notes.length === 0 && deletedNotes.length === 0) {
    addNote(defaultLongNote);
    addNote(defaultNote);
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
export async function addNote(note: Note): Promise<void> {
  const notes = getNotes();
  notes.push(note);
  saveNotes(notes);

  const counterDocRef = doc(db, 'counters', 'notesCounter');
  const counterDoc = await getDoc(counterDocRef);

  if (counterDoc.exists()) {
    // Increment counter
    await updateDoc(counterDocRef, {
      count: counterDoc.data().count + 1
    });
  }
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

/**
 * Function to permanently delete a note
 * @param id - of the note to delete
 */
export function permanentlyDeleteNote(id: string): void {
  const deletedNotes = getDeletedNotes();
  const updatedDeletedNotes = deletedNotes.filter(note => note.id !== id);
  saveDeletedNotes(updatedDeletedNotes);
}

/**
* Function for permanently deleting all notes in the trash
*/
export function clearAllDeletedNotes(): void {
  saveDeletedNotes([]);
}

