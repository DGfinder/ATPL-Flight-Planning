import React from 'react';
import { Card, useDesignSystem } from '../../design-system';

interface LegendPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const LegendPopover: React.FC<LegendPopoverProps> = ({ isOpen, onClose, children }) => {
  const { colors, spacing, styles } = useDesignSystem();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <Card style={{
        padding: spacing.scale[4],
        fontSize: '0.875rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.scale[3] }}>
          <h3 style={{ 
            ...styles.heading, 
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.aviation.primary
          }}>
            Legend
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: colors.gray[500],
              padding: spacing.scale[1]
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ color: colors.aviation.navy }}>
          {children}
        </div>
      </Card>
    </div>
  );
};

export default LegendPopover;


