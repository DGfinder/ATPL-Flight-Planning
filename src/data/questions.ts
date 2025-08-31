import type { Question, QuestionCategory } from '../types';

export const sampleQuestions: Question[] = [
  {
    id: "AFPA_001",
    title: "TMN Cruise Schedule Performance",
    description: "Using the TMN cruise schedule, determine the TMN and groundspeed for the given conditions.",
    type: "multiple_choice",
    category: "performance",
    marks: 3,
    reference: "CASA Part 61 - Aircraft Performance Charts",
    givenData: {
      "Gross Weight": "79,400 kg",
      "Cruise Flight Level": "FL330",
      "Temperature": "ISA+5",
      "Wind Component": "+55 kt"
    },
    options: [
      "TMN 0.78, Groundspeed 485 kt",
      "TMN 0.80, Groundspeed 512 kt", 
      "TMN 0.82, Groundspeed 537 kt",
      "TMN 0.84, Groundspeed 558 kt",
      "TMN 0.86, Groundspeed 575 kt"
    ],
    correctAnswer: 2,
    workingSteps: [
      "1. Enter TMN cruise schedule chart with GW 79,400 kg at FL330",
      "2. Apply ISA+5 temperature correction",
      "3. Read TMN 0.82 and TAS 482 kt",
      "4. Calculate groundspeed: 482 + 55 = 537 kt"
    ]
  },
  {
    id: "AFPA_015", 
    title: "Wind Correction Analysis",
    description: "Calculate the actual distance to top of climb considering forecast vs actual wind conditions.",
    type: "short_answer",
    category: "navigation",
    marks: 4,
    reference: "CASA Flight Planning Manual - Wind Triangle",
    givenData: {
      "Forecast Wind": "-30 kt (headwind)",
      "Distance to TOC": "127 nm",
      "Climb Time": "23 minutes",
      "Actual Wind": "+20 kt (tailwind)"
    },
    expectedAnswers: [
      {
        field: "actual_distance",
        value: 146.2,
        tolerance: 2,
        unit: "nm",
        description: "Actual distance to top of climb"
      }
    ],
    workingSteps: [
      "1. Calculate forecast groundspeed: TAS + (-30) kt",
      "2. Calculate actual groundspeed: TAS + 20 kt", 
      "3. Find TAS from: Distance = GS × Time, so 127 nm = (TAS - 30) × 23/60",
      "4. Solve for TAS = 196.3 kt",
      "5. Actual GS = 196.3 + 20 = 216.3 kt",
      "6. Actual distance = 216.3 × 23/60 = 146.2 nm"
    ]
  },
  {
    id: "AFPA_023",
    title: "Pressure Altitude for Mach Number",
    description: "Determine the pressure altitude required to achieve TMN 0.78M at the given conditions.",
    type: "short_answer", 
    category: "performance",
    marks: 3,
    reference: "CASA Part 61 - Mach Number Charts",
    givenData: {
      "Indicated Airspeed": "310 kt",
      "Static Air Temperature": "-36°C",
      "QNH": "1013 hPa"
    },
    expectedAnswers: [
      {
        field: "pressure_altitude", 
        value: 27500,
        tolerance: 250,
        unit: "ft",
        description: "Pressure altitude for TMN 0.78M"
      }
    ],
    workingSteps: [
      "1. Convert SAT to temperature deviation from ISA",
      "2. Calculate TAS from IAS using altitude and temperature",
      "3. Use Mach number formula: M = TAS / speed of sound",
      "4. Find altitude where M = 0.78 with given conditions",
      "5. Answer: 27,500 ft pressure altitude"
    ]
  },
  {
    id: "AFPA_008",
    title: "Fuel Planning - Reserve Requirements",
    description: "Calculate the minimum fuel required including reserves for the planned flight.",
    type: "short_answer",
    category: "fuel_planning", 
    marks: 5,
    reference: "CAR 91.285 - Fuel Requirements",
    givenData: {
      "Flight Distance": "850 nm",
      "Cruise Fuel Flow": "1,200 kg/h",
      "Cruise Groundspeed": "480 kt",
      "Alternate Distance": "120 nm",
      "Holding Requirement": "45 minutes"
    },
    expectedAnswers: [
      {
        field: "trip_fuel",
        value: 2125,
        tolerance: 50,
        unit: "kg", 
        description: "Trip fuel to destination"
      },
      {
        field: "total_fuel_required",
        value: 3275,
        tolerance: 75,
        unit: "kg",
        description: "Total fuel including reserves"
      }
    ],
    workingSteps: [
      "1. Calculate trip time: 850 nm ÷ 480 kt = 1.77 hours",
      "2. Trip fuel: 1.77 × 1,200 = 2,125 kg", 
      "3. Alternate fuel: (120 nm ÷ 480 kt) × 1,200 = 300 kg",
      "4. Holding fuel: 0.75 hours × 1,200 = 900 kg",
      "5. Total: 2,125 + 300 + 900 = 3,275 kg"
    ]
  },
  {
    id: "AFPA_012",
    title: "Weight and Balance - CG Calculation", 
    description: "Calculate the center of gravity position for the loaded aircraft.",
    type: "multiple_choice",
    category: "weight_balance",
    marks: 4,
    reference: "Aircraft Flight Manual - Loading System",
    givenData: {
      "Empty Weight": "42,500 kg at 2.45m",
      "Fuel": "8,200 kg at 2.80m", 
      "Cargo Zone A": "3,400 kg at 1.95m",
      "Cargo Zone B": "2,800 kg at 3.25m",
      "Passengers": "12,600 kg at 2.65m"
    },
    options: [
      "CG at 2.48m, within limits",
      "CG at 2.52m, within limits", 
      "CG at 2.58m, aft of limits",
      "CG at 2.61m, aft of limits",
      "CG at 2.44m, forward of limits"
    ],
    correctAnswer: 1,
    workingSteps: [
      "1. Calculate total weight: 42,500 + 8,200 + 3,400 + 2,800 + 12,600 = 69,500 kg",
      "2. Calculate moment for each item: Weight × ARM",
      "3. Sum all moments: 175,200 kg⋅m",
      "4. CG = Total moment ÷ Total weight = 175,200 ÷ 69,500 = 2.52m",
      "5. Check against aircraft limits (typically 2.35m - 2.75m)"
    ]
  },
  {
    id: "AFPA_016",
    title: "B727 Sector Fuel Burn",
    description: "Calculate the planned fuel burn from IDELU to HORN ISLAND using B727 performance data.",
    type: "short_answer",
    category: "fuel_planning",
    marks: 2,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(d) Sector Fuel Burn",
    givenData: {
      "GW overhead IDELU": "72,500 kg",
      "Flight Level": "FL330",
      "TMN": "LRC",
      "Forecast for FL340": "W/V 170T/14",
      "SAT for FL340": "-39°C"
    },
    expectedAnswers: [
      {
        field: "fuel_burn",
        value: 3174,
        tolerance: 100,
        unit: "kg",
        description: "Planned FBO from IDELU to HORN ISLAND"
      }
    ],
    workingSteps: [
      "1. Enter B727 cruise performance chart at 72,500 kg, FL330",
      "2. Apply LRC TMN schedule",
      "3. Correct for SAT -39°C (ISA-4) at FL340",
      "4. Calculate sector fuel burn using distance and fuel flow",
      "5. Answer: 3,174 kg"
    ]
  },
  {
    id: "AFPA_020",
    title: "B727 Average Rate of Climb",
    description: "Determine the average rate of climb for B727 from FL130 to FL330.",
    type: "short_answer",
    category: "performance",
    marks: 1,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(f) Rate of Climb",
    givenData: {
      "BRW": "78,000 kg",
      "Temperature": "ISA conditions",
      "Initial Level": "FL130",
      "Final Level": "FL330"
    },
    expectedAnswers: [
      {
        field: "climb_rate",
        value: 1290,
        tolerance: 50,
        unit: "fpm",
        description: "Average rate of climb FL130 to FL330"
      }
    ],
    workingSteps: [
      "1. Enter B727 climb performance chart",
      "2. Find climb data for 78,000 kg under ISA conditions",
      "3. Calculate average rate from FL130 to FL330",
      "4. Answer: 1,290 fpm"
    ]
  },
  {
    id: "AFPA_004",
    title: "PNR/1-INOP Fuel Calculation",
    description: "Calculate fuel available for PNR/1-INOP flight and landing weight.",
    type: "multiple_choice",
    category: "fuel_planning",
    marks: 1,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(f) Engine Out Flight",
    givenData: {
      "FOB": "15,900 kg",
      "Payload": "13,000 kg", 
      "BW": "47,000 kg",
      "Destination Weather": "ACCEPTABLE, SUITABLE with 60 min holding fuel",
      "Departure Weather": "SUITABLE, requires 20 min operational holding for Traffic purposes"
    },
    options: [
      "PNR/1-INOP fuel available 13090 kg and LW 62809 kg",
      "PNR/1-INOP fuel available 11879 kg and LW 64021 kg", 
      "PNR/1-INOP fuel available 9455 kg and LW 66445 kg",
      "PNR/1-INOP fuel available 12960 kg and LW 62940 kg",
      "PNR/1-INOP fuel available 13000 kg and LW 62900 kg"
    ],
    correctAnswer: 0,
    workingSteps: [
      "1. Calculate total weight: BW + Payload + FOB = 75,900 kg",
      "2. Calculate required reserves: 60 min holding + 20 min operational",
      "3. Subtract reserve fuel from FOB for available fuel",
      "4. Calculate landing weight after PNR return",
      "5. Answer: 13,090 kg fuel available, 62,809 kg LW"
    ]
  },
  {
    id: "AFPA_006", 
    title: "One Engine Inoperative Holding",
    description: "Calculate holding pattern fuel flow and TAS with one engine inoperative.",
    type: "multiple_choice",
    category: "performance",
    marks: 2,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(d) TAS and Fuel Consumption",
    givenData: {
      "GW at holding pattern entry": "72,000 kg",
      "Flight Level": "FL230", 
      "Temperature": "ISA+10",
      "Holding Time": "45 minutes",
      "Pattern": "Racetrack holding pattern"
    },
    options: [
      "3922 kg/hr and 337 kt",
      "3815 kg/hr and 323 kt",
      "3883 kg/hr and 336 kt", 
      "3973 kg/hr and 333 kt"
    ],
    correctAnswer: 2,
    workingSteps: [
      "1. Enter B727 one engine inoperative performance chart",
      "2. Find holding configuration at FL230, 72,000 kg",
      "3. Apply ISA+10 temperature correction",
      "4. Read fuel flow and TAS for holding pattern",
      "5. Answer: 3,883 kg/hr fuel flow, 336 kt TAS"
    ]
  },
  {
    id: "AFPA_034",
    title: "Maximum Payload Calculation",
    description: "Calculate the maximum payload for PERTH to ALICE SPRINGS flight considering performance limits.",
    type: "multiple_choice", 
    category: "weight_balance",
    marks: 2,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(a) Payload Uplift Capability",
    givenData: {
      "Performance Limited BRW": "85,650 kg",
      "Performance Limited LW": "69,650 kg",
      "Basic Weight": "46,920 kg",
      "Normal Operations Fuel Burn": "13,650 kg",
      "1 INOP Operations Fuel Burn": "14,820 kg", 
      "Depressurised Operations Fuel Burn": "16,250 kg",
      "PERTH Weather": "ACCEPTABLE, SUITABLE with TEMPO (60 min)",
      "ALICE SPRINGS Weather": "ACCEPTABLE, SUITABLE with INTER (30 min)"
    },
    options: [
      "14478 kg",
      "15648 kg",
      "16500 kg", 
      "16580 kg"
    ],
    correctAnswer: 0,
    workingSteps: [
      "1. Calculate fuel required: Normal + reserves for weather",
      "2. Calculate MTOW: Performance Limited BRW = 85,650 kg",
      "3. Calculate available payload: MTOW - BW - Total Fuel Required",
      "4. Check against performance limited LW",
      "5. Answer: 14,478 kg maximum payload"
    ]
  },
  {
    id: "AFPA_053",
    title: "Cruise EPR Settings - Bleed Air Configuration", 
    description: "Determine maximum cruise EPR settings when engines 2 and 3 provide bleed air.",
    type: "multiple_choice",
    category: "performance",
    marks: 2,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(f) Inflight Computation EPR",
    givenData: {
      "GW": "76,000 kg",
      "Cruise Level": "FL310",
      "TAT": "-19°C",
      "TMN": "0.79",
      "Bleed Air Config": "Engines 2 and 3 for airconditioning"
    },
    options: [
      "2.13 2.17 2.13",
      "2.19 2.11 2.13",
      "2.19 2.17 2.13", 
      "2.13 2.11 2.19"
    ],
    correctAnswer: 1,
    workingSteps: [
      "1. Enter B727 cruise EPR chart for FL310, 76,000 kg",
      "2. Apply TAT -19°C correction", 
      "3. Apply TMN 0.79 schedule",
      "4. Adjust for engines 2&3 providing bleed air (reduced EPR on those engines)",
      "5. Answer: Engine 1: 2.19, Engine 2: 2.11, Engine 3: 2.13"
    ]
  },
  {
    id: "AFPA_060",
    title: "Climb Performance FL150 to FL350",
    description: "Calculate average rate of climb and top of climb gross weight.",
    type: "multiple_choice",
    category: "performance", 
    marks: 2,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(f) Intermediate ROC",
    givenData: {
      "Temperature": "ISA+10",
      "Gross Weight": "72,500 kg",
      "Initial Level": "FL150",
      "Final Level": "FL350"
    },
    options: [
      "1000 ft/minute rate of climb and top of climb gross weight 70500 kg",
      "1150 ft/minute rate of climb and top of climb gross weight 70675 kg",
      "890 ft/minute rate of climb and top of climb gross weight 70325 kg",
      "1200 ft/minute rate of climb and top of climb gross weight 70825 kg"
    ],
    correctAnswer: 0,
    workingSteps: [
      "1. Enter B727 climb performance chart at 72,500 kg",
      "2. Apply ISA+10 temperature correction",
      "3. Calculate average ROC from FL150 to FL350", 
      "4. Calculate fuel burn during climb to find TOC weight",
      "5. Answer: 1,000 fpm climb rate, 70,500 kg TOC weight"
    ]
  },
  {
    id: "AFPA_002",
    title: "High Speed Cruise Schedule Availability",
    description: "Determine when TMN 0.84 becomes available during cruise using RSWT data.",
    type: "multiple_choice",
    category: "navigation",
    marks: 3,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(c) Selection of Cruise Schedules - High Speed Cruise",
    givenData: {
      "Current Position": "AGAGO",
      "FL": "330", 
      "TMN": "0.82",
      "IRS Wind": "250(M) 66 kt",
      "TAT": "-10°C",
      "GW": "73,200 kg",
      "Route": "A461 and H119 (ALICE SPRINGS to MELBOURNE)"
    },
    options: [
      "183 nm, 23 minutes",
      "257 nm, 30 minutes",
      "232 nm, 26 minutes",
      "204 nm, 24 minutes", 
      "165 nm, 20 minutes"
    ],
    correctAnswer: 1,
    workingSteps: [
      "1. Check RSWT extract for weight limits at different flight levels",
      "2. Find minimum weight required for TMN 0.84 schedule",
      "3. Calculate fuel burn from AGAGO to reach required weight",
      "4. Convert fuel burn to distance and time using current groundspeed",
      "5. Answer: 257 nm, 30 minutes"
    ]
  },
  {
    id: "AFPA_052",
    title: "PNR/1-INOP Distance Calculation",
    description: "Calculate PNR/1-INOP distance for return to ALICE SPRINGS.",
    type: "multiple_choice",
    category: "navigation",
    marks: 2, 
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(i) PNR 1-INOP",
    givenData: {
      "Current Position": "NONET",
      "Total FOB": "12,225 kg",
      "Return Airport": "ALICE SPRINGS",
      "Weather": "ACCEPTABLE, SUITABLE with 30 min holding + 20 min TRAFFIC holding",
      "Normal Cruise - Fuel Flow": "4,300 kg/hr",
      "Normal Cruise - TAS": "460 kt", 
      "Normal Cruise - Wind": "+50 kt",
      "1-INOP Cruise - Fuel Flow": "4,400 kg/hr",
      "1-INOP Cruise - TAS": "420 kt",
      "1-INOP Cruise - Wind": "-30 kt"
    },
    options: [
      "230 nm",
      "636 nm", 
      "576 nm",
      "643 nm",
      "629 nm"
    ],
    correctAnswer: 1,
    workingSteps: [
      "1. Calculate total reserve fuel required: 30 min + 20 min = 50 min",
      "2. Calculate outbound and return groundspeeds using wind components",
      "3. Set up PNR equation: Outbound fuel + Return fuel + Reserves = Total FOB",
      "4. Solve for distance to PNR point",
      "5. Answer: 636 nm from NONET"
    ]
  },
  {
    id: "AFPA_067",
    title: "Holding and Landing Weight Calculation",
    description: "Calculate planned landing weight after holding for traffic sequencing.",
    type: "multiple_choice",
    category: "fuel_planning",
    marks: 4,
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(f) Replanning for Holding", 
    givenData: {
      "Route": "BRISBANE to MELBOURNE via Q94",
      "Current Position": "120 nm past PARKES",
      "Holding": "38 minutes at FL280, 15 track miles past POLSO",
      "Cruise Level": "FL350",
      "TMN": "0.82",
      "GW": "72,450 kg",
      "TAC Distance": "CANTY to MELBOURNE is 52 nm"
    },
    options: [
      "68295 kg",
      "68405 kg",
      "68133 kg",
      "67914 kg",
      "67866 kg"
    ],
    correctAnswer: 2,
    workingSteps: [
      "1. Calculate fuel burn to holding position",
      "2. Calculate holding fuel burn: 38 minutes at FL280",
      "3. Calculate fuel burn from holding position to landing",
      "4. Subtract total fuel burn from current gross weight", 
      "5. Answer: 68,133 kg landing weight"
    ]
  }
];

export const questionCategories: Record<QuestionCategory, string> = {
  performance: 'Aircraft Performance',
  navigation: 'Navigation & Flight Planning', 
  fuel_planning: 'Fuel Planning',
  weight_balance: 'Weight & Balance',
  meteorology: 'Meteorology',
  flight_planning: 'Flight Planning Procedures'
};