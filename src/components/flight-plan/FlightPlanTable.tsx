import React, { useState, useCallback } from 'react';
import type { FlightPlanSegment, Question, FlightPlanData } from '../../types';
import { databaseService } from '../../services/database';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import { MapPin, Clock, Navigation, Fuel } from 'lucide-react';
import FuelPolicyModal from './FuelPolicyModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FlightPlanTableProps {
  onFlightPlanUpdate?: (segments: FlightPlanSegment[]) => void;
  initialSegments?: FlightPlanSegment[];
  questionContext?: Question;
  initialData?: FlightPlanData;
  onDataChange?: (newData: FlightPlanData) => void;
}

const createEmptySegment = (id: string): FlightPlanSegment => ({
  id,
  segment: '',
  flightLevel: 0,
  altitudeTrend: undefined,
  tempDeviation: 0,
  machNo: 0,
  tas: 0,
  track: 0,
  wind: '',
  windComponent: 0,
  groundSpeed: 0,
  distance: 0,
  estimatedTimeInterval: 0,
  airDistance: 0,
  fuelFlow: 0,
  zoneFuel: 0,
  startZoneWeight: 0,
  emzw: 0,
  endZoneWeight: 0,
  planFuelRemaining: 0,
  actualFuelRemaining: 0,
  planEstimate: '',
  actualTimeArrival: ''
});

