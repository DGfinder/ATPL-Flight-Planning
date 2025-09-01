import React, { useState, useCallback } from 'react';
import type { FlightPlanSegment } from '../../types';
import { AviationCalculations } from '../../utils/aviationCalculations';
import { databaseService } from '../../services/database';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  PrimaryButton, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';
import { Eye, MapPin, Clock, Navigation } from 'lucide-react';
import FlightPlanVisualization from './FlightPlanVisualization';

interface FlightPlanTableProps {
  onFlightPlanUpdate?: (segments: FlightPlanSegment[]) => void;
  initialSegments?: FlightPlanSegment[];
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
  initialSegments
}) => {
  const defaultSegments = (): FlightPlanSegment[] => {
    if (initialSegments && initialSegments.length > 0) return initialSegments;
    return Array.from({ length: 7 }, (_, i) => createEmptySegment(`seg-${i + 1}`));
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
  const [showVisualization, setShowVisualization] = useState(false);

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
      const updated = prev.map(segment => {
        if (segment.id !== id) return segment;
        
        const updatedSegment = { ...segment, [field]: value };
        
        // E6B Flight Computer Logic with proper sin/cos calculations
        // Wind component is now entered manually by the user. We no longer auto-calc from WIND string.
        
        // Auto-calculate TAS from Mach number and altitude conditions
        if (field === 'machNo' || field === 'flightLevel' || field === 'tempDeviation') {
          if (updatedSegment.machNo > 0 && updatedSegment.flightLevel > 0) {
            updatedSegment.tas = Math.round(AviationCalculations.machToTAS(
              updatedSegment.machNo, 
              updatedSegment.flightLevel * 100, 
              updatedSegment.tempDeviation
            ));
          }
        }
        
        if (field === 'tas' || field === 'windComponent') {
          updatedSegment.groundSpeed = updatedSegment.tas + updatedSegment.windComponent;
        }
        
        if (field === 'groundSpeed' || field === 'distance') {
          if (updatedSegment.groundSpeed > 0 && updatedSegment.distance > 0) {
            updatedSegment.estimatedTimeInterval = (updatedSegment.distance / updatedSegment.groundSpeed) * 60;
          }
        }
        
        // Zone fuel calculations based on fuel flow and time
        if (field === 'fuelFlow' || field === 'estimatedTimeInterval') {
          if (updatedSegment.fuelFlow > 0 && updatedSegment.estimatedTimeInterval > 0) {
            updatedSegment.zoneFuel = AviationCalculations.calculateZoneFuel(
              updatedSegment.fuelFlow, 
              updatedSegment.estimatedTimeInterval
            );
          }
        }
        
        // Advanced EMZW validation with POH weight bracket checking
        if (field === 'startZoneWeight' || field === 'distance' || field === 'machNo' || field === 'windComponent' || field === 'tempDeviation') {
          if (updatedSegment.startZoneWeight > 0 && updatedSegment.distance > 0 && updatedSegment.machNo > 0 && updatedSegment.estimatedTimeInterval > 0) {
            const emzwResult = AviationCalculations.validateEMZW(
              updatedSegment.startZoneWeight,
              updatedSegment.distance,
              updatedSegment.machNo,
              updatedSegment.windComponent,
              updatedSegment.estimatedTimeInterval,
              updatedSegment.tempDeviation
            );
            
            updatedSegment.emzw = emzwResult.emzw;
            updatedSegment.zoneFuel = emzwResult.zoneFuel;
            updatedSegment.fuelFlow = emzwResult.fuelFlow;
            updatedSegment.endZoneWeight = emzwResult.endZoneWeight;
            updatedSegment.planFuelRemaining = AviationCalculations.calculateFuelRemaining(
              updatedSegment.startZoneWeight, 
              updatedSegment.zoneFuel
            );
          }
        }
        
        // Validate altitude capability against weight and ISA conditions
        if (field === 'flightLevel' || field === 'startZoneWeight' || field === 'tempDeviation') {
          if (updatedSegment.flightLevel > 0 && updatedSegment.startZoneWeight > 0) {
            validateAltitudeCapability(updatedSegment).catch(console.error);
          }
        }
        
        return updatedSegment;
      });
      
      onFlightPlanUpdate?.(updated);
      return updated;
    });
  }, [onFlightPlanUpdate, validateAltitudeCapability]);

  const addSegment = () => {
    const newId = `seg-${segments.length + 1}`;
    setSegments(prev => [...prev, createEmptySegment(newId)]);
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return;
    setSegments(prev => prev.filter(seg => seg.id !== id));
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
      value={value}
      onChange={(e) => updateSegment(segmentId, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      className={`w-full px-2 py-1 text-xs border rounded ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300 focus:border-aviation-primary'
      }`}
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

  if (showVisualization) {
    // Convert segments to flight plan data format
    const visualizationData = {
      departure: { code: 'YSSY', name: 'Sydney', lat: -33.9461, lon: 151.1772, elevation: 21 },
      arrival: { code: 'YPPH', name: 'Perth', lat: -31.9403, lon: 115.9672, elevation: 67 },
      waypoints: segments.map((segment, index) => ({
        id: index + 1,
        code: segment.segment,
        lat: -33 + (index * 0.5),
        lon: 151 - (index * 2),
        altitude: segment.flightLevel * 100,
        time: `${Math.floor(segment.estimatedTimeInterval / 60)}:${(segment.estimatedTimeInterval % 60).toString().padStart(2, '0')}`,
        fuel: segment.zoneFuel
      })),
      alternates: [],
      plannedAltitude: segments[0]?.flightLevel * 100 || 37000,
      distance: totals.distance,
      estimatedTime: `${Math.floor(totals.time / 60)}:${(totals.time % 60).toString().padStart(2, '0')}`,
      fuelRequired: totals.fuel,
      winds: { direction: 270, speed: 45 }
    };

    return (
      <FlightPlanVisualization 
        flightPlan={visualizationData}
      />
    );
  }

  return (
    <div style={{ padding: spacing.scale[6] }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
          <div style={headerStyle}>
            <div>
              <h1 style={titleStyle}>
                <Navigation style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
                Interactive Flight Planning Sheet
              </h1>
              <p style={{ ...styles.caption, marginTop: spacing.scale[1] }}>
                Sydney → Perth | Boeing 737-800
              </p>
            </div>
            <div style={buttonGroupStyle}>
              <PrimaryButton
                onClick={addSegment}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                Add Segment
              </PrimaryButton>
              <SecondaryButton
                onClick={async () => {
                  if (segments.length > 0 && segments[0].startZoneWeight > 0 && segments[0].track > 0) {
                    try {
                      const optimal = await databaseService.getOptimumAltitudeForWeight(
                        segments[0].startZoneWeight,
                        segments[0].track,
                        segments[0].tempDeviation
                      );
                      alert(`Suggested FL${optimal.flightLevel} using ${optimal.cruiseSchedule} for weight ${(segments[0].startZoneWeight/1000).toFixed(1)}t`);
                    } catch (error) {
                      console.error('Failed to get altitude suggestion:', error);
                    }
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                Suggest Altitude
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
              <PrimaryButton
                onClick={() => setShowVisualization(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.scale[2]
                }}
              >
                <Eye style={{ width: '1rem', height: '1rem' }} />
                Visualize Route
              </PrimaryButton>
            </div>
          </div>

          {/* Key Metrics */}
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
                <p style={metricValueStyle}>FL{segments[0].flightLevel}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <Navigation style={{ width: '1rem', height: '1rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Total Fuel</p>
                <p style={metricValueStyle}>{totals.fuel.toFixed(0)} kg</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Learning Mode:</strong> GS (Ground Speed), ETI (Time), EMZW (Mid-Zone Weight), and END ZONE WT are manually editable. 
            Practice your calculations and learn from mistakes!
          </div>
        </div>

        {/* Flight Plan Table */}
        <Card variant="default" padding="none">
          <CardHeader title="Flight Plan Segments" />
          <CardContent>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: colors.gray[50] }}>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      Segment
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      FL
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      TEMP T/DEV
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      MACH NO
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      TAS
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      TR
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      WIND
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      WC
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      GS
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      DIST
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      ETI
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      AIR DIST
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      FUEL FLOW
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      ZONE FUEL
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      START ZONE WT
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      EMZW
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      END ZONE WT
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      PLAN FUEL REM
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      ACT FUEL REM
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      PLAN EST
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'left',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      ATA
                    </th>
                    <th style={{
                      padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: colors.aviation.muted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: `1px solid ${colors.gray[200]}`
                    }}>
                      ✕
                    </th>
                  </tr>
                </thead>
                <tbody>
                                     {segments.map((segment) => (
                     <tr key={segment.id} style={{ background: 'transparent' }}>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'segment', segment.segment, 'text')}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        <div className={`flex items-center gap-2 ${altitudeWarnings[segment.id] ? 'bg-red-100' : ''}`}>
                          <div className="flex-1" onDoubleClick={() => {
                            // Double click toggles through trend options: undefined -> climb -> level -> descent -> undefined
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
                            className={
                              segment.altitudeTrend === 'climb' ? 'text-green-600' :
                              segment.altitudeTrend === 'descent' ? 'text-amber-600' : 'text-gray-400'
                            }
                            title={segment.altitudeTrend ? (segment.altitudeTrend.charAt(0).toUpperCase() + segment.altitudeTrend.slice(1)) : 'No trend'}
                          >
                            {segment.altitudeTrend === 'climb' ? '↗' : segment.altitudeTrend === 'descent' ? '↘' : '→'}
                          </span>
                        {altitudeWarnings[segment.id] && (
                          <div className="text-xs text-red-600 mt-1" title={altitudeWarnings[segment.id]}>
                            ⚠️
                          </div>
                        )}
                        </div>
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'tempDeviation', segment.tempDeviation)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'machNo', segment.machNo)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'tas', segment.tas)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'track', segment.track)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'wind', segment.wind, 'text')}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'windComponent', segment.windComponent)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'groundSpeed', segment.groundSpeed)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'distance', segment.distance)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'estimatedTimeInterval', Math.round(segment.estimatedTimeInterval))}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'airDistance', segment.airDistance)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'fuelFlow', segment.fuelFlow)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'zoneFuel', segment.zoneFuel)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'startZoneWeight', segment.startZoneWeight)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'emzw', segment.emzw)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'endZoneWeight', segment.endZoneWeight)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'planFuelRemaining', segment.planFuelRemaining)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'actualFuelRemaining', segment.actualFuelRemaining)}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'planEstimate', segment.planEstimate, 'text')}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {renderEditableCell(segment.id, 'actualTimeArrival', segment.actualTimeArrival, 'text')}
                      </td>
                      <td style={{
                        padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.gray[200]}`
                      }}>
                        {segments.length > 1 && (
                          <button
                            onClick={() => removeSegment(segment.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="Remove segment"
                          >
                            ✕
                          </button>
                        )}
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
      </div>

      {showFlHint && (
        <div className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
          Double‑click FL to set climb/descent arrow. <button className="underline" onClick={() => { 
            try { 
              window.localStorage.setItem('fp_hint_fl_trend_seen', '1'); 
            } catch (storageError) { 
              console.warn('Could not save hint state:', storageError);
            }
            setShowFlHint(false); 
          }}>Got it</button>
        </div>
      )}
    </div>
  );
};

export default FlightPlanTable;