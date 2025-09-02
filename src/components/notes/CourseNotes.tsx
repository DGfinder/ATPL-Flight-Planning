import React, { useMemo, useState } from 'react';
import NotesHub from './NotesHub';
import { Card, SecondaryButton, useDesignSystem } from '../../design-system';

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
  const { colors, spacing, styles } = useDesignSystem();
  
  const notes = useMemo<CourseNoteItem[]>(() => [
    { id: 'scan-120048', title: 'Course Notes (Scan 12:00:48)', url: noteA },
    { id: 'scan-115625', title: 'Course Notes (Scan 11:56:25)', url: noteB },
    { id: 'scan-115943', title: 'Course Notes (Scan 11:59:43)', url: noteC },
  ], []);

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id ?? '');
  const active = notes.find(n => n.id === activeNoteId) ?? notes[0];

  if (!active) return null;

  // Removed unused styles - mainContentStyle and sidebarStyle

  const noteButtonStyle = (isActive: boolean): React.CSSProperties => ({
    width: '100%',
    textAlign: 'left',
    padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
    borderRadius: spacing.radius.md,
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    background: isActive ? colors.withOpacity(colors.aviation.primary, 0.1) : 'transparent',
    color: isActive ? colors.aviation.primary : colors.aviation.navy,
    fontWeight: isActive ? 500 : 400,
    border: 'none',
    cursor: 'pointer'
  });

  const noteButtonHoverStyle = (isActive: boolean): React.CSSProperties => ({
    background: isActive ? colors.withOpacity(colors.aviation.primary, 0.15) : colors.gray[100]
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: spacing.scale[4] }}>
      <aside>
        <Card variant="default" padding="md">
          <h3 style={{ ...styles.heading, fontSize: '1rem', marginBottom: spacing.scale[3], color: colors.aviation.navy }}>
            Course Notes
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
            {notes.map((n) => (
              <li key={n.id}>
                <button
                  style={noteButtonStyle(n.id === activeNoteId)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = noteButtonHoverStyle(n.id === activeNoteId).background!;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = noteButtonStyle(n.id === activeNoteId).background!;
                  }}
                  onClick={() => setActiveNoteId(n.id)}
                >
                  {n.title}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: spacing.scale[4], fontSize: '0.75rem', color: colors.aviation.muted }}>
            Having trouble viewing?{' '}
            <a 
              style={{ color: colors.aviation.primary, textDecoration: 'underline', cursor: 'pointer' }} 
              href={active.url} 
              target="_blank" 
              rel="noreferrer"
            >
              Open in new tab
            </a>
          </div>
        </Card>
      </aside>

      <section style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[4] }}>
        <NotesHub />
        <Card variant="default" padding="sm">
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: colors.aviation.navy, marginBottom: spacing.scale[2] }}>
            Original PDFs
          </div>
          <div style={{ fontSize: '0.75rem', color: colors.aviation.muted, marginBottom: spacing.scale[2] }}>
            View the original scans below for reference.
          </div>
        </Card>
        <Card variant="default" padding="none" style={{ height: '70vh' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
            borderBottom: `1px solid ${colors.gray[200]}`
          }}>
            <div style={{ fontWeight: 500, color: colors.aviation.navy, fontSize: '0.875rem' }}>
              {active.title}
            </div>
            <SecondaryButton
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = active.url;
                link.download = active.title + '.pdf';
                link.click();
              }}
            >
              Download PDF
            </SecondaryButton>
          </div>
          <div style={{ height: 'calc(70vh - 44px)' }}>
            <iframe
              title={active.title}
              src={active.url}
              style={{ width: '100%', height: '100%', borderRadius: spacing.radius.md }}
            />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default CourseNotes;