const FlightPlanTable: React.FC<FlightPlanTableProps> = ({
  onFlightPlanUpdate,
  initialSegments,
  questionContext,
  initialData,
  onDataChange
}) => {
  const defaultSegments = (): FlightPlanSegment[] => {
    if (initialSegments && initialSegments.length > 0) return initialSegments;
    if (initialData && initialData.segments) return initialData.segments;
    return Array.from({ length: 10 }, (_, i) => createEmptySegment(`seg-${i + 1}`));
  };

  const [segments, setSegments] = useState<FlightPlanSegment[]>(defaultSegments());
  const [altitudeWarnings, setAltitudeWarnings] = useState<Record<string, string>>({});
  const [showFlHint, setShowFlHint] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('fp_hint_fl_trend_seen') !== '1';
    } catch {
      return true;
    }
  });
  const [showFuelModal, setShowFuelModal] = useState(false);

  // Update data when segments change
  const updateData = useCallback((newSegments: FlightPlanSegment[]) => {
    if (onDataChange) {
      onDataChange({
        segments: newSegments,
        timestamp: new Date().toISOString()
      });
    }
  }, [onDataChange]);



  const validateAltitudeCapability = useCallback(async (segment: FlightPlanSegment) => {
    try {
      const weightIn1000kg = segment.startZoneWeight / 1000;
      const cruiseSchedule = segment.machNo === 0 ? 'LRC' : segment.machNo.toFixed(2);
      
      const capability = await databaseService.getAltitudeCapability(
        segment.flightLevel, 
        cruiseSchedule, 
        segment.tempDeviation
      );
      
      if (capability) {
        const maxWeight = capability.cruise_thrust_limit_isa || 0;
        if (weightIn1000kg > maxWeight) {
          setAltitudeWarnings(prev => ({
            ...prev,
            [segment.id]: `Weight ${weightIn1000kg.toFixed(1)}t exceeds FL${segment.flightLevel} limit of ${maxWeight}t`
          }));
        } else {
          setAltitudeWarnings(prev => {
            const updated = { ...prev };
            delete updated[segment.id];
            return updated;
          });
        }
      }
    } catch (error) {
      console.warn('Altitude validation failed:', error);
    }
    }, []);

  const updateSegment = useCallback((id: string, field: keyof FlightPlanSegment, value: string | number) => {
    setSegments(prev => {
      const updated = prev.map((segment: FlightPlanSegment) => {
        if (segment.id !== id) return segment;
        
        const updatedSegment = { ...segment, [field]: value };
        
        // No automatic calculations - all values are entered manually
        
        return updatedSegment;
      });
      
      updateData(updated);
      onFlightPlanUpdate?.(updated);
      return updated;
    });
  }, [onFlightPlanUpdate, validateAltitudeCapability, updateData]);

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return;
    setSegments(prev => prev.filter(seg => seg.id !== id));
  };

  const addSegment = () => {
    setSegments(prev => [...prev, createEmptySegment(`seg-${prev.length + 1}`)]);
  };

  const renderEditableCell = (
    segmentId: string, 
    field: keyof FlightPlanSegment,
    value: string | number,
    type: 'text' | 'number' = 'number',
    disabled: boolean = false
  ) => (
    <input
      type={type}
      value={type === 'number' ? (value === 0 ? '' : value) : value}
      onChange={(e) => updateSegment(segmentId, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      style={{
        width: '100%',
        padding: `${spacing.scale[1]} ${spacing.scale[2]}`,
        fontSize: '0.75rem',
        border: `1px solid ${disabled ? colors.gray[300] : colors.aviation.border}`,
        borderRadius: spacing.radius.md,
        background: disabled ? colors.gray[100] : colors.white,
        cursor: disabled ? 'not-allowed' : 'text',
        outline: 'none',
        transition: 'all 0.2s ease',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
      }}
      onFocus={(e) => {
        e.target.style.borderColor = colors.aviation.primary;
        e.target.style.boxShadow = `0 0 0 2px ${colors.withOpacity(colors.aviation.primary, 0.2)}`;
      }}
      onBlur={(e) => {
        e.target.style.borderColor = colors.aviation.border;
        e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.1)';
      }}
      disabled={disabled}
    />
  );

  const totals = {
    distance: segments.reduce((sum, seg) => sum + seg.distance, 0),
    time: segments.reduce((sum, seg) => sum + seg.estimatedTimeInterval, 0),
    fuel: segments.reduce((sum, seg) => sum + seg.zoneFuel, 0)
  };

  const { colors, spacing, styles } = useDesignSystem();

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.scale[4]
  };

  const titleStyle: React.CSSProperties = {
    ...styles.heading,
    fontSize: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[2]
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.scale[2]
  };

  const metricsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: spacing.scale[4],
    marginBottom: spacing.scale[6]
  };

  const metricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3],
    padding: spacing.scale[3],
    background: colors.withOpacity(colors.aviation.primary, 0.05),
    borderRadius: spacing.radius.lg,
    border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '2rem',
    height: '2rem',
    borderRadius: spacing.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.withOpacity(colors.aviation.primary, 0.1)
  };

  const metricTextStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column'
  };

  const metricLabelStyle: React.CSSProperties = {
    ...styles.caption,
    color: colors.aviation.muted
  };

  const metricValueStyle: React.CSSProperties = {
    ...styles.body,
    fontWeight: 600,
    color: colors.aviation.navy
  };


  return (
    <div style={{ padding: spacing.scale[2] }}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      <div style={{ width: '100%', margin: '0 auto' }}>
        {/* Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <div style={headerStyle}>
            <div>
              <h1 style={titleStyle}>
                <Navigation style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
                Interactive Flight Planning Sheet
              </h1>
              {questionContext ? (
                <div>
                  <p style={{ ...styles.caption, marginTop: spacing.scale[1] }}>
                    {(() => {
                      // Extract route information from question title/description
                      const title = questionContext.title;
                      const description = questionContext.description;
                      
                      // Look for "from X to Y" pattern in title or description
                      const fromToMatch = (title + ' ' + description).match(/from\s+([A-Z\s]+?)\s+to\s+([A-Z\s]+?)(?:\s+via|\s+in|\s+on|\s+at|$)/i);
                      if (fromToMatch) {
                        const from = fromToMatch[1].trim();
                        const to = fromToMatch[2].trim();
                        return `${from} → ${to}`;
                      }
                      
                      // Look for aircraft type in title
                      const aircraftMatch = title.match(/(B\d{3}|A\d{3}|Boeing\s+\d{3}|Airbus\s+\d{3})/i);
                      const aircraft = aircraftMatch ? aircraftMatch[1] : 'Aircraft';
                      
                      // Fallback to showing just the aircraft type
                      return aircraft;
                    })()}
                  </p>
                </div>
              ) : (
                <p style={{ ...styles.caption, marginTop: spacing.scale[1] }}>
                  Flight Planning Sheet
                </p>
              )}
            </div>
            <div style={buttonGroupStyle}>
              <SecondaryButton
                onClick={addSegment}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                Add Segment
              </SecondaryButton>
              <SecondaryButton
            onClick={() => {
              const csvData = [
                ['SEG', 'FL', 'TEMP T/DEV', 'MACH NO', 'TAS', 'TR', 'WIND', 'HDG', 'GS', 'DIST', 'ETI', 'AIR DIST', 'FUEL FLOW', 'ZONE FUEL', 'START ZONE WT', 'EMZW', 'END ZONE WT', 'PLAN FUEL REM', 'ACT FUEL REM', 'PLAN EST', 'ATA'],
                ...segments.map(s => [
                  s.segment, s.flightLevel, s.tempDeviation, s.machNo, s.tas, s.track,
                  s.wind, s.windComponent, s.groundSpeed, s.distance,
                  s.estimatedTimeInterval, s.airDistance, s.fuelFlow, s.zoneFuel,
                  s.startZoneWeight, s.emzw, s.endZoneWeight, s.planFuelRemaining,
                  s.actualFuelRemaining, s.planEstimate, s.actualTimeArrival
                ])
              ];
              
              const csv = csvData.map(row => row.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `flight-plan-${Date.now()}.csv`;
              a.click();
            }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
          >
            Export CSV
              </SecondaryButton>
        </div>
      </div>
        </Card>

        {/* Question Context and Given Data */}
        {questionContext && (
          <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
            <CardHeader title="Question Details" />
            <CardContent>
              {/* Question Context */}
              <div style={{
                padding: spacing.scale[3],
                background: colors.withOpacity(colors.aviation.secondary, 0.05),
                borderRadius: spacing.radius.md,
                border: `1px solid ${colors.withOpacity(colors.aviation.secondary, 0.1)}`,
                marginBottom: spacing.scale[4]
              }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: colors.aviation.navy,
                  marginBottom: spacing.scale[2]
                }}>
                  Question Context:
                </p>
                <p style={{ 
                  fontSize: '0.75rem', 
                  color: colors.aviation.text,
                  lineHeight: '1.4',
                  marginBottom: spacing.scale[3]
                }}>
                  {questionContext.description}
                </p>
                
                {/* Given Data */}
                {questionContext.givenData && Object.keys(questionContext.givenData).length > 0 && (
                  <div>
                    <p style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 500, 
                      color: colors.aviation.navy,
                      marginBottom: spacing.scale[2]
                    }}>
                      Given Data:
                    </p>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                      gap: spacing.scale[2],
                      fontSize: '0.7rem'
                    }}>
                      {Object.entries(questionContext.givenData).map(([key, value]) => (
                        <div key={key} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: `${spacing.scale[2]} ${spacing.scale[3]}`,
                          background: colors.withOpacity(colors.aviation.primary, 0.05),
                          borderRadius: spacing.radius.sm,
                          border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`
                        }}>
                          <span style={{ fontWeight: 500, color: colors.aviation.navy }}>{key}:</span>
                          <span style={{ color: colors.aviation.text }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Flight Plan Table */}
        <Card variant="default" padding="none" style={{ marginBottom: spacing.scale[4] }}>
          <CardHeader title="Flight Plan Segments" />
          <CardContent>
            <div style={{ 
              overflowX: 'auto',
              border: `1px solid ${colors.gray[200]}`,
              borderRadius: spacing.radius.md,
              background: colors.white,
              minWidth: '1400px'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.75rem',
                fontFamily: 'monospace'
              }}>
          <thead>
                  <tr style={{ 
                    background: colors.gray[50],
                    borderBottom: `2px solid ${colors.gray[300]}`
                  }}>
                    <th style={{
                      padding: '6px 8px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '100px',
                      maxWidth: '120px'
                    }}>
                      Segment
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '40px',
                      maxWidth: '50px'
                    }}>
                      FL
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      T/DEV
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '50px',
                      maxWidth: '60px'
                    }}>
                      Mach
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '50px',
                      maxWidth: '60px'
                    }}>
                      TAS
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '50px',
                      maxWidth: '60px'
                    }}>
                      TR
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '70px',
                      maxWidth: '80px'
                    }}>
                      Wind
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '40px',
                      maxWidth: '50px'
                    }}>
                      WC
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '50px',
                      maxWidth: '60px'
                    }}>
                      GS
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '50px',
                      maxWidth: '60px'
                    }}>
                      Dist
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      ETI
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      Air Dist
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      Fuel Flow
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      Zone Fuel
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '80px',
                      maxWidth: '90px'
                    }}>
                      Start WT
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      EMZW
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '80px',
                      maxWidth: '90px'
                    }}>
                      End WT
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '80px',
                      maxWidth: '90px'
                    }}>
                      Plan Rem
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '80px',
                      maxWidth: '90px'
                    }}>
                      Act Rem
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      Plan Est
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderRight: `1px solid ${colors.gray[200]}`,
                      minWidth: '60px',
                      maxWidth: '70px'
                    }}>
                      ATA
                    </th>
                    <th style={{
                      padding: '6px 4px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: colors.aviation.navy,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      minWidth: '30px',
                      maxWidth: '40px'
                    }}>
                      ✕
                    </th>
            </tr>
          </thead>
          <tbody>
                  {segments.map((segment, index) => (
                    <tr key={segment.id} style={{ 
                      background: index % 2 === 0 ? colors.white : colors.gray[50],
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      <td style={{
                        padding: '4px 8px',
                        borderRight: `1px solid ${colors.gray[200]}`,
                        fontWeight: 500
                      }}>
                  {renderEditableCell(segment.id, 'segment', segment.segment, 'text')}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`,
                        background: altitudeWarnings[segment.id] ? colors.withOpacity(colors.aviation.secondary, 0.1) : 'transparent'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}>
                          <div onDoubleClick={() => {
                      setSegments(prev => prev.map(s => s.id === segment.id ? {
                        ...s,
                        altitudeTrend: s.altitudeTrend === undefined ? 'climb' : s.altitudeTrend === 'climb' ? 'level' : s.altitudeTrend === 'level' ? 'descent' : undefined
                      } : s));
                      try { 
                        window.localStorage.setItem('fp_hint_fl_trend_seen', '1'); 
                      } catch (storageError) {
                        console.warn('Could not save hint state:', storageError);
                      }
                      setShowFlHint(false);
                    }}>
                      {renderEditableCell(segment.id, 'flightLevel', segment.flightLevel)}
                    </div>
                    <span
                            style={{
                              color: segment.altitudeTrend === 'climb' ? colors.aviation.secondary :
                                     segment.altitudeTrend === 'descent' ? colors.aviation.navy : colors.aviation.muted,
                              fontSize: '0.7rem'
                            }}
                      title={segment.altitudeTrend ? (segment.altitudeTrend.charAt(0).toUpperCase() + segment.altitudeTrend.slice(1)) : 'No trend'}
                    >
                      {segment.altitudeTrend === 'climb' ? '↗' : segment.altitudeTrend === 'descent' ? '↘' : '→'}
                    </span>
                  {altitudeWarnings[segment.id] && (
                            <span style={{ fontSize: '0.6rem', color: colors.aviation.secondary }} title={altitudeWarnings[segment.id]}>
                      ⚠️
                            </span>
                  )}
                  </div>
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'tempDeviation', segment.tempDeviation)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'machNo', segment.machNo)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'tas', segment.tas)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'track', segment.track)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'wind', segment.wind, 'text')}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'windComponent', segment.windComponent)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'groundSpeed', segment.groundSpeed)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'distance', segment.distance)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'estimatedTimeInterval', segment.estimatedTimeInterval)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'airDistance', segment.airDistance)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'fuelFlow', segment.fuelFlow)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'zoneFuel', segment.zoneFuel)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'startZoneWeight', segment.startZoneWeight)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'emzw', segment.emzw)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'endZoneWeight', segment.endZoneWeight)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'planFuelRemaining', segment.planFuelRemaining)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'actualFuelRemaining', segment.actualFuelRemaining)}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'planEstimate', segment.planEstimate, 'text')}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center',
                        borderRight: `1px solid ${colors.gray[200]}`
                      }}>
                  {renderEditableCell(segment.id, 'actualTimeArrival', segment.actualTimeArrival, 'text')}
                </td>
                      <td style={{
                        padding: '4px',
                        textAlign: 'center'
                      }}>
                    <button
                      onClick={() => removeSegment(segment.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: colors.aviation.secondary,
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            padding: '2px',
                            borderRadius: '2px'
                          }}
                      title="Remove segment"
                    >
                      ✕
                    </button>
                </td>
              </tr>
            ))}
            
            {/* Totals Row */}
                  <tr style={{ background: colors.gray[200], fontWeight: 600 }}>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }} colSpan={10}>
                TOTALS
              </td>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }}>
                {totals.distance.toFixed(0)}
              </td>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }}>
                {Math.round(totals.time)}
              </td>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }} colSpan={2}></td>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }}>
                {totals.fuel.toFixed(0)}
              </td>
                    <td style={{
                      padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${colors.gray[300]}`
                    }} colSpan={7}></td>
            </tr>
          </tbody>
        </table>
      </div>
          </CardContent>
        </Card>

        {/* Professional Altitude Profile Chart */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[4] }}>
          <CardHeader title="Flight Profile" />
          <CardContent>
            <div style={{
              height: '300px',
              background: colors.withOpacity(colors.aviation.primary, 0.02),
              borderRadius: spacing.radius.lg,
              border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.1)}`,
              padding: spacing.scale[4],
              position: 'relative'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={(() => {
                    const validSegments = segments.filter(s => s.segment && s.flightLevel > 0);
                    if (validSegments.length === 0) {
                      return [{ segment: 'Start', distance: 0, altitude: 370 }];
                    }
                    
                    let cumulativeDistance = 0;
                    return validSegments.map((segment) => {
                      cumulativeDistance += segment.distance || 0;
                      return {
                        segment: segment.segment,
                        distance: cumulativeDistance,
                        altitude: segment.flightLevel,
                        fuel: segment.zoneFuel || 0,
                        time: segment.estimatedTimeInterval || 0
                      };
                    });
                  })()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.withOpacity(colors.aviation.primary, 0.2)} />
                  <XAxis 
                    dataKey="distance" 
                    type="number"
                    scale="linear"
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `${value}nm`}
                    stroke={colors.aviation.text}
                    fontSize={12}
                  />
                  <YAxis 
                    dataKey="altitude"
                    domain={[200, 500]}
                    tickFormatter={(value) => `FL${value}`}
                    stroke={colors.aviation.text}
                    fontSize={12}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: colors.white,
                      border: `1px solid ${colors.aviation.primary}`,
                      borderRadius: spacing.radius.md,
                      fontSize: '0.75rem'
                    }}
                    formatter={(value: any, name: string) => {
                      switch (name) {
                        case 'altitude': return [`FL${value}`, 'Altitude'];
                        case 'distance': return [`${value}nm`, 'Distance'];
                        case 'fuel': return [`${value}kg`, 'Fuel'];
                        case 'time': return [`${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`, 'Time'];
                        default: return [value, name];
                      }
                    }}
                    labelFormatter={(label) => `Distance: ${label}nm`}
                  />
                  <Line
                    type="monotone"
                    dataKey="altitude"
                    stroke={colors.aviation.primary}
                    strokeWidth={3}
                    dot={{ fill: colors.aviation.primary, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: colors.aviation.primary, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Summary stats */}
              <div style={{
                position: 'absolute',
                top: spacing.scale[2],
                right: spacing.scale[2],
                background: colors.withOpacity(colors.white, 0.95),
                padding: spacing.scale[3],
                borderRadius: spacing.radius.md,
                fontSize: '0.75rem',
                color: colors.aviation.navy,
                border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
                boxShadow: `0 2px 4px ${colors.withOpacity(colors.gray[900], 0.1)}`
              }}>
                <div style={{ fontWeight: 600, marginBottom: spacing.scale[2], color: colors.aviation.primary }}>Flight Summary</div>
                <div style={{ marginBottom: spacing.scale[1] }}>Total Distance: {totals.distance.toFixed(0)} nm</div>
                <div style={{ marginBottom: spacing.scale[1] }}>Total Time: {Math.floor(totals.time / 60)}:{(totals.time % 60).toString().padStart(2, '0')}</div>
                <div style={{ marginBottom: spacing.scale[1] }}>Total Fuel: {totals.fuel.toFixed(0)} kg</div>
                <div>Active Segments: {segments.filter(s => s.segment).length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div style={{
          marginBottom: spacing.scale[4],
          padding: spacing.scale[3],
          background: colors.withOpacity(colors.aviation.primary, 0.05),
          border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
          borderRadius: spacing.radius.lg
        }}>
          <div style={{ fontSize: '0.875rem', color: colors.aviation.primary }}>
            <strong>Learning Mode:</strong> GS (Ground Speed), ETI (Time), EMZW (Mid-Zone Weight), and END ZONE WT are manually editable. 
            Practice your calculations and learn from mistakes!
          </div>
        </div>

        {/* Summary Cards */}
        <div style={metricsStyle}>
          <div style={metricStyle}>
            <div style={iconWrapperStyle}>
              <Navigation style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
            </div>
            <div style={metricTextStyle}>
              <p style={metricLabelStyle}>Total Distance</p>
              <p style={metricValueStyle}>{totals.distance.toFixed(0)} nm</p>
            </div>
          </div>
          <div style={metricStyle}>
            <div style={iconWrapperStyle}>
              <Clock style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
            </div>
            <div style={metricTextStyle}>
              <p style={metricLabelStyle}>Total Time</p>
              <p style={metricValueStyle}>{Math.round(totals.time)} min</p>
            </div>
          </div>
          <div style={metricStyle}>
            <div style={iconWrapperStyle}>
              <MapPin style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
            </div>
            <div style={metricTextStyle}>
              <p style={metricLabelStyle}>Cruise Altitude</p>
              <p style={metricValueStyle}>
                {(() => {
                  const validSegments = segments.filter(s => s.flightLevel > 0);
                  if (validSegments.length === 0) return 'FL0';
                  
                  const uniqueLevels = [...new Set(validSegments.map(s => s.flightLevel))];
                  if (uniqueLevels.length === 1) {
                    return `FL${uniqueLevels[0]}`;
                  } else {
                    // Multiple altitudes - show range for PNR/DP scenarios
                    const minLevel = Math.min(...uniqueLevels);
                    const maxLevel = Math.max(...uniqueLevels);
                    return minLevel === maxLevel ? `FL${minLevel}` : `FL${minLevel}-${maxLevel}`;
                  }
                })()}
              </p>
            </div>
          </div>
          <div style={metricStyle}>
            <div style={iconWrapperStyle}>
              <Fuel style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
            </div>
            <div style={metricTextStyle}>
              <button
                onClick={() => setShowFuelModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  position: 'relative'
                }}
                title="Click to open Fuel Policy Calculator"
              >
                <p style={metricLabelStyle}>Fuel</p>
                <p style={metricValueStyle}>{totals.fuel.toFixed(0)} kg</p>
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.aviation.secondary,
                  animation: 'pulse 2s infinite'
                }}></div>
              </button>
            </div>
          </div>
        </div>
      </div>

             {/* Fuel Policy Modal */}
       <FuelPolicyModal 
         isOpen={showFuelModal}
         onClose={() => setShowFuelModal(false)}
         totalTripFuel={totals.fuel}
         flightPlanSegments={segments}
       />

      {showFlHint && (
        <div style={{
          marginTop: spacing.scale[3],
          fontSize: '0.75rem',
          color: colors.aviation.primary,
          background: colors.withOpacity(colors.aviation.primary, 0.05),
          border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
          borderRadius: spacing.radius.md,
          padding: spacing.scale[2]
        }}>
          Double‑click FL to set climb/descent arrow. <button className="underline" onClick={() => { 
            try { 
              window.localStorage.setItem('fp_hint_fl_trend_seen', '1'); 
            } catch (storageError) { 
              console.warn('Could not save hint state:', storageError);
            }
            setShowFlHint(false); 
          }} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Got it</button>
        </div>
      )}
    </div>
  );
};

export default FlightPlanTable;