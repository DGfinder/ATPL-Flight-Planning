export interface WindTriangleResult {
  groundSpeed: number;
  trackCorrection: number;
  headwindComponent: number;
  crosswindComponent: number;
}

export class AviationCalculations {
  static readonly SPEED_OF_SOUND_SL = 661.5; // knots at sea level, ISA
  
  // SAR (Specific Air Range) values by Mach number from course notes
  static readonly SAR_VALUES: Record<string, number> = {
    '0.79': 9.5,
    '0.80': 9.5,
    '0.82': 10.0,
    '0.84': 10.3
  };
  
  // B727 POH Fuel Flow Data (kg/hr) by weight and conditions
  static readonly B727_FUEL_FLOW: Record<number, Record<string, number>> = {
    50000: { 'M0.79': 3200, 'M0.80': 3300, 'M0.82': 3500, 'M0.84': 3700, 'LRC': 3100 },
    55000: { 'M0.79': 3400, 'M0.80': 3500, 'M0.82': 3700, 'M0.84': 3900, 'LRC': 3300 },
    60000: { 'M0.79': 3600, 'M0.80': 3700, 'M0.82': 3900, 'M0.84': 4100, 'LRC': 3500 },
    65000: { 'M0.79': 3800, 'M0.80': 3900, 'M0.82': 4100, 'M0.84': 4300, 'LRC': 3700 },
    70000: { 'M0.79': 4000, 'M0.80': 4100, 'M0.82': 4300, 'M0.84': 4500, 'LRC': 3900 },
    75000: { 'M0.79': 4200, 'M0.80': 4300, 'M0.82': 4500, 'M0.84': 4700, 'LRC': 4100 },
    80000: { 'M0.79': 4400, 'M0.80': 4500, 'M0.82': 4700, 'M0.84': 4900, 'LRC': 4300 }
  };
  
  static readonly WEIGHT_BRACKETS = [50000, 55000, 60000, 65000, 70000, 75000, 80000];

  static windTriangle(
    trueAirspeed: number,
    track: number,
    windDirection: number, 
    windSpeed: number
  ): WindTriangleResult {
    const trackRad = (track * Math.PI) / 180;
    const windDirRad = (windDirection * Math.PI) / 180;
    
    const windVector = {
      x: windSpeed * Math.sin(windDirRad),
      y: windSpeed * Math.cos(windDirRad)
    };
    
    const airVector = {
      x: trueAirspeed * Math.sin(trackRad),
      y: trueAirspeed * Math.cos(trackRad)
    };
    
    const groundVector = {
      x: airVector.x + windVector.x,
      y: airVector.y + windVector.y
    };
    
    const groundSpeed = Math.sqrt(groundVector.x ** 2 + groundVector.y ** 2);
    const actualTrack = Math.atan2(groundVector.x, groundVector.y) * 180 / Math.PI;
    const trackCorrection = actualTrack - track;
    
    const headwindComponent = -windSpeed * Math.cos((windDirection - track) * Math.PI / 180);
    const crosswindComponent = windSpeed * Math.sin((windDirection - track) * Math.PI / 180);
    
    return {
      groundSpeed: Math.round(groundSpeed * 10) / 10,
      trackCorrection: Math.round(trackCorrection * 10) / 10,
      headwindComponent: Math.round(headwindComponent * 10) / 10,
      crosswindComponent: Math.round(crosswindComponent * 10) / 10
    };
  }

  static calculateETAS(tas: number, windDirection: number, windSpeed: number, track: number): number {
    const windAngle = Math.abs(windDirection - track);
    const windAngleRad = (windAngle * Math.PI) / 180;
    const headwindComponent = windSpeed * Math.cos(windAngleRad);
    return tas - headwindComponent;
  }

  static speedOfSoundAtAltitude(altitude: number, tempDeviation: number = 0): number {
    const tempAtAltitude = 15 - (1.98 * altitude / 1000) + tempDeviation;
    const tempKelvin = tempAtAltitude + 273.15;
    return 39 * Math.sqrt(tempKelvin);
  }

  static getSAR(machNumber: number): number {
    const machKey = machNumber.toFixed(2);
    return this.SAR_VALUES[machKey] || 9.5; // Default to 9.5 if not found
  }
  
  static calculateSGR(machNumber: number, windComponent: number): number {
    const sar = this.getSAR(machNumber);
    const windAdjustment = windComponent * 0.02;
    // Add for headwind (negative wind component), subtract for tailwind (positive)
    return sar - windAdjustment;
  }
  
  static calculateEMZW(startZoneWeight: number, distance: number, machNumber: number, windComponent: number): number {
    const sgr = this.calculateSGR(machNumber, windComponent);
    const fuelBurned = (distance * sgr) / 2;
    return Math.round(startZoneWeight - fuelBurned);
  }

  static calculateZoneFuel(fuelFlow: number, timeInterval: number): number {
    return Math.round((fuelFlow * timeInterval) / 60);
  }

