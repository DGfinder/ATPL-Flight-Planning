import React, { useState } from 'react';
import { Card, PrimaryButton, useDesignSystem } from '../../design-system';

const E6B: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [inputs, setInputs] = useState({
    tas: '',
    windDirection: '',
    windSpeed: '',
    heading: ''
  });
  const [results, setResults] = useState({
    groundSpeed: '',
    driftAngle: '',
    windCorrection: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateWindCorrection = () => {
    const tas = parseFloat(inputs.tas);
    const windDir = parseFloat(inputs.windDirection);
    const windSpeed = parseFloat(inputs.windSpeed);
    const heading = parseFloat(inputs.heading);

    if (isNaN(tas) || isNaN(windDir) || isNaN(windSpeed) || isNaN(heading)) {
      return;
    }

    // Simplified wind correction calculation
    const windAngle = windDir - heading;
    const windAngleRad = (windAngle * Math.PI) / 180;
    
    const crosswind = windSpeed * Math.sin(windAngleRad);
    const headwind = windSpeed * Math.cos(windAngleRad);
    
    const driftAngle = Math.atan2(crosswind, tas) * (180 / Math.PI);
    const groundSpeed = tas + headwind;
    const windCorrection = heading + driftAngle;

    setResults({
      groundSpeed: groundSpeed.toFixed(0),
      driftAngle: Math.abs(driftAngle).toFixed(1),
      windCorrection: windCorrection.toFixed(0)
    });
  };

  return (
    <Card style={{
      width: '820px',
      maxWidth: '95vw',
      padding: spacing.scale[6],
      transform: 'scale(1)',
      animation: 'scaleIn 0.3s ease-out'
    }}>
      <h2 style={{ ...styles.heading, fontSize: '1.5rem', marginBottom: spacing.scale[6] }}>
        E6B Flight Computer
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.scale[6] }}>
        {/* Input Section */}
        <div>
          <h3 style={{ ...styles.heading, fontSize: '1.125rem', marginBottom: spacing.scale[4] }}>
            Input Values
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
            <div>
              <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
                True Airspeed (kts)
              </label>
              <input
                type="number"
                value={inputs.tas}
                onChange={(e) => handleInputChange('tas', e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
                Wind Direction (°)
              </label>
              <input
                type="number"
                value={inputs.windDirection}
                onChange={(e) => handleInputChange('windDirection', e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
                Wind Speed (kts)
              </label>
              <input
                type="number"
                value={inputs.windSpeed}
                onChange={(e) => handleInputChange('windSpeed', e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: spacing.scale[1], fontSize: '0.875rem', fontWeight: 500 }}>
                Heading (°)
              </label>
              <input
                type="number"
                value={inputs.heading}
                onChange={(e) => handleInputChange('heading', e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                  border: `1px solid ${colors.gray[300]}`,
                  borderRadius: spacing.radius.md,
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            <PrimaryButton
              onClick={calculateWindCorrection}
              style={{ marginTop: spacing.scale[3] }}
            >
              Calculate
            </PrimaryButton>
          </div>
        </div>

        {/* Results Section */}
        <div>
          <h3 style={{ ...styles.heading, fontSize: '1.125rem', marginBottom: spacing.scale[4] }}>
            Results
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.scale[3] }}>
            <Card style={{ padding: spacing.scale[3] }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: spacing.scale[1] }}>
                Ground Speed
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.aviation.primary }}>
                {results.groundSpeed || '---'} kts
              </div>
            </Card>

            <Card style={{ padding: spacing.scale[3] }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: spacing.scale[1] }}>
                Drift Angle
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.aviation.secondary }}>
                {results.driftAngle || '---'}°
              </div>
            </Card>

            <Card style={{ padding: spacing.scale[3] }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: spacing.scale[1] }}>
                Wind Correction Angle
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors.aviation.navy }}>
                {results.windCorrection || '---'}°
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default E6B;


