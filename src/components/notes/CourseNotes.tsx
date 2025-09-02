import React from 'react';
import NotesHub from './NotesHub';
import { useDesignSystem } from '../../design-system';

const CourseNotes: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div style={{ padding: spacing.scale[4] }}>
      {/* Main header */}
      <div style={{ marginBottom: spacing.scale[6] }}>
        <h1 style={{ 
          ...styles.heading, 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: colors.aviation.navy,
          marginBottom: spacing.scale[2]
        }}>
          Course Notes
        </h1>
        <p style={{ 
          fontSize: '1rem', 
          color: colors.aviation.muted,
          lineHeight: '1.5'
        }}>
          Access comprehensive aviation training materials organized by topic
        </p>
      </div>

      {/* Topics grid */}
      <NotesHub />
    </div>
  );
};

export default CourseNotes;


