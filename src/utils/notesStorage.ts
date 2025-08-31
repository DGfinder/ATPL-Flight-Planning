import type { NotesData, NoteSection } from '../types';

const STORAGE_KEY = 'atpl_notes_data_v1';

export const notesStorage = {
  load(): NotesData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { sections: [] };
      const parsed = JSON.parse(raw) as NotesData;
      if (!parsed.sections) return { sections: [] };
      return parsed;
    } catch {
      return { sections: [] };
    }
  },

  save(data: NotesData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  addSection(section: NoteSection) {
    const current = notesStorage.load();
    const updated: NotesData = { sections: [section, ...current.sections] };
    notesStorage.save(updated);
  },

  replaceSections(sections: NoteSection[]) {
    notesStorage.save({ sections });
  }
};


