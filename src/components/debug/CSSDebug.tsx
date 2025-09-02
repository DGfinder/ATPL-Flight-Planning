import React from 'react';
import { useDesignSystem } from '../../design-system';

interface CSSDebugProps {
  showDebug?: boolean;
}

const CSSDebug: React.FC<CSSDebugProps> = ({ showDebug = false }) => {
  const { colors, spacing, styles } = useDesignSystem();

  if (!showDebug) return null;

  return (
    <div style={{
      position: 'fixed',
      top: spacing.scale[4],
      left: spacing.scale[4],
      background: colors.white,
      border: `1px solid ${colors.gray[300]}`,
      borderRadius: spacing.radius.lg,
      padding: spacing.scale[4],
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      maxWidth: '20rem'
    }}>
      <h3 style={{ ...styles.heading, fontSize: '1rem', marginBottom: spacing.scale[3] }}>
        CSS Debug Panel
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
          <div style={{
            width: '1rem',
            height: '1rem',
            background: colors.aviation.primary,
            display: 'inline-block',
            marginRight: spacing.scale[2]
          }} />
          <span style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
            Primary Color
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
          <div style={{
            width: '1rem',
            height: '1rem',
            background: colors.aviation.secondary,
            display: 'inline-block',
            marginRight: spacing.scale[2]
          }} />
          <span style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
            Secondary Color
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
          <div style={{
            width: '1rem',
            height: '1rem',
            background: colors.aviation.navy,
            display: 'inline-block',
            marginRight: spacing.scale[2]
          }} />
          <span style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
            Navy Color
          </span>
        </div>
      </div>
      
      <div style={{ marginTop: spacing.scale[3], paddingTop: spacing.scale[3], borderTop: `1px solid ${colors.gray[200]}` }}>
        <p style={{ fontSize: '0.75rem', color: colors.aviation.muted }}>
          Design System Active
        </p>
      </div>
    </div>
  );
};

export default CSSDebug;