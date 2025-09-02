import React from 'react';
import { useDesignSystem } from '../design-system';
import CourseNotes from '../components/notes/CourseNotes';

const NotesPage: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.aviation.light
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, ${colors.aviation.primary} 0%, ${colors.blue[600]} 100%)`,
        color: colors.white,
        padding: spacing.scale[6]
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h1 style={{ ...styles.heading, fontSize: '2rem', marginBottom: spacing.scale[2] }}>
            Course Notes
          </h1>
          <p style={{ ...styles.body, fontSize: '1.125rem', opacity: 0.9 }}>
            Access comprehensive study materials and digitize your own notes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{
        background: colors.white,
        padding: spacing.scale[4],
        borderBottom: `1px solid ${colors.gray[200]}`
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search notes, topics, or content..."
              style={{
                width: '100%',
                paddingLeft: spacing.scale[12],
                paddingRight: spacing.scale[4],
                paddingTop: spacing.scale[4],
                paddingBottom: spacing.scale[4],
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: spacing.radius.xl,
                fontSize: '0.875rem',
                outline: 'none',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            />
            <div style={{
              position: 'absolute',
              left: spacing.scale[3],
              top: '50%',
              transform: 'translateY(-50%)',
              color: colors.gray[400]
            }}>
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: spacing.scale[6] }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <CourseNotes />
        </div>
      </div>
    </div>
  );
};

export default NotesPage;