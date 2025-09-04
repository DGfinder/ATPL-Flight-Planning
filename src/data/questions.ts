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