import React, { useEffect, useMemo, useState } from 'react';
import { AviationCalculations } from '../../utils/aviationCalculations';

interface E6BProps {
  onClose: () => void;
}

const clamp360 = (v: number) => ((v % 360) + 360) % 360;

const E6B: React.FC<E6BProps> = ({ onClose }) => {
  const [tas, setTAS] = useState<number>(450);
  const [track, setTrack] = useState<number>(90);
  const [windDir, setWindDir] = useState<number>(270);
  const [windSpeed, setWindSpeed] = useState<number>(40);

  const res = useMemo(() => AviationCalculations.windTriangle(tas, track, windDir, windSpeed), [tas, track, windDir, windSpeed]);

  // Simple animation for pointer transitions (CSS transition on transform)
  const needleStyle = { transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)' } as React.CSSProperties;

  useEffect(() => {
    // normalize input
    setTrack(t => clamp360(t));
    setWindDir(d => clamp360(d));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 fade-in" role="dialog" aria-modal="true" aria-label="E6B">
      <div className="aviation-card w-[820px] max-w-[95vw] p-6 scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>E6B Wind Triangle</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <div className="mb-1 text-gray-600">TAS (kt)</div>
                <input type="number" className="aviation-input w-full" value={tas} onChange={e => setTAS(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-gray-600">Track (°)</div>
                <input type="number" className="aviation-input w-full" value={track} onChange={e => setTrack(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-gray-600">Wind Dir (° from)</div>
                <input type="number" className="aviation-input w-full" value={windDir} onChange={e => setWindDir(parseFloat(e.target.value) || 0)} />
              </label>
              <label className="text-sm">
                <div className="mb-1 text-gray-600">Wind Spd (kt)</div>
                <input type="number" className="aviation-input w-full" value={windSpeed} onChange={e => setWindSpeed(parseFloat(e.target.value) || 0)} />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="aviation-card p-3">
                <div className="text-xs text-gray-500">Ground Speed</div>
                <div className="text-lg font-bold text-aviation-primary">{res.groundSpeed}</div>
              </div>
              <div className="aviation-card p-3">
                <div className="text-xs text-gray-500">Headwind</div>
                <div className="text-lg font-bold text-aviation-primary">{res.headwindComponent}</div>
              </div>
              <div className="aviation-card p-3">
                <div className="text-xs text-gray-500">X-Wind</div>
                <div className="text-lg font-bold text-aviation-primary">{res.crosswindComponent}</div>
              </div>
            </div>
          </div>

          {/* Animated Wind Triangle */}
          <div className="flex items-center justify-center">
            <svg width="360" height="360" viewBox="0 0 360 360">
              {/* Circle compass */}
              <defs>
                <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0A2A66" />
                  <stop offset="100%" stopColor="#0056D6" />
                </linearGradient>
              </defs>
              <circle cx="180" cy="180" r="160" fill="url(#ring)" opacity="0.08" />
              <circle cx="180" cy="180" r="140" fill="none" stroke="#94a3b8" strokeDasharray="4 6" />
              {/* Cardinal marks */}
              {[0, 90, 180, 270].map((deg) => (
                <g key={deg} transform={`rotate(${deg} 180 180)`}>
                  <rect x="179" y="20" width="2" height="14" fill="#64748b" />
                </g>
              ))}

              {/* Track needle */}
              <g style={needleStyle} transform={`rotate(${track} 180 180)`}>
                <line x1="180" y1="180" x2="180" y2="40" stroke="#10b981" strokeWidth="4" />
                <polygon points="180,28 174,42 186,42" fill="#10b981" />
              </g>

              {/* Wind needle (from) */}
              <g style={needleStyle} transform={`rotate(${windDir} 180 180)`}>
                <line x1="180" y1="180" x2="180" y2="60" stroke="#ef4444" strokeWidth="4" />
                <polygon points="180,48 174,62 186,62" fill="#ef4444" />
              </g>

              {/* Resultant ground vector (approx using correction) */}
              <g style={needleStyle} transform={`rotate(${track + res.trackCorrection} 180 180)`}>
                <line x1="180" y1="180" x2="180" y2="36" stroke="#2563eb" strokeWidth="4" />
                <polygon points="180,24 174,38 186,38" fill="#2563eb" />
              </g>
            </svg>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
          <div>
            Triangle shows Track (green), Wind (red, from), and Resultant (blue). Enter TAS, TRK, W/V to see GS, headwind and crosswind.
          </div>
          <button className="aviation-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default E6B;