  static calculateFuelRemaining(currentFuel: number, zoneFuel: number): number {
    return Math.round(currentFuel - zoneFuel);
  }

  static formatTime(minutes: number): string {
    return minutes.toFixed(1);
  }

  static getWeightBracket(weight: number): number {
    // Round up to next 1000kg increment for POH lookup
    for (const bracket of this.WEIGHT_BRACKETS) {
      if (weight <= bracket) {
        return bracket;
      }
    }
    return this.WEIGHT_BRACKETS[this.WEIGHT_BRACKETS.length - 1];
  }
  
  static getFuelFlow(weight: number, machNumber: number, isaDeviation: number = 0): number {
    const weightBracket = this.getWeightBracket(weight);
    const machKey = `M${machNumber.toFixed(2)}`;
    
    let baseFuelFlow = this.B727_FUEL_FLOW[weightBracket]?.[machKey];
    if (!baseFuelFlow) {
      baseFuelFlow = this.B727_FUEL_FLOW[weightBracket]?.['LRC'] || 3500;
    }
    
    // Adjust for ISA deviation (1% per 3°C as per course notes)
    const tempAdjustment = 1 + (isaDeviation / 3) * 0.01;
    return Math.round(baseFuelFlow * tempAdjustment);
  }
  
  static validateEMZW(
    startZoneWeight: number, 
    distance: number, 
    machNumber: number, 
    windComponent: number,
    timeInterval: number,
    isaDeviation: number = 0
  ): { emzw: number; zoneFuel: number; fuelFlow: number; endZoneWeight: number } {
    let currentEMZW = this.calculateEMZW(startZoneWeight, distance, machNumber, windComponent);
    let iterations = 0;
    const maxIterations = 5;
    
    while (iterations < maxIterations) {
      const fuelFlow = this.getFuelFlow(currentEMZW, machNumber, isaDeviation);
      const zoneFuel = this.calculateZoneFuel(fuelFlow, timeInterval);
      const actualEMZW = startZoneWeight - zoneFuel;
      const endZoneWeight = actualEMZW - zoneFuel;
      
      // Check if actual EMZW falls within the weight bracket used
      const usedBracket = this.getWeightBracket(currentEMZW);
      const lowerBracket = this.WEIGHT_BRACKETS[this.WEIGHT_BRACKETS.indexOf(usedBracket) - 1] || 0;
      
      if (actualEMZW >= lowerBracket && actualEMZW <= usedBracket) {
        // EMZW is valid for this weight bracket
        return {
          emzw: actualEMZW,
          zoneFuel,
          fuelFlow,
          endZoneWeight
        };
      }
      
      // Use the actual EMZW for next iteration
      currentEMZW = actualEMZW;
      iterations++;
    }
    
    // Fallback after max iterations
    const fuelFlow = this.getFuelFlow(currentEMZW, machNumber, isaDeviation);
    const zoneFuel = this.calculateZoneFuel(fuelFlow, timeInterval);
    return {
      emzw: currentEMZW,
      zoneFuel,
      fuelFlow,
      endZoneWeight: currentEMZW - zoneFuel
    };
  }

  static parseWindString(windString: string): { direction: number; speed: number } | null {
    // Parse formats like "27035" (270° at 35kt) or "270/35"
    const match1 = windString.match(/^(\d{3})(\d{2,3})$/);
    const match2 = windString.match(/^(\d{3})\/(\d{2,3})$/);
    
    if (match1) {
      return {
        direction: parseInt(match1[1]),
        speed: parseInt(match1[2])
      };
    } else if (match2) {
      return {
        direction: parseInt(match2[1]),
        speed: parseInt(match2[2])
      };
    }
    return null;
  }

  static calculateBackwardsEMZW(
    endZoneWeight: number,
    distance: number, 
    machNumber: number,
    windComponent: number,
    timeInterval: number,
    isaDeviation: number = 0
  ): { emzw: number; zoneFuel: number; fuelFlow: number; startZoneWeight: number } {
    // Work backwards from end zone weight
    let currentEMZW = endZoneWeight;
    let iterations = 0;
    const maxIterations = 5;
    
    while (iterations < maxIterations) {
      const fuelFlow = this.getFuelFlow(currentEMZW, machNumber, isaDeviation);
      const zoneFuel = this.calculateZoneFuel(fuelFlow, timeInterval);
      const calculatedStartWeight = currentEMZW + zoneFuel;
      
      // Calculate what EMZW should be from this start weight
      const sgr = this.calculateSGR(machNumber, windComponent);
      const expectedEMZW = calculatedStartWeight - ((distance * sgr) / 2);
      
      // Check if our EMZW is close enough to expected
      if (Math.abs(currentEMZW - expectedEMZW) < 50) {
        return {
          emzw: currentEMZW,
          zoneFuel,
          fuelFlow,
          startZoneWeight: calculatedStartWeight
        };
      }
      
      currentEMZW = expectedEMZW;
      iterations++;
    }
    
    // Fallback
    const fuelFlow = this.getFuelFlow(currentEMZW, machNumber, isaDeviation);
    const zoneFuel = this.calculateZoneFuel(fuelFlow, timeInterval);
    return {
      emzw: currentEMZW,
      zoneFuel,
      fuelFlow,
      startZoneWeight: currentEMZW + zoneFuel
    };
  }

