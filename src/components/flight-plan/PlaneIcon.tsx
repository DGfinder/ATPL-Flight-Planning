import React from 'react';

interface PlaneIconProps {
  cx?: number;
  cy?: number;
  payload?: any;
  r?: number;
}

export const PlaneIcon: React.FC<PlaneIconProps> = ({ cx = 0, cy = 0, r = 6 }) => {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Plane body */}
      <ellipse
        cx={0}
        cy={0}
        rx={r * 0.8}
        ry={r * 0.3}
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth={1}
      />
      {/* Wings */}
      <path
        d={`M ${-r * 0.6} ${-r * 0.2} L ${-r * 1.2} ${-r * 0.1} L ${-r * 1.2} ${r * 0.1} L ${-r * 0.6} ${r * 0.2} Z`}
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth={1}
      />
      {/* Tail */}
      <path
        d={`M ${r * 0.6} ${-r * 0.1} L ${r * 1.0} ${-r * 0.3} L ${r * 1.0} ${r * 0.3} L ${r * 0.6} ${r * 0.1} Z`}
        fill="#1e40af"
        stroke="#1e3a8a"
        strokeWidth={1}
      />
      {/* Cockpit */}
      <circle
        cx={-r * 0.3}
        cy={0}
        r={r * 0.15}
        fill="#ffffff"
        stroke="#1e3a8a"
        strokeWidth={0.5}
      />
    </g>
  );
};

export default PlaneIcon;
