import React from 'react';
import { useDesignSystem } from '../../design-system';

interface RichContentViewerProps {
  content: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const RichContentViewer: React.FC<RichContentViewerProps> = ({ 
  content, 
  title, 
  subtitle, 
  icon 
}) => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div>
      {/* Header */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${colors.aviation.primary} 0%, ${colors.aviation.navy} 50%, ${colors.aviation.secondary} 100%)`,
        borderRadius: spacing.radius['2xl'],
        padding: spacing.scale[8],
        marginBottom: spacing.scale[8],
        color: colors.white,
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[3] }}>
          {icon && (
            <div style={{
              width: '2rem',
              height: '2rem',
              background: colors.aviation.primary,
              color: colors.white,
              borderRadius: spacing.radius.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </div>
          )}
          <div>
            {title && (
              <h1 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[2] }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: colors.white,
        padding: spacing.scale[6],
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.gray[200]}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          ...styles.body,
          lineHeight: '1.7',
          color: colors.aviation.navy
        }}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default RichContentViewer;