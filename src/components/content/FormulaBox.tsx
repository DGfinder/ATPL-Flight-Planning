import React from 'react';
import { useDesignSystem } from '../../design-system';

interface FormulaBoxProps {
  formula: string;
  description?: string;
  variables?: { name: string; description: string }[];
}

const FormulaBox: React.FC<FormulaBoxProps> = ({ formula, description, variables }) => {
  const { colors, spacing, styles } = useDesignSystem();

  return (
    <div style={{
      background: `linear-gradient(90deg, ${colors.withOpacity(colors.aviation.primary, 0.1)} 0%, ${colors.withOpacity(colors.aviation.light, 0.8)} 50%, ${colors.withOpacity(colors.aviation.accent, 0.9)} 100%)`,
      borderRadius: spacing.radius['2xl'],
      padding: spacing.scale[6],
      border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
      borderBottom: 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[3], marginBottom: spacing.scale[4] }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          background: colors.aviation.primary,
          color: colors.white,
          borderRadius: spacing.radius.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          Σ
        </div>
        <div>
          <h3 style={{ ...styles.heading, fontSize: '1.125rem', marginBottom: spacing.scale[1] }}>
            Formula
          </h3>
          <p style={{ fontSize: '0.875rem', color: colors.withOpacity(colors.aviation.primary, 0.7) }}>
            Mathematical expression
          </p>
        </div>
      </div>

      <div style={{
        background: colors.white,
        padding: spacing.scale[4],
        borderRadius: spacing.radius.lg,
        border: `1px solid ${colors.gray[200]}`,
        marginBottom: spacing.scale[4]
      }}>
        <code style={{
          fontFamily: 'monospace',
          fontSize: '1.125rem',
          color: colors.aviation.navy,
          fontWeight: 600
        }}>
          {formula}
        </code>
      </div>

      {description && (
        <p style={{ ...styles.body, marginBottom: spacing.scale[4] }}>
          {description}
        </p>
      )}

      {variables && variables.length > 0 && (
        <div>
          <h4 style={{ ...styles.heading, fontSize: '1rem', marginBottom: spacing.scale[3] }}>
            Variables
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[2] }}>
            {variables.map((variable, index) => (
              <div key={index} style={{ display: 'flex', gap: spacing.scale[2] }}>
                <code style={{
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  color: colors.aviation.primary,
                  fontWeight: 600,
                  minWidth: '3rem'
                }}>
                  {variable.name}
                </code>
                <span style={{ fontSize: '0.875rem', color: colors.aviation.muted }}>
                  {variable.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaBox;