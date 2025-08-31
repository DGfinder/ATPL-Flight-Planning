import React, { useMemo, useState } from 'react';
import NotesHub from './NotesHub';

// Import PDF assets. Vite will transform these into served URLs
// Paths go up to project root where the PDFs currently reside
// If you later move PDFs into `public/notes`, you can switch to string paths like "/notes/your.pdf"
// and remove these imports.
// Note: keep these imports in sync with your actual filenames
import noteA from '../../../Scan18-03-2025-120048.pdf';
import noteB from '../../../Scan18-03-2025-115625.pdf';
import noteC from '../../../Scan18-03-2025-115943.pdf';

interface CourseNoteItem {
  id: string;
  title: string;
  url: string;
}

const CourseNotes: React.FC = () => {
  const notes = useMemo<CourseNoteItem[]>(() => [
    { id: 'scan-120048', title: 'Course Notes (Scan 12:00:48)', url: noteA },
    { id: 'scan-115625', title: 'Course Notes (Scan 11:56:25)', url: noteB },
    { id: 'scan-115943', title: 'Course Notes (Scan 11:59:43)', url: noteC },
  ], []);

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id ?? '');
  const active = notes.find(n => n.id === activeNoteId) ?? notes[0];

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <aside className="lg:col-span-1">
        <div className="aviation-card p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Course Notes</h3>
          <ul className="space-y-2">
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                    n.id === activeNoteId
                      ? 'bg-aviation-light text-aviation-primary font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveNoteId(n.id)}
                >
                  {n.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-gray-600">
            Having trouble viewing?{' '}
            <a className="text-aviation-primary hover:underline" href={active.url} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>
        </div>
      </aside>

      <section className="lg:col-span-3 space-y-4">
        <NotesHub />
        <div className="aviation-card p-2">
          <div className="text-sm font-semibold text-gray-700 mb-2">Original PDFs</div>
          <div className="text-xs text-gray-600 mb-2">View the original scans below for reference.</div>
        </div>
        <div className="aviation-card p-2 h-[70vh]">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="font-medium text-gray-800 text-sm truncate">
              {active.title}
            </div>
            <a className="aviation-button-secondary text-xs" href={active.url} download>
              Download PDF
            </a>
          </div>
          <div className="h-[calc(70vh-44px)]">
            <iframe
              title={active.title}
              src={active.url}
              className="w-full h-full rounded"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseNotes;


