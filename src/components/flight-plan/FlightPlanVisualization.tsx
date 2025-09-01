import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Plane, Gauge, Clock, Fuel, Navigation, AlertCircle } from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  SecondaryButton,
  useDesignSystem 
} from '../../design-system';

interface Waypoint {
  id: number;
  code: string;
  lat: number;
  lon: number;
  altitude: number;
  time: string;
  fuel: number;
}

interface Airport {
  code: string;
  name: string;
  lat: number;
  lon: number;
  elevation: number;
}

interface FlightPlanData {
  departure: Airport;
  arrival: Airport;
  waypoints: Waypoint[];
  alternates: Airport[];
  plannedAltitude: number;
  distance: number;
  estimatedTime: string;
  fuelRequired: number;
  winds: { direction: number; speed: number };
}

interface FlightPlanVisualizationProps {
  flightPlan?: FlightPlanData;
  className?: string;
}

const FlightPlanVisualization: React.FC<FlightPlanVisualizationProps> = ({ 
  flightPlan: propFlightPlan
}) => {
  const { colors, spacing, styles } = useDesignSystem();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | 'profile'>('2d');

  // Default flight plan data if none provided
  const defaultFlightPlan: FlightPlanData = {
    departure: { code: 'YSSY', name: 'Sydney', lat: -33.9461, lon: 151.1772, elevation: 21 },
    arrival: { code: 'YPPH', name: 'Perth', lat: -31.9403, lon: 115.9672, elevation: 67 },
    waypoints: [
      { id: 1, code: 'KADOM', lat: -33.8, lon: 150.5, altitude: 10000, time: '00:15', fuel: 2500 },
      { id: 2, code: 'ODALE', lat: -33.5, lon: 148.0, altitude: 25000, time: '00:45', fuel: 5200 },
      { id: 3, code: 'AKLER', lat: -33.0, lon: 142.0, altitude: 37000, time: '01:30', fuel: 8100 },
      { id: 4, code: 'BEVLY', lat: -32.5, lon: 135.0, altitude: 37000, time: '02:15', fuel: 11000 },
      { id: 5, code: 'JULIA', lat: -32.0, lon: 125.0, altitude: 35000, time: '03:00', fuel: 13500 },
      { id: 6, code: 'KEELS', lat: -31.95, lon: 118.0, altitude: 20000, time: '03:30', fuel: 15200 },
    ],
    alternates: [
      { code: 'YPKG', name: 'Kalgoorlie', lat: -30.7847, lon: 121.4619, elevation: 1234 }
    ],
    plannedAltitude: 37000,
    distance: 2042,
    estimatedTime: '04:05',
    fuelRequired: 16800,
    winds: { direction: 270, speed: 45 }
  };

  const flightPlan = propFlightPlan || defaultFlightPlan;

  // Draw 2D route map
  useEffect(() => {
    if (viewMode !== '2d' || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;
    
    svg.attr('width', width).attr('height', height);

    // Create projection for Australia
    const projection = d3.geoMercator()
      .center([135, -32])
      .scale(width * 0.35)
      .translate([width / 2, height / 2]);

    // Draw background
    const g = svg.append('g');
    
    // Grid lines
    const gridLines = g.append('g').attr('class', 'grid');
    for (let i = 0; i <= 10; i++) {
      gridLines.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (height / 10) * i)
        .attr('y2', (height / 10) * i)
        .attr('stroke', colors.gray[200])
        .attr('stroke-width', 0.5);
        
      gridLines.append('line')
        .attr('x1', (width / 10) * i)
        .attr('x2', (width / 10) * i)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.gray[200])
        .attr('stroke-width', 0.5);
    }

    // Prepare route points
    const routePoints = [
      flightPlan.departure,
      ...flightPlan.waypoints,
      flightPlan.arrival
    ].map(point => projection([point.lon, point.lat])).filter((point): point is [number, number] => point !== null);

    // Draw route line with gradient
    const line = d3.line<[number, number]>()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveCardinal.tension(0.5));

    // Create gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'route-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('style', `stop-color:${colors.aviation.primary};stop-opacity:1`);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('style', `stop-color:${colors.aviation.secondary};stop-opacity:1`);

    // Draw route shadow
    g.append('path')
      .datum(routePoints)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', colors.gray[900])
      .attr('stroke-width', 4)
      .attr('opacity', 0.1)
      .attr('transform', 'translate(2, 2)');

    // Draw main route
    g.append('path')
      .datum(routePoints)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'url(#route-gradient)')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', function() {
        return this.getTotalLength();
      })
      .attr('stroke-dashoffset', function() {
        return this.getTotalLength();
      })
      .transition()
      .duration(2000)
      .attr('stroke-dashoffset', 0);

    // Draw waypoints
    flightPlan.waypoints.forEach((waypoint, i) => {
      const coords = projection([waypoint.lon, waypoint.lat]);
      if (!coords) return; // Skip if projection fails
      const [x, y] = coords;
      
      const waypointG = g.append('g')
        .attr('class', 'waypoint')
        .style('cursor', 'pointer')
        .on('click', () => setSelectedWaypoint(waypoint));

      // Waypoint circle
      waypointG.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', colors.white)
        .attr('stroke', colors.aviation.primary)
        .attr('stroke-width', 2)
        .transition()
        .delay(500 + i * 200)
        .duration(300)
        .attr('r', 5);

      // Waypoint label
      waypointG.append('text')
        .attr('x', x)
        .attr('y', y - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .attr('fill', colors.aviation.navy)
        .attr('opacity', 0)
        .text(waypoint.code)
        .transition()
        .delay(500 + i * 200)
        .duration(300)
        .attr('opacity', 1);
    });

    // Draw airports
    const airports = [
      { ...flightPlan.departure, type: 'departure' },
      { ...flightPlan.arrival, type: 'arrival' }
    ];

    airports.forEach((airport, i) => {
      const coords = projection([airport.lon, airport.lat]);
      if (!coords) return; // Skip if projection fails
      const [x, y] = coords;
      
      const airportG = g.append('g');

      // Airport icon background
      airportG.append('rect')
        .attr('x', x - 20)
        .attr('y', y - 10)
        .attr('width', 40)
        .attr('height', 20)
        .attr('rx', 10)
        .attr('fill', airport.type === 'departure' ? colors.aviation.secondary : colors.aviation.navy)
        .attr('opacity', 0)
        .transition()
        .delay(i * 1000)
        .duration(500)
        .attr('opacity', 1);

      // Airport code
      airportG.append('text')
        .attr('x', x)
        .attr('y', y + 4)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', colors.white)
        .attr('opacity', 0)
        .text(airport.code)
        .transition()
        .delay(i * 1000)
        .duration(500)
        .attr('opacity', 1);

      // Airport name
      airportG.append('text')
        .attr('x', x)
        .attr('y', y + 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', colors.aviation.muted)
        .text(airport.name);
    });

    // Draw wind indicator
    const windG = g.append('g')
      .attr('transform', `translate(${width - 60}, 30)`);
    
    windG.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 25)
      .attr('fill', colors.white)
      .attr('stroke', colors.gray[200])
      .attr('stroke-width', 1);

    // Wind arrow
    const windAngle = (flightPlan.winds.direction - 90) * Math.PI / 180;
    windG.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', Math.cos(windAngle) * 20)
      .attr('y2', Math.sin(windAngle) * 20)
      .attr('stroke', colors.aviation.primary)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', colors.aviation.primary);

    windG.append('text')
      .attr('x', 0)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', colors.aviation.muted)
      .text(`${flightPlan.winds.speed}kt`);

  }, [viewMode, flightPlan, colors]);

  // Draw altitude profile
  useEffect(() => {
    if (viewMode !== 'profile' || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    
    svg.attr('width', width).attr('height', height);

    // Prepare data
    const profileData = [
      { distance: 0, altitude: flightPlan.departure.elevation, point: flightPlan.departure.code },
      { distance: 100, altitude: 10000, point: 'KADOM' },
      { distance: 300, altitude: 25000, point: 'ODALE' },
      { distance: 600, altitude: 37000, point: 'AKLER' },
      { distance: 1000, altitude: 37000, point: 'BEVLY' },
      { distance: 1500, altitude: 35000, point: 'JULIA' },
      { distance: 1900, altitude: 20000, point: 'KEELS' },
      { distance: flightPlan.distance, altitude: flightPlan.arrival.elevation, point: flightPlan.arrival.code }
    ];

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, flightPlan.distance])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, 40000])
      .range([height - margin.bottom, margin.top]);

    // Area generator
    const area = d3.area<{ distance: number; altitude: number; point: string }>()
      .x(d => xScale(d.distance))
      .y0(height - margin.bottom)
      .y1(d => yScale(d.altitude))
      .curve(d3.curveCardinal.tension(0.5));

    // Line generator
    const line = d3.line<{ distance: number; altitude: number; point: string }>()
      .x(d => xScale(d.distance))
      .y(d => yScale(d.altitude))
      .curve(d3.curveCardinal.tension(0.5));

    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'altitude-gradient')
      .attr('x1', '0%')
      .attr('x2', '0%')
      .attr('y1', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('style', `stop-color:${colors.aviation.primary};stop-opacity:0.8`);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('style', `stop-color:${colors.aviation.primary};stop-opacity:0.1`);

    // Draw area
    svg.append('path')
      .datum(profileData)
      .attr('d', area)
      .attr('fill', 'url(#altitude-gradient)');

    // Draw line
    svg.append('path')
      .datum(profileData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', colors.aviation.primary)
      .attr('stroke-width', 2);

    // Draw points
    svg.selectAll('.point')
      .data(profileData)
      .enter().append('circle')
      .attr('cx', d => xScale(d.distance))
      .attr('cy', d => yScale(d.altitude))
      .attr('r', 4)
      .attr('fill', colors.white)
      .attr('stroke', colors.aviation.primary)
      .attr('stroke-width', 2);

    // Labels
    svg.selectAll('.label')
      .data(profileData)
      .enter().append('text')
      .attr('x', d => xScale(d.distance))
      .attr('y', d => yScale(d.altitude) - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('fill', colors.aviation.navy)
      .text(d => d.point);

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d) => `${d}nm`);
    
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d) => `FL${Number(d)/100}`);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis);

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis);

  }, [viewMode, flightPlan, colors]);

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.scale[4]
  };

  const titleStyle: React.CSSProperties = {
    ...styles.heading,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[2]
  };

  const subtitleStyle: React.CSSProperties = {
    ...styles.caption,
    marginTop: spacing.scale[1]
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: spacing.scale[2]
  };

  const metricsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.scale[4]
  };

  const metricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.scale[3]
  };

  const iconWrapperStyle: React.CSSProperties = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: spacing.radius.lg,
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

  const waypointAlertStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.scale[2],
    padding: spacing.scale[4],
    background: colors.withOpacity(colors.aviation.primary, 0.05),
    border: `1px solid ${colors.withOpacity(colors.aviation.primary, 0.2)}`,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing.scale[6]
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: `${spacing.scale[3]} ${spacing.scale[6]}`,
    textAlign: 'left',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: colors.aviation.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: colors.gray[50],
    borderBottom: `1px solid ${colors.gray[200]}`
  };

  const tableCellStyle: React.CSSProperties = {
    padding: `${spacing.scale[4]} ${spacing.scale[6]}`,
    fontSize: '0.875rem',
    borderBottom: `1px solid ${colors.gray[200]}`
  };

  const waypointDotStyle = (type: 'departure' | 'waypoint' | 'arrival'): React.CSSProperties => ({
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    background: type === 'departure' ? colors.aviation.secondary : 
                type === 'arrival' ? colors.aviation.navy : colors.aviation.primary
  });

  return (
    <div style={{ padding: spacing.scale[6] }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
          <div style={headerStyle}>
            <div>
              <h1 style={titleStyle}>
                <Plane style={{ width: '1.5rem', height: '1.5rem', color: colors.aviation.primary }} />
                Flight Plan Visualization
              </h1>
              <p style={subtitleStyle}>
                {flightPlan.departure.code} → {flightPlan.arrival.code} | Boeing 737-800
              </p>
            </div>
            <div style={buttonGroupStyle}>
              <SecondaryButton
                onClick={() => setViewMode('2d')}
                style={{
                  background: viewMode === '2d' ? colors.aviation.primary : colors.gray[100],
                  color: viewMode === '2d' ? colors.white : colors.aviation.navy
                }}
              >
                2D Route
              </SecondaryButton>
              <SecondaryButton
                onClick={() => setViewMode('profile')}
                style={{
                  background: viewMode === 'profile' ? colors.aviation.primary : colors.gray[100],
                  color: viewMode === 'profile' ? colors.white : colors.aviation.navy
                }}
              >
                Altitude Profile
              </SecondaryButton>
            </div>
          </div>

          {/* Key Metrics */}
          <div style={metricsGridStyle}>
            <div style={metricStyle}>
              <div style={iconWrapperStyle}>
                <Navigation style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Distance</p>
                <p style={metricValueStyle}>{flightPlan.distance} nm</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={{ ...iconWrapperStyle, background: colors.withOpacity(colors.aviation.secondary, 0.1) }}>
                <Clock style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.secondary }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Flight Time</p>
                <p style={metricValueStyle}>{flightPlan.estimatedTime}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={{ ...iconWrapperStyle, background: colors.withOpacity(colors.aviation.navy, 0.1) }}>
                <Gauge style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.navy }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Cruise Alt</p>
                <p style={metricValueStyle}>FL{flightPlan.plannedAltitude/100}</p>
              </div>
            </div>
            <div style={metricStyle}>
              <div style={{ ...iconWrapperStyle, background: colors.withOpacity(colors.aviation.muted, 0.1) }}>
                <Fuel style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.muted }} />
              </div>
              <div style={metricTextStyle}>
                <p style={metricLabelStyle}>Fuel Required</p>
                <p style={metricValueStyle}>{flightPlan.fuelRequired} kg</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Visualization */}
        <Card variant="default" padding="lg" style={{ marginBottom: spacing.scale[6] }}>
          <svg ref={svgRef} style={{ width: '100%' }}></svg>
        </Card>

        {/* Waypoint Details */}
        {selectedWaypoint && (
          <div style={waypointAlertStyle}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', color: colors.aviation.primary, marginTop: '0.125rem' }} />
            <div>
              <p style={{ fontWeight: 600, color: colors.aviation.primary }}>
                Waypoint: {selectedWaypoint.code}
              </p>
              <p style={{ fontSize: '0.875rem', color: colors.aviation.primary }}>
                Altitude: FL{selectedWaypoint.altitude/100} | 
                Time: {selectedWaypoint.time} | 
                Fuel: {selectedWaypoint.fuel} kg
              </p>
            </div>
          </div>
        )}

        {/* Waypoints Table */}
        <Card variant="default">
          <CardHeader title="Route Waypoints" />
          <CardContent style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Waypoint</th>
                    <th style={tableHeaderStyle}>Coordinates</th>
                    <th style={tableHeaderStyle}>Altitude</th>
                    <th style={tableHeaderStyle}>ETA</th>
                    <th style={tableHeaderStyle}>Fuel</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray[50]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
                        <div style={waypointDotStyle('departure')}></div>
                        <span style={{ fontWeight: 500, color: colors.aviation.navy }}>
                          {flightPlan.departure.code}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.departure.lat.toFixed(2)}, {flightPlan.departure.lon.toFixed(2)}
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.departure.elevation} ft
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>00:00</td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>0 kg</td>
                  </tr>
                  {flightPlan.waypoints.map((waypoint) => (
                    <tr key={waypoint.id} style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray[50]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={tableCellStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
                          <div style={waypointDotStyle('waypoint')}></div>
                          <span style={{ fontWeight: 500, color: colors.aviation.navy }}>
                            {waypoint.code}
                          </span>
                        </div>
                      </td>
                      <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                        {waypoint.lat.toFixed(2)}, {waypoint.lon.toFixed(2)}
                      </td>
                      <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                        FL{waypoint.altitude/100}
                      </td>
                      <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                        {waypoint.time}
                      </td>
                      <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                        {waypoint.fuel} kg
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.gray[50]}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={tableCellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.scale[2] }}>
                        <div style={waypointDotStyle('arrival')}></div>
                        <span style={{ fontWeight: 500, color: colors.aviation.navy }}>
                          {flightPlan.arrival.code}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.arrival.lat.toFixed(2)}, {flightPlan.arrival.lon.toFixed(2)}
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.arrival.elevation} ft
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.estimatedTime}
                    </td>
                    <td style={{ ...tableCellStyle, color: colors.aviation.muted }}>
                      {flightPlan.fuelRequired} kg
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlightPlanVisualization;
