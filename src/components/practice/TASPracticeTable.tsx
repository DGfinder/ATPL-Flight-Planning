import React, { useState } from 'react';
import { SecondaryButton, useDesignSystem } from '../../design-system';

const TASPracticeTable: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [data, setData] = useState([
    { id: 1, altitude: 10000, ias: 250, tas: '', wind: 20, heading: 90, groundSpeed: '' },
    { id: 2, altitude: 15000, ias: 280, tas: '', wind: 25, heading: 180, groundSpeed: '' },
    { id: 3, altitude: 20000, ias: 300, tas: '', wind: 30, heading: 270, groundSpeed: '' },
  ]);

  const calculateTAS = (altitude: number, ias: number) => {
    // Simple TAS calculation (simplified)
    const pressureRatio = Math.pow((1 - altitude / 44330), 5.256);
    return Math.round(ias / Math.sqrt(pressureRatio));
  };

  const calculateGroundSpeed = (tas: number, wind: number, heading: number) => {
    // Simplified ground speed calculation
    return Math.round(tas + (wind * Math.cos((heading * Math.PI) / 180)));
  };

  const handleCalculate = () => {
    setData(prevData => 
      prevData.map(row => ({
        ...row,
        tas: calculateTAS(row.altitude, row.ias),
        groundSpeed: calculateGroundSpeed(calculateTAS(row.altitude, row.ias), row.wind, row.heading)
      }))
    );
  };

  const handleReset = () => {
    setData([
      { id: 1, altitude: 10000, ias: 250, tas: '', wind: 20, heading: 90, groundSpeed: '' },
      { id: 2, altitude: 15000, ias: 280, tas: '', wind: 25, heading: 180, groundSpeed: '' },
      { id: 3, altitude: 20000, ias: 300, tas: '', wind: 30, heading: 270, groundSpeed: '' },
    ]);
  };

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <h3 style={{ ...styles.heading, fontSize: '1.25rem', marginBottom: spacing.scale[4] }}>
        TAS Practice Table
      </h3>
      
      <div style={{ marginBottom: spacing.scale[4] }}>
        <SecondaryButton
          onClick={handleCalculate}
          style={{ marginRight: spacing.scale[2] }}
        >
          Calculate
        </SecondaryButton>
        <SecondaryButton
          onClick={handleReset}
          style={{ fontSize: '0.875rem' }}
        >
          Reset
        </SecondaryButton>
      </div>

      <div style={{
        overflow: 'auto',
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: spacing.radius.lg
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.gray[50] }}>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                Altitude (ft)
              </th>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                IAS (kts)
              </th>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                TAS (kts)
              </th>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                Wind (kts)
              </th>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                Heading (°)
              </th>
              <th style={{ padding: spacing.scale[3], textAlign: 'left', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.875rem', fontWeight: 600 }}>
                Ground Speed (kts)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem' }}>{row.altitude.toLocaleString()}</td>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem' }}>{row.ias}</td>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem', fontWeight: 600, color: colors.aviation.primary }}>
                  {row.tas || '-'}
                </td>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem' }}>{row.wind}</td>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem' }}>{row.heading}°</td>
                <td style={{ padding: spacing.scale[3], fontSize: '0.875rem', fontWeight: 600, color: colors.aviation.secondary }}>
                  {row.groundSpeed || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TASPracticeTable;