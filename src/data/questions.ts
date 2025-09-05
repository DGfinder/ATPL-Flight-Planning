import type { Question, QuestionCategory } from '../types';

export const sampleQuestions: Question[] = [
  {
    id: "AFPA_016",
    title: "B727 Sector Fuel Burn - DARWIN to PORT MORESBY",
    description: "A flight is being planned in a B727 from DARWIN to PORT MORESBY via route B598. The planned FBO from IDELU to HORN ISLAND is closest to -",
    type: "short_answer",
    category: "sector_fuel_burn_normal_cruise",
    marks: 2,
    givenData: {
      "GW overhead IDELU": "72,500 kg",
      "FL": "330",
      "TMN": "LRC",
      "Forecast for FL340": "W/V 170T/14",
      "SAT for FL340": "-39°C"
    },
    expectedAnswers: [
      {
        field: "fuel_burn",
        value: 3174,
        tolerance: 50,
        unit: "kg",
        description: "Planned FBO from IDELU to HORN ISLAND"
      }
    ],
    workingSteps: [],
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(d) Sector Fuel Burn"
  },
  {
    id: "AFPA_070",
    title: "Total Fuel for Depressurisation at CP/DP",
    description: "Refer B727 Flight Manual Extract, ERC H3 and RSWT Extract. You are planning a flight from DARWIN (YPDN) to MELBOURNE (YMML) via A461 and H119. You have the following planning data: Ramp weight 83250 kg, Cruise level FL330, TMN 0.82. Enroute overhead ALICE SPRINGS (YBAS), Gross weight is 74630 kg. DARWIN is SUITABLE, MELBOURNE and ALICE SPRINGS are ACCEPTABLE, but may be considered SUITABLE if 30 minutes holding fuel is carried. You calculate the ALICE SPRINGS to MELBOURNE CP/DP to be 6 nm south of LEIGH CREEK (YLEC). Your calculation of the total fuel required to be on board at engine start, to cover depressurisation at the CP/DP, is closest to -",
    type: "short_answer",
    category: "total_fuel_required_ramp_fuel",
    marks: 4,
    givenData: {
      "Route": "YPDN to YMML",
      "Ramp Weight": "83250 kg",
      "Cruise Level": "FL340",
      "TMN": "0.82",
      "GW at YBAS": "74630 kg",
      "CP/DP Location": "6 nm south of YLEC",
      "Holding Fuel": "30 minutes",
      "Weather Data ID": "AFPA_070_WEATHER_001"
    },
    expectedAnswers: [
      {
        field: "total_fuel",
        value: 22250,
        tolerance: 200,
        unit: "kg",
        description: "Total fuel required for depressurisation scenario"
      }
    ],
    workingSteps: [
      "Step 1: Calculate the total flight fuel required for the entire trip from Darwin to Melbourne. The initial plan shows a fuel burn of 8,470 kg from DN to AS.",
      "Step 2: Plan the depressurisation scenario from the CP/DP to the destination (Melbourne). This involves a cruise segment at a lower altitude (e.g., FL130).",
      "Step 3: Calculate the fuel burn from YBAS to the CP/DP (480 nm) at normal cruise, which is 4,565 kg.",
      "Step 4: Calculate the fuel burn from the CP/DP to landing at YMML during depressurisation. This includes the cruise at FL130 and descent, totaling 5,796 kg + 520 kg + 400 kg = 6,716 kg.",
      "Step 5: The total flight fuel for this contingency is the sum of fuel from DN-YBAS, YBAS-CP/DP, and CP/DP-YMML. Total FF = 8470 + 4565 + 6716 = 19,751 kg.",
      "Step 6: Add the required reserves for a depressurisation scenario."
    ],
    reference: "Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(i) CP/DP"
  }
];

export const questionCategories: Record<QuestionCategory, string> = {
  payload_uplift_capability: 'Payload Uplift & Capability',
  mtow_brw_calculations: 'MTOW / BRW Calculations',
  sector_fuel_burn_normal_cruise: 'Sector Fuel Burn (Normal Cruise)',
  trip_fuel_total_flight_plan: 'Trip Fuel (Total for Flight Plan)',
  alternate_holding_fuel: 'Alternate & Holding Fuel',
  final_reserve_variable_reserve_fuel: 'Final Reserve & Variable Reserve Fuel',
  total_fuel_required_ramp_fuel: 'Total Fuel Required (Ramp Fuel)',
  fuel_dumping_time_quantity: 'Fuel Dumping (Time & Quantity)',
  rate_of_climb_roc: 'Rate of Climb (ROC)',
  climb_fuel_distance_time_altitude: 'Climb Fuel, Distance & Time to Altitude',
  intermediate_level_change_cruise_climb: 'Intermediate Level Change (Cruise Climb)',
  selection_cruise_schedules_altitude: 'Selection of Cruise Schedules & Altitude',
  inflight_epr_limitations: 'In-flight EPR Limitations',
  maximum_tat_limitations: 'Maximum TAT Limitations',
  ias_mach_number_conversion: 'IAS to Mach Number Conversion',
  tas_groundspeed_calculations: 'TAS & Groundspeed Calculations',
  descent_point_planning: 'Descent Point & Planning',
  inflight_replanning_holding: 'In-flight Replanning (for Holding)',
  pnr_1_inop_return_departure: 'PNR 1-INOP (Return to Departure)',
  pnr_1_inop_return_alternate: 'PNR 1-INOP (Return to Alternate)',
  cp_1_inop_equi_time_point: 'CP 1-INOP (Equi-time Point)',
  pnr_depressurised: 'PNR Depressurised',
  cp_depressurised: 'CP Depressurised',
  engine_out_drift_down_altitude: 'Engine Out Drift-down Altitude',
  engine_out_fuel_flow_tas: 'Engine Out Fuel Flow & TAS',
  buffet_boundaries_margins: 'Buffet Boundaries & Margins',
  maximum_altitude_capability_normal_ops: 'Maximum Altitude Capability (Normal Ops)',
  maximum_altitude_capability_engine_out: 'Maximum Altitude Capability (Engine Out)',
  abnormal_configuration_gear_down_performance: 'Abnormal Configuration (Gear Down Performance)',
  abnormal_configuration_system_failures: 'Abnormal Configuration (System Failures)'
};