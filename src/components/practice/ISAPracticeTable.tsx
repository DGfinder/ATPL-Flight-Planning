import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, useDesignSystem } from '../../design-system';

interface ISARow {
  id: number;
  pressureAltitude: number;
  isaTemp: number;
  isaDeviation: number;
  actualTemp: number;
}

interface StudentISAAAnswers {
  [key: number]: {
    isaTemp: string;
    actualTemp: string;
  };
}

const ISAPracticeTable: React.FC = () => {
  const { colors, spacing, styles } = useDesignSystem();
  const [studentAnswers, setStudentAnswers] = useState<StudentISAAAnswers>({});

  // ISA temperature data with answers
  const data: ISARow[] = [
    { id: 1, pressureAltitude: 10000, isaTemp: -5, isaDeviation: 8, actualTemp: 3 },
    { id: 2, pressureAltitude: 14000, isaTemp: -13, isaDeviation: -12, actualTemp: -25 },
    { id: 3, pressureAltitude: 21000, isaTemp: -27, isaDeviation: -9, actualTemp: -36 },
    { id: 4, pressureAltitude: 17000, isaTemp: -19, isaDeviation: 5, actualTemp: -14 },
    { id: 5, pressureAltitude: 28000, isaTemp: -40, isaDeviation: 8, actualTemp: -32 },
    { id: 6, pressureAltitude: 15000, isaTemp: -15, isaDeviation: -3, actualTemp: -18 },
    { id: 7, pressureAltitude: 19000, isaTemp: -23, isaDeviation: 12, actualTemp: -11 },
    { id: 8, pressureAltitude: 22000, isaTemp: -29, isaDeviation: -6, actualTemp: -35 },
    { id: 9, pressureAltitude: 28000, isaTemp: -40, isaDeviation: 12, actualTemp: -28 },
    { id: 10, pressureAltitude: 25000, isaTemp: -35, isaDeviation: -14, actualTemp: -49 }
  ];

  // Load student answers from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('isa_practice_answers');
    if (saved) {
      setStudentAnswers(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (rowId: number, field: 'isaTemp' | 'actualTemp', value: string) => {
    const newAnswers = {
      ...studentAnswers,
      [rowId]: {
        ...studentAnswers[rowId],
        [field]: value
      }
    };
    setStudentAnswers(newAnswers);
    localStorage.setItem('isa_practice_answers', JSON.stringify(newAnswers));
  };

  const getStudentAnswer = (rowId: number, field: 'isaTemp' | 'actualTemp'): string => {
    return studentAnswers[rowId]?.[field] || '';
  };

  const isAnswerCorrect = (rowId: number, field: 'isaTemp' | 'actualTemp'): boolean => {
    const studentAnswer = getStudentAnswer(rowId, field);
    if (!studentAnswer) return false;
    
    const correctValue = field === 'isaTemp' ? data[rowId - 1].isaTemp : data[rowId - 1].actualTemp;
    return parseInt(studentAnswer) === correctValue;
  };

  const calculateISATemp = (pressureAltitude: number): number => {
    // ISA temperature decreases by 2°C per 1000ft from sea level (15°C)
    return 15 - (pressureAltitude / 1000) * 2;
  };

  return (
    <Card style={{ marginBottom: spacing.scale[4] }}>
      <CardHeader>
        <h3 style={{ ...styles.heading, fontSize: '1.25rem', margin: 0 }}>
          ISA Temperature Calculations Practice
        </h3>
        <p style={{ color: colors.aviation.muted, marginTop: spacing.scale[2], marginBottom: 0 }}>
          Calculate the ISA temperature and actual temperature for each pressure altitude. 
          ISA temperature decreases by 2°C per 1000ft from sea level (15°C).
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
            fontFamily: 'monospace'
          }}>
            <thead>
              <tr style={{
                background: colors.gray[50],
                borderBottom: `2px solid ${colors.gray[300]}`
              }}>
                <th style={{
                  padding: spacing.scale[2],
                  textAlign: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  borderRight: `1px solid ${colors.gray[200]}`
                }}>
                  Q
                </th>
                <th style={{
                  padding: spacing.scale[2],
                  textAlign: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  borderRight: `1px solid ${colors.gray[200]}`
                }}>
                  Pressure Altitude (ft)
                </th>
                <th style={{
                  padding: spacing.scale[2],
                  textAlign: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  borderRight: `1px solid ${colors.gray[200]}`
                }}>
                  ISA Temp (°C)
                </th>
                <th style={{
                  padding: spacing.scale[2],
                  textAlign: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy,
                  borderRight: `1px solid ${colors.gray[200]}`
                }}>
                  ISA Deviation
                </th>
                <th style={{
                  padding: spacing.scale[2],
                  textAlign: 'center',
                  fontWeight: 600,
                  color: colors.aviation.navy
                }}>
                  Actual Temp (°C)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id} style={{
                  background: index % 2 === 0 ? colors.white : colors.gray[50],
                  borderBottom: `1px solid ${colors.gray[200]}`
                }}>
                  <td style={{
                    padding: spacing.scale[2],
                    textAlign: 'center',
                    fontWeight: 600,
                    color: colors.aviation.primary,
                    borderRight: `1px solid ${colors.gray[200]}`
                  }}>
                    {row.id}
                  </td>
                  <td style={{
                    padding: spacing.scale[2],
                    textAlign: 'center',
                    fontWeight: 500,
                    borderRight: `1px solid ${colors.gray[200]}`
                  }}>
                    {row.pressureAltitude.toLocaleString()}
                  </td>
                  <td style={{
                    padding: spacing.scale[2],
                    textAlign: 'center',
                    borderRight: `1px solid ${colors.gray[200]}`,
                    background: isAnswerCorrect(row.id, 'isaTemp') 
                      ? colors.withOpacity(colors.semantic.success, 0.1)
                      : colors.withOpacity(colors.semantic.error, 0.1)
                  }}>
                    <input
                      type="number"
                      value={getStudentAnswer(row.id, 'isaTemp')}
                      onChange={(e) => handleInputChange(row.id, 'isaTemp', e.target.value)}
                      style={{
                        width: '60px',
                        padding: '4px',
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        background: 'transparent'
                      }}
                      placeholder="?"
                    />
                  </td>
                  <td style={{
                    padding: spacing.scale[2],
                    textAlign: 'center',
                    fontWeight: 500,
                    borderRight: `1px solid ${colors.gray[200]}`,
                    color: row.isaDeviation > 0 ? colors.aviation.secondary : colors.aviation.navy
                  }}>
                    {row.isaDeviation > 0 ? `+${row.isaDeviation}` : row.isaDeviation}
                  </td>
                  <td style={{
                    padding: spacing.scale[2],
                    textAlign: 'center',
                    background: isAnswerCorrect(row.id, 'actualTemp') 
                      ? colors.withOpacity(colors.semantic.success, 0.1)
                      : colors.withOpacity(colors.semantic.error, 0.1)
                  }}>
                    <input
                      type="number"
                      value={getStudentAnswer(row.id, 'actualTemp')}
                      onChange={(e) => handleInputChange(row.id, 'actualTemp', e.target.value)}
                      style={{
                        width: '60px',
                        padding: '4px',
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: spacing.radius.sm,
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        background: 'transparent'
                      }}
                      placeholder="?"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={{ marginTop: spacing.scale[4], padding: spacing.scale[3], background: colors.gray[50], borderRadius: spacing.radius.md }}>
          <h4 style={{ ...styles.heading, fontSize: '1rem', marginBottom: spacing.scale[2] }}>
            Instructions:
          </h4>
          <ul style={{ margin: 0, paddingLeft: spacing.scale[4], color: colors.aviation.navy }}>
            <li>ISA temperature decreases by 2°C per 1000ft from sea level (15°C)</li>
            <li>Actual temperature = ISA temperature + ISA deviation</li>
            <li>Enter your answers in the input fields</li>
            <li>Green background indicates correct answers</li>
            <li>Red background indicates incorrect answers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ISAPracticeTable;