  static machToTAS(mach: number, altitude: number, temperatureDeviation: number = 0): number {
    const tempRatio = (288.15 + temperatureDeviation - 0.0065 * altitude) / 288.15;
    const speedOfSound = this.SPEED_OF_SOUND_SL * Math.sqrt(tempRatio);
    return mach * speedOfSound;
  }

  static tasToMach(tas: number, altitude: number, temperatureDeviation: number = 0): number {
    const tempRatio = (288.15 + temperatureDeviation - 0.0065 * altitude) / 288.15;
    const speedOfSound = this.SPEED_OF_SOUND_SL * Math.sqrt(tempRatio);
    return tas / speedOfSound;
  }

  static iasToTAS(ias: number, altitude: number, temperatureDeviation: number = 0): number {
    const pressureRatio = Math.pow(1 - 0.0065 * altitude / 288.15, 5.256);
    const tempRatio = (288.15 + temperatureDeviation - 0.0065 * altitude) / 288.15;
    
    const cas = ias; // Assuming negligible instrument error at typical altitudes
    const tas = cas * Math.sqrt(tempRatio) / Math.sqrt(pressureRatio);
    
    return tas;
  }

  static fuelFlowRate(
    weight: number, 
    altitude: number, 
    mach: number,
    temperatureDeviation: number = 0
  ): number {
    const baseFlowRate = 0.85; // kg/kg/hr base specific fuel consumption
    const altitudeFactor = 1 - (altitude * 0.00001);
    const machFactor = 1 + (mach - 0.78) * 0.15;
    const tempFactor = 1 + (temperatureDeviation * 0.003);
    
    return weight * baseFlowRate * altitudeFactor * machFactor * tempFactor;
  }

  static timeToClimb(
    initialAltitude: number,
    finalAltitude: number,
    averageClimbRate: number = 2000
  ): number {
    const altitudeDifference = finalAltitude - initialAltitude;
    return (altitudeDifference / averageClimbRate) * 60; // minutes
  }

  static distanceToClimb(
    initialAltitude: number,
    finalAltitude: number,
    groundSpeed: number,
    averageClimbRate: number = 2000
  ): number {
    const timeMinutes = this.timeToClimb(initialAltitude, finalAltitude, averageClimbRate);
    return (groundSpeed * timeMinutes) / 60; // nautical miles
  }

  static centerOfGravity(items: Array<{ weight: number; arm: number }>): number {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    const totalMoment = items.reduce((sum, item) => sum + (item.weight * item.arm), 0);
    
    if (totalWeight === 0) return 0;
    return totalMoment / totalWeight;
  }

  static validateAnswer(
    actualValue: number,
    expectedValue: number, 
    tolerance: number
  ): boolean {
    const difference = Math.abs(actualValue - expectedValue);
    return difference <= tolerance;
  }

  static formatNumber(value: number, decimals: number = 1): string {
    return value.toFixed(decimals);
  }

  static parseWindComponent(windString: string): { direction: number; speed: number } | null {
    const match = windString.match(/(\d{3})(\d{2})/);
    if (!match) return null;
    
    return {
      direction: parseInt(match[1]),
      speed: parseInt(match[2])
    };
  }

  static pressureAltitude(indicatedAltitude: number, qnh: number): number {
    return indicatedAltitude + (1013.25 - qnh) * 30;
  }

  static densityAltitude(pressureAltitude: number, _temperature: number, isaDeviation: number): number {
    return pressureAltitude + (120 * isaDeviation);
  }

  static requiredFuel(
    distance: number,
    groundSpeed: number,
    fuelFlow: number,
    alternateDistance: number = 0,
    holdingTime: number = 45 // minutes
  ): { tripFuel: number; alternateFuel: number; holdingFuel: number; totalFuel: number } {
    const tripTime = distance / groundSpeed;
    const tripFuel = tripTime * fuelFlow;
    
    const alternateTime = alternateDistance / groundSpeed;
    const alternateFuel = alternateTime * fuelFlow;
    
    const holdingFuel = (holdingTime / 60) * fuelFlow;
    
    const totalFuel = tripFuel + alternateFuel + holdingFuel;
    
    return {
      tripFuel: Math.round(tripFuel * 10) / 10,
      alternateFuel: Math.round(alternateFuel * 10) / 10, 
      holdingFuel: Math.round(holdingFuel * 10) / 10,
      totalFuel: Math.round(totalFuel * 10) / 10
    };
  }
}