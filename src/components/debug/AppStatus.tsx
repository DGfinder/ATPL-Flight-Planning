import React from 'react';
import { useDesignSystem } from '../../design-system';

interface AppStatusProps {
  status: 'loading' | 'ready' | 'error';
  message?: string;
}

const AppStatus: React.FC<AppStatusProps> = ({ status, message }) => {
  const { colors, spacing, styles } = useDesignSystem();

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return colors.aviation.navy;
      case 'ready': return colors.aviation.secondary;
      case 'error': return colors.semantic.error;
      default: return colors.aviation.muted;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading': return 'Loading...';
      case 'ready': return 'Ready';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div style={{
      padding: spacing.scale[4],
      border: `1px solid ${colors.gray[200]}`,
      borderRadius: spacing.radius.lg,
      background: colors.white
    }}>
      <h3 style={{ 
        ...styles.heading, 
        fontSize: '1.125rem', 
        marginBottom: spacing.scale[2],
        color: colors.aviation.navy,
        fontWeight: 700
      }}>
        App Status
      </h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
        <div style={{
          width: '1rem',
          height: '1rem',
          background: getStatusColor(),
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: spacing.scale[2]
        }} />
        <span style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
          {getStatusText()}
        </span>
      </div>
      
      {message && (
        <p style={{ 
          fontSize: '0.875rem', 
          color: colors.aviation.muted, 
          marginTop: spacing.scale[2] 
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AppStatus;