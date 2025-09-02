import React, { useState } from 'react';
import { Card, PrimaryButton, useDesignSystem } from '../../design-system';

interface PerformanceData {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

const PerformanceDashboard: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const performanceData: PerformanceData[] = [
    { metric: 'Accuracy', value: 85, unit: '%', trend: 'up' },
    { metric: 'Questions Answered', value: 127, unit: '', trend: 'up' },
    { metric: 'Study Time', value: 12.5, unit: 'hrs', trend: 'up' },
    { metric: 'Average Time', value: 2.3, unit: 'min', trend: 'down' },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return colors.aviation.secondary;
      case 'down': return colors.semantic.error;
      default: return colors.aviation.muted;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <Card style={{
      maxWidth: '64rem',
      maxHeight: '24rem',
      overflow: 'auto',
      padding: spacing.scale[6],
      margin: spacing.scale[4],
      transform: 'scale(1)',
      animation: 'scaleIn 0.3s ease-out'
    }}>
      <h2 style={{ 
        ...styles.heading, 
        fontSize: '1.25rem',
        fontWeight: 700,
        color: colors.aviation.primary,
        marginBottom: spacing.scale[6]
      }}>
        Performance Dashboard
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.scale[4] }}>
        {performanceData.map((item) => (
          <Card
            key={item.metric}
            style={{
              padding: spacing.scale[4],
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: selectedMetric === item.metric ? `2px solid ${colors.aviation.primary}` : `1px solid ${colors.gray[200]}`
            }}
            onClick={() => setSelectedMetric(selectedMetric === item.metric ? null : item.metric)}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: colors.aviation.navy, marginBottom: spacing.scale[1] }}>
              {item.value}{item.unit}
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.aviation.muted, marginBottom: spacing.scale[2] }}>
              {item.metric}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: spacing.scale[1],
              color: getTrendColor(item.trend)
            }}>
              <span style={{ fontSize: '1.25rem' }}>{getTrendIcon(item.trend)}</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{item.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {selectedMetric && (
        <div style={{ marginTop: spacing.scale[6], paddingTop: spacing.scale[4], borderTop: `1px solid ${colors.gray[200]}` }}>
          <h3 style={{ ...styles.heading, fontSize: '1.125rem', marginBottom: spacing.scale[3] }}>
            {selectedMetric} Details
          </h3>
          <p style={{ ...styles.body, color: colors.aviation.muted }}>
            Detailed analysis and recommendations for {selectedMetric.toLowerCase()} improvement.
          </p>
          <PrimaryButton style={{ marginTop: spacing.scale[3] }}>
            View Full Report
          </PrimaryButton>
        </div>
      )}
    </Card>
  );
};

export default PerformanceDashboard;