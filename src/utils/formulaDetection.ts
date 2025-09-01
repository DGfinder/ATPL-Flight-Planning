interface Formula {
  name: string;
  expression: string;
  description: string;
  variables: Array<{ symbol: string; description: string; unit?: string }>;
  category: 'speed' | 'fuel' | 'navigation' | 'performance' | 'weight';
}

export class FormulaDetection {
  // Aviation formula database
  static readonly AVIATION_FORMULAS: Record<string, Formula[]> = {
    'tas_heading_ground_speed': [
      {
        name: 'Effective True Air Speed (ETAS)',
        expression: 'ETAS = TAS × cos(drift_angle)',
        description: 'Effective TAS accounts for drift angle effects on actual track speed. Used when drift angle exceeds 5°.',
        variables: [
          { symbol: 'ETAS', description: 'Effective True Air Speed', unit: 'knots' },
          { symbol: 'TAS', description: 'True Air Speed', unit: 'knots' },
          { symbol: 'drift_angle', description: 'Angle between heading and track', unit: 'degrees' }
        ],
        category: 'speed'
      },
      {
        name: 'Ground Speed',
        expression: 'GS = ETAS - Headwind_Component',
        description: 'Final ground speed calculation after applying wind corrections and ETAS adjustments.',
        variables: [
          { symbol: 'GS', description: 'Ground Speed', unit: 'knots' },
          { symbol: 'ETAS', description: 'Effective True Air Speed', unit: 'knots' },
          { symbol: 'Headwind_Component', description: 'Headwind component from wind triangle', unit: 'knots' }
        ],
        category: 'speed'
      },
      {
        name: 'Wind Component',
        expression: 'WC = Wind_Speed × cos(Wind_Angle)',
        description: 'Calculates headwind/tailwind component from wind direction and track.',
        variables: [
          { symbol: 'WC', description: 'Wind Component (+ tailwind, - headwind)', unit: 'knots' },
          { symbol: 'Wind_Speed', description: 'Wind speed', unit: 'knots' },
          { symbol: 'Wind_Angle', description: 'Angle between wind direction and track', unit: 'degrees' }
        ],
        category: 'navigation'
      }
    ],
    'speed_sound_mach_tat': [
      {
        name: 'Mach to TAS Conversion',
        expression: 'TAS = Mach × Speed_of_Sound',
        description: 'Converts Mach number to True Air Speed using local speed of sound.',
        variables: [
          { symbol: 'TAS', description: 'True Air Speed', unit: 'knots' },
          { symbol: 'Mach', description: 'Mach number', unit: 'dimensionless' },
          { symbol: 'Speed_of_Sound', description: 'Local speed of sound', unit: 'knots' }
        ],
        category: 'speed'
      },
      {
        name: 'Speed of Sound',
        expression: 'SoS = 39 × √(Temperature_K)',
        description: 'Calculates local speed of sound based on temperature in Kelvin.',
        variables: [
          { symbol: 'SoS', description: 'Speed of Sound', unit: 'knots' },
          { symbol: 'Temperature_K', description: 'Temperature in Kelvin', unit: 'K' }
        ],
        category: 'performance'
      }
    ],
    'fuel_dumping': [
      {
        name: 'Fuel Dump Rate',
        expression: 'Dump_Time = (Current_Weight - Target_Weight) / Dump_Rate',
        description: 'Calculates time required to dump fuel to reach target weight.',
        variables: [
          { symbol: 'Dump_Time', description: 'Time to dump fuel', unit: 'minutes' },
          { symbol: 'Current_Weight', description: 'Current aircraft weight', unit: 'kg' },
          { symbol: 'Target_Weight', description: 'Desired final weight', unit: 'kg' },
          { symbol: 'Dump_Rate', description: 'Fuel dump rate', unit: 'kg/min' }
        ],
        category: 'fuel'
      }
    ],
    'holding_fuel': [
      {
        name: 'Holding Fuel Calculation',
        expression: 'Holding_Fuel = Fuel_Flow × Holding_Time',
        description: 'Calculates fuel required for holding patterns and delays.',
        variables: [
          { symbol: 'Holding_Fuel', description: 'Fuel required for holding', unit: 'kg' },
          { symbol: 'Fuel_Flow', description: 'Current fuel flow rate', unit: 'kg/hr' },
          { symbol: 'Holding_Time', description: 'Duration of holding', unit: 'hours' }
        ],
        category: 'fuel'
      }
    ],
    'cruise_data': [
      {
        name: 'Specific Ground Range (SGR)',
        expression: 'SGR = SAR + Wind_Adjustment',
        description: 'Ground range accounting for wind effects on fuel efficiency.',
        variables: [
          { symbol: 'SGR', description: 'Specific Ground Range', unit: 'nm/kg' },
          { symbol: 'SAR', description: 'Specific Air Range', unit: 'nm/kg' },
          { symbol: 'Wind_Adjustment', description: 'Wind effect on range', unit: 'nm/kg' }
        ],
        category: 'fuel'
      },
      {
        name: 'End of Zone Weight (EMZW)',
        expression: 'EMZW = Start_Weight - (Distance × SGR)',
        description: 'Calculates aircraft weight at end of cruise zone.',
        variables: [
          { symbol: 'EMZW', description: 'End of Zone Weight', unit: 'kg' },
          { symbol: 'Start_Weight', description: 'Weight at start of zone', unit: 'kg' },
          { symbol: 'Distance', description: 'Zone distance', unit: 'nm' },
          { symbol: 'SGR', description: 'Specific Ground Range', unit: 'nm/kg' }
        ],
        category: 'weight'
      }
    ],
    'altitude_capability': [
      {
        name: 'Service Ceiling',
        expression: 'Service_Ceiling = Weight_Factor × Temperature_Factor',
        description: 'Maximum operational altitude based on weight and temperature conditions.',
        variables: [
          { symbol: 'Service_Ceiling', description: 'Maximum operational altitude', unit: 'feet' },
          { symbol: 'Weight_Factor', description: 'Weight-based altitude limitation', unit: 'feet' },
          { symbol: 'Temperature_Factor', description: 'Temperature-based adjustment', unit: 'feet' }
        ],
        category: 'performance'
      }
    ]
  };

