import React, { useState, useCallback } from 'react';
import type { FlightPlanSegment } from '../../types';
import { AviationCalculations } from '../../utils/aviationCalculations';
import { databaseService } from '../../services/database';

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

  return (
    <div className="aviation-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-aviation-primary">Interactive Flight Planning Sheet</h3>
        <div className="space-x-2">
          <button 
            className="aviation-button-secondary text-sm"
            onClick={addSegment}
          >
            Add Segment
          </button>
          <button
            className="aviation-button-secondary text-sm"
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
          >
            Suggest Altitude
          </button>
          <button
            className="text-sm text-aviation-primary hover:underline"
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
          >
            Export CSV
          </button>
        </div>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>Learning Mode:</strong> GS (Ground Speed), ETI (Time), EMZW (Mid-Zone Weight), and END ZONE WT are manually editable. 
          Practice your calculations and learn from mistakes!
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse border-2 border-gray-800">
          <thead>
            <tr className="bg-aviation-primary text-white text-center font-bold">
              <th className="border border-gray-800 px-2 py-3 w-12">SEG</th>
              <th className="border border-gray-800 px-2 py-3 w-10">FL</th>
              <th className="border border-gray-800 px-2 py-3 w-12">TEMP T/DEV</th>
              <th className="border border-gray-800 px-2 py-3 w-12">MACH NO</th>
              <th className="border border-gray-800 px-2 py-3 w-10">TAS</th>
              <th className="border border-gray-800 px-2 py-3 w-10">TR</th>
              <th className="border border-gray-800 px-2 py-3 w-14">WIND</th>
              <th className="border border-gray-800 px-2 py-3 w-10">WC</th>
              <th className="border border-gray-800 px-2 py-3 w-10">GS</th>
              <th className="border border-gray-800 px-2 py-3 w-10">DIST</th>
              <th className="border border-gray-800 px-2 py-3 w-10">ETI</th>
              <th className="border border-gray-800 px-2 py-3 w-12">AIR DIST</th>
              <th className="border border-gray-800 px-2 py-3 w-12">FUEL FLOW</th>
              <th className="border border-gray-800 px-2 py-3 w-12">ZONE FUEL</th>
              <th className="border border-gray-800 px-2 py-3 w-14">START ZONE WT</th>
              <th className="border border-gray-800 px-2 py-3 w-10">EMZW</th>
              <th className="border border-gray-800 px-2 py-3 w-14">END ZONE WT</th>
              <th className="border border-gray-800 px-2 py-3 w-14">PLAN FUEL REM</th>
              <th className="border border-gray-800 px-2 py-3 w-14">ACT FUEL REM</th>
              <th className="border border-gray-800 px-2 py-3 w-12">PLAN EST</th>
              <th className="border border-gray-800 px-2 py-3 w-10">ATA</th>
              <th className="border border-gray-800 px-2 py-3 w-8">✕</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment.id} className="hover:bg-gray-50">
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'segment', segment.segment, 'text')}
                </td>
                <td className={`border border-gray-800 p-2 ${altitudeWarnings[segment.id] ? 'bg-red-100' : ''}`}>
                  <div className="flex items-center gap-2">
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
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'tempDeviation', segment.tempDeviation)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'machNo', segment.machNo)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'tas', segment.tas)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'track', segment.track)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'wind', segment.wind, 'text')}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'windComponent', segment.windComponent)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'groundSpeed', segment.groundSpeed)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'distance', segment.distance)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'estimatedTimeInterval', Math.round(segment.estimatedTimeInterval))}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'airDistance', segment.airDistance)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'fuelFlow', segment.fuelFlow)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'zoneFuel', segment.zoneFuel)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'startZoneWeight', segment.startZoneWeight)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'emzw', segment.emzw)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'endZoneWeight', segment.endZoneWeight)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'planFuelRemaining', segment.planFuelRemaining)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'actualFuelRemaining', segment.actualFuelRemaining)}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'planEstimate', segment.planEstimate, 'text')}
                </td>
                <td className="border border-gray-800 p-2">
                  {renderEditableCell(segment.id, 'actualTimeArrival', segment.actualTimeArrival, 'text')}
                </td>
                <td className="border border-gray-800 p-2 text-center">
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
            <tr className="bg-gray-200 font-bold border-2 border-gray-800">
              <td className="border border-gray-800 px-2 py-3 text-center font-bold" colSpan={10}>
                TOTALS
              </td>
              <td className="border border-gray-800 px-2 py-3 text-center font-bold">
                {totals.distance.toFixed(0)}
              </td>
              <td className="border border-gray-800 px-2 py-3 text-center font-bold">
                {Math.round(totals.time)}
              </td>
              <td className="border border-gray-800 px-2 py-2" colSpan={2}></td>
              <td className="border border-gray-800 px-2 py-3 text-center font-bold">
                {totals.fuel.toFixed(0)}
              </td>
              <td className="border border-gray-800 px-2 py-2" colSpan={7}></td>
            </tr>
          </tbody>
        </table>
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