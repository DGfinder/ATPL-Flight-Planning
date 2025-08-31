import React from 'react';

interface LegendPopoverProps {
  onClose: () => void;
}

const LegendPopover: React.FC<LegendPopoverProps> = ({ onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-[34rem] z-50">
      <div className="aviation-card p-4 text-sm shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-aviation-primary">Flight Plan Legend</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-gray-700">
          <div>
            <div className="font-medium mb-1">Basic</div>
            SEG=Segment, FL=Flight Level, TEMP T/DEV=Temperature Deviation, MACH NO=Mach Number
          </div>
          <div>
            <div className="font-medium mb-1">Speed/Track</div>
            TAS=True Airspeed (kt), TR=Track (°), WIND=Wind Vector, WC=Wind Component (kt)
          </div>
          <div>
            <div className="font-medium mb-1">Navigation</div>
            GS=Ground Speed (kt), DIST=Distance (nm), ETI=Est Time Interval (min), AIR DIST=Air Distance
          </div>
          <div>
            <div className="font-medium mb-1">Fuel/Weight</div>
            EMZW=Est Mid Zone Weight, PLAN EST=Planned Estimate, ATA=Actual Time Arrival
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          * Manual entry for learning: GS, ETI, EMZW, END ZONE WT<br/>
          * Students can practice calculations and learn from mistakes<br/>
          * E6B calculations use proper trigonometry (sin/cos) for wind triangles
        </div>
      </div>
    </div>
  );
};

export default LegendPopover;