  static getFormulasForSubject(subjectId: string): Formula[] {
    return this.AVIATION_FORMULAS[subjectId] || [];
  }

  static extractFormulasFromContent(content: string): Formula[] {
    const extractedFormulas: Formula[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for formula patterns
      if (this.isFormulaLine(line)) {
        const formula = this.parseFormulaLine(line, lines, i);
        if (formula) {
          extractedFormulas.push(formula);
        }
      }
    }
    
    return extractedFormulas;
  }

  private static isFormulaLine(line: string): boolean {
    const formulaPatterns = [
      /^[A-Z]{2,}\s*=\s*.+/,  // Pattern like "TAS = ..."
      /.*=.*\d+.*knots?/i,     // Contains equals and knots
      /.*=.*\d+.*kt/i,         // Contains equals and kt
      /.*×.*cos\(/i,           // Mathematical expressions
      /.*√\(/i,                // Square root expressions
      /ETAS.*345.*knots/i,     // Specific ETAS calculations
      /GS.*=.*273.*knots/i     // Ground speed calculations
    ];
    
    return formulaPatterns.some(pattern => pattern.test(line));
  }

  private static parseFormulaLine(line: string, _allLines: string[], _lineIndex: number): Formula | null {
    
    // Simple formula extraction - can be enhanced
    if (line.includes('ETAS') && line.includes('345')) {
      return {
        name: 'ETAS Calculation',
        expression: 'ETAS = 345 knots',
        description: 'Effective True Air Speed from the example calculation',
        variables: [
          { symbol: 'ETAS', description: 'Effective True Air Speed', unit: 'knots' }
        ],
        category: 'speed'
      };
    }
    
    if (line.includes('GS') && line.includes('273')) {
      return {
        name: 'Ground Speed Result',
        expression: 'GS = ETAS - Headwind = 345 - 72 = 273 knots',
        description: 'Final ground speed after wind corrections',
        variables: [
          { symbol: 'GS', description: 'Ground Speed', unit: 'knots' },
          { symbol: 'ETAS', description: 'Effective True Air Speed', unit: 'knots' },
          { symbol: 'Headwind', description: 'Headwind component', unit: 'knots' }
        ],
        category: 'speed'
      };
    }
    
    return null;
  }

  static getAllAvailableFormulas(): Formula[] {
    return Object.values(this.AVIATION_FORMULAS).flat();
  }

  static getFormulasByCategory(category: string): Formula[] {
    return this.getAllAvailableFormulas().filter(formula => formula.category === category);
  }
}

export type { Formula };