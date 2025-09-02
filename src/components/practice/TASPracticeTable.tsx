import React, { useState } from 'react';
import { SecondaryButton, useDesignSystem } from '../../design-system';

interface PracticeRow {
  id: number;
  tas: number;
  fpt: number;
  windVelocity: string;
  crosswind: number;
  driftAngle: string;
  headTailwind: number;
  etas: number;
  groundSpeed: number;
  wc: number;
}

const TASPracticeTable: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [showAnswers, setShowAnswers] = useState(false);
  
  const practiceData: PracticeRow[] = [
    { id: 1, tas: 410, fpt: 210, windVelocity: '150/100', crosswind: 84, driftAngle: '12°', headTailwind: -58, etas: 402, groundSpeed: 352, wc: -58 },
    { id: 2, tas: 420, fpt: 65, windVelocity: '300/70', crosswind: 58, driftAngle: '8°', headTailwind: 40, etas: 418, groundSpeed: 458, wc: 38 },
    { id: 3, tas: 450, fpt: 355, windVelocity: '080/100', crosswind: 99, driftAngle: '13°', headTailwind: -10, etas: 440, groundSpeed: 430, wc: -20 },
    { id: 4, tas: 450, fpt: 255, windVelocity: '240/60', crosswind: 16, driftAngle: '2°', headTailwind: -58, etas: 450, groundSpeed: 392, wc: -58 },
    { id: 5, tas: 350, fpt: 205, windVelocity: '245/80', crosswind: 52, driftAngle: '8°', headTailwind: -61, etas: 348, groundSpeed: 287, wc: -63 },
    { id: 6, tas: 220, fpt: 250, windVelocity: '170/65', crosswind: 64, driftAngle: '17°', headTailwind: -10, etas: 211, groundSpeed: 201, wc: -19 },
    { id: 7, tas: 280, fpt: 320, windVelocity: '280/80', crosswind: 50, driftAngle: '10°', headTailwind: -60, etas: 276, groundSpeed: 216, wc: -64 },
    { id: 8, tas: 260, fpt: 40, windVelocity: '120/50', crosswind: 49, driftAngle: '11°', headTailwind: -9, etas: 255, groundSpeed: 246, wc: -14 },
    { id: 9, tas: 400, fpt: 135, windVelocity: '340/70', crosswind: 30, driftAngle: '4°', headTailwind: 63, etas: 400, groundSpeed: 463, wc: 63 },
    { id: 10, tas: 450, fpt: 225, windVelocity: '340/110', crosswind: 100, driftAngle: '13°', headTailwind: 43, etas: 440, groundSpeed: 483, wc: 33 },
    { id: 11, tas: 360, fpt: 45, windVelocity: '355/90', crosswind: 65, driftAngle: '10°', headTailwind: -60, etas: 355, groundSpeed: 295, wc: -65 },
    { id: 12, tas: 390, fpt: 165, windVelocity: '290/100', crosswind: 81, driftAngle: '12°', headTailwind: 59, etas: 382, groundSpeed: 441, wc: 51 },
  ];

  const handleShowAnswers = () => {
    setShowAnswers(true);
  };

  const handleHideAnswers = () => {
    setShowAnswers(false);
  };

  const handleReset = () => {
    setShowAnswers(false);
  };

  return (
    <div style={{ padding: spacing.scale[4] }}>
      <h3 style={{ ...styles.heading, fontSize: '1.25rem', marginBottom: spacing.scale[4] }}>
        TAS Practice Table - 12 Examples
      </h3>
      
      <div style={{ marginBottom: spacing.scale[4] }}>
        {!showAnswers ? (
          <SecondaryButton
            onClick={handleShowAnswers}
            style={{ marginRight: spacing.scale[2] }}
          >
            Show Answer Key
          </SecondaryButton>
        ) : (
          <SecondaryButton
            onClick={handleHideAnswers}
            style={{ marginRight: spacing.scale[2] }}
          >
            Hide Answer Key
          </SecondaryButton>
        )}
        <SecondaryButton
          onClick={handleReset}
          style={{ fontSize: '0.875rem' }}
        >
          Reset Table
        </SecondaryButton>
      </div>

      <div style={{
        overflow: 'auto',
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: spacing.radius.lg,
        maxHeight: '600px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.gray[50] }}>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                Q
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                TAS
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                FPT°
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                W/V
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                Crosswind (Knots)
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                Drift Angle
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                Head/Tailwind
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                ETAS
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                Ground-speed
              </th>
              <th style={{ padding: spacing.scale[2], textAlign: 'center', borderBottom: `1px solid ${colors.gray[200]}`, fontSize: '0.75rem', fontWeight: 600 }}>
                WC
              </th>
            </tr>
          </thead>
          <tbody>
            {practiceData.map((row) => (
              <tr key={row.id} style={{ borderBottom: `1px solid ${colors.gray[100]}` }}>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 500, color: colors.aviation.navy }}>
                  {row.id}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center' }}>
                  {row.tas}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center' }}>
                  {row.fpt}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center' }}>
                  {row.windVelocity}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.primary : colors.gray[400] }}>
                  {showAnswers ? row.crosswind : '-'}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.primary : colors.gray[400] }}>
                  {showAnswers ? row.driftAngle : '-'}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.secondary : colors.gray[400] }}>
                  {showAnswers ? row.headTailwind : '-'}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.primary : colors.gray[400] }}>
                  {showAnswers ? row.etas : '-'}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.secondary : colors.gray[400] }}>
                  {showAnswers ? row.groundSpeed : '-'}
                </td>
                <td style={{ padding: spacing.scale[2], fontSize: '0.75rem', textAlign: 'center', fontWeight: 600, color: showAnswers ? colors.aviation.secondary : colors.gray[400] }}>
                  {showAnswers ? row.wc : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ 
        marginTop: spacing.scale[4], 
        padding: spacing.scale[3], 
        background: colors.withOpacity(colors.aviation.primary, 0.05),
        border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
        borderRadius: spacing.radius.md
      }}>
        <p style={{ 
          fontSize: '0.875rem', 
          color: colors.aviation.primary, 
          margin: 0,
          lineHeight: '1.5'
        }}>
          <strong>Instructions:</strong> Use your flight computer (whiz wheel) to calculate Crosswind, Drift Angle, Head/Tailwind, ETAS, Ground Speed, and Wind Component (WC) for each example. 
          Click "Show Answer Key" to check your calculations, then "Reset Table" to practice again.
        </p>
      </div>
    </div>
  );
};

export default TASPracticeTable;