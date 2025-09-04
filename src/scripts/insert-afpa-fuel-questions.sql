-- Question: AFPA_070
-- Category: Total Fuel Required (Ramp Fuel)
INSERT INTO questions (
  id, title, description, type, category, marks, reference, given_data, options, correct_answer, expected_answers, working_steps, created_at, updated_at
) VALUES (
  'AFPA_070',
  'Total Fuel for Depressurisation at CP/DP',
  'Refer B727 Flight Manual Extract, ERC H3 and RSWT Extract. You are planning a flight from DARWIN (YPDN) to MELBOURNE (YMML) via A461 and H119. You have the following planning data: Ramp weight 83250 kg, Cruise level FL330, TMN 0.82. Enroute overhead ALICE SPRINGS (YBAS), Gross weight is 74630 kg. DARWIN is SUITABLE, MELBOURNE and ALICE SPRINGS are ACCEPTABLE, but may be considered SUITABLE if 30 minutes holding fuel is carried. You calculate the ALICE SPRINGS to MELBOURNE CP/DP to be 6 nm south of LEIGH CREEK (YLEC). Your calculation of the total fuel required to be on board at engine start, to cover depressurisation at the CP/DP, is closest to -',
  'short_answer',
  'total_fuel_required_ramp_fuel',
  4,
  'Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(i) CP/DP',
  '{
    "Route": "YPDN to YMML",
    "Ramp Weight": "83250 kg",
    "Cruise Level": "FL330",
    "TMN": "0.82",
    "GW at YBAS": "74630 kg",
    "CP/DP Location": "6 nm south of YLEC"
  }'::jsonb,
  NULL,
  NULL,
  '["22250 kg"]'::jsonb,
  ARRAY[
    'Step 1: Calculate the total flight fuel required for the entire trip from Darwin to Melbourne. The initial plan shows a fuel burn of 8,470 kg from DN to AS.',
    'Step 2: Plan the depressurisation scenario from the CP/DP to the destination (Melbourne). This involves a cruise segment at a lower altitude (e.g., FL130).',
    'Step 3: Calculate the fuel burn from YBAS to the CP/DP (480 nm) at normal cruise, which is 4,565 kg.',
    'Step 4: Calculate the fuel burn from the CP/DP to landing at YMML during depressurisation. This includes the cruise at FL130 and descent, totaling 5,796 kg + 520 kg + 400 kg = 6,716 kg.',
    'Step 5: The total flight fuel for this contingency is the sum of fuel from DN-YBAS, YBAS-CP/DP, and CP/DP-YMML. Total FF = 8470 + 4565 + 6716 = 19,751 kg.',
    'Step 6: Add the required reserves for a depressurisation scenario.',
    'Depressurised Fixed Reserve (FR) = 2,250 kg.',
    'Start/Taxi (ST) = 150 kg.',
    'Taxi/Shutdown (TS) = 100 kg.',
    'Step 7: Sum the flight fuel and reserves to find the total fuel required at engine start.',
    'Total Fuel = 19,751 (FF) + 2,250 (FR) + 150 (ST) + 100 (TS) = 22,251 kg.'
  ]::text[],
  NOW(),
  NOW()
);

-- Question: AFPA_071
-- Category: PNR Depressurised
INSERT INTO questions (
  id, title, description, type, category, marks, reference, given_data, options, correct_answer, expected_answers, working_steps, created_at, updated_at
) VALUES (
  'AFPA_071',
  'PNR/DP Distance from Destination',
  'Refer B727 POH, ERC H3 and RSWT Extract. You are planning a flight from ADELAIDE (YPAD) to PERTH (YPPH) via Q12 and Q158. Flight planning details are: Cruise level FL310, Mach number 0.80M, BRW 84450 kg, Fuel on Board at BRW 23300 kg. PERTH is ACCEPTABLE but may be considered SUITABLE if 30 minutes holding is carried. ADELAIDE is SUITABLE. Your calculation of the location of the PNR/DP to ADELAIDE via Q12, measured as a distance from PERTH is closest to -',
  'short_answer',
  'pnr_depressurised',
  5,
  'Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(i) PNR/DP',
  '{
    "Route": "YPAD to YPPH",
    "Cruise Level": "FL310",
    "TMN": "0.80",
    "BRW": "84450 kg",
    "FOB at BRW": "23300 kg"
  }'::jsonb,
  NULL,
  NULL,
  '["352 nm"]'::jsonb,
  ARRAY[
    'Step 1: Determine the flight fuel available for the PNR/DP calculation. Available Fuel = FOB - FR (2,250) - TS (100) = 23,300 - 2,250 - 100 = 20,950 kg.',
    'Step 2: Calculate the Specific Ground Range (SGR) for the outbound (normal cruise) and homebound (depressurised) legs.',
    'SGR Out (FL310) ≈ 10.42 kg/nm.',
    'SGR Home (FL130) ≈ 13.3 kg/nm.',
    'Step 3: The worked solution uses a trial PNR at LUCRE (835 nm from YPAD) and calculates the total fuel required for that trip is 21,830 kg.',
    'Step 4: Compare the required fuel to the available fuel. Fuel Deficit = 21,830 - 20,950 = 880 kg. This means the trial PNR is too far.',
    'Step 5: Adjust the PNR distance based on the deficit. Adjustment = Deficit / (SGR Out + SGR Home) = 880 / (10.42 + 13.3) = 37 nm.',
    'Step 6: Calculate the corrected PNR distance from Adelaide. Corrected PNR = 835 nm - 37 nm = 798 nm from YPAD.',
    'Step 7: Convert this to a distance from Perth. Total distance is ~1150 nm. Distance from Perth = 1150 - 798 = 352 nm.'
  ]::text[],
  NOW(),
  NOW()
);

-- Question: AFPA_072
-- Category: Total Fuel Required (Ramp Fuel)
INSERT INTO questions (
  id, title, description, type, category, marks, reference, given_data, options, correct_answer, expected_answers, working_steps, created_at, updated_at
) VALUES (
  'AFPA_072',
  'Minimum Start-Up Fuel for Gear-Down Ferry',
  'Refer B727 POH, ERC H3 and RSWT Extract. You are planning a ferry flight with the landing gear locked down from ALICE SPRINGS (YBAS) to ADELAIDE (YPAD) via J251. Flight planning details are: Cruise level FL170, BRW 68500 kg. YBAS and YPAD are both SUITABLE. Your calculation of the minimum fuel required to be on board at start up for this flight is closest to -',
  'short_answer',
  'total_fuel_required_ramp_fuel',
  5,
  'Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(d) Total Fuel Required',
  '{
    "Scenario": "Ferry flight with landing gear locked down",
    "Route": "YBAS to YPAD",
    "Cruise Level": "FL170",
    "BRW": "68500 kg",
    "Airport Status": "Both SUITABLE"
  }'::jsonb,
  NULL,
  NULL,
  '["19700 kg"]'::jsonb,
  ARRAY[
    'Step 1: Plan the flight profile with the gear-down performance penalty. This will significantly increase fuel burn.',
    'Step 2: Calculate the fuel required for each segment: climb, cruise, and descent.',
    'Climb Fuel ≈ 1,300 kg.',
    'Cruise Fuel (618 nm at FL170) ≈ 11,986 kg.',
    'Descent Fuel ≈ 1,010 kg.',
    'Approach Fuel ≈ 400 kg.',
    'Step 3: Sum the fuel for all segments to find the total Flight Fuel (FF). FF = 1300 + 11986 + 1010 + 400 = 14,696 kg.',
    'Step 4: Add the required reserves for a normal flight.',
    'Variable Reserve (VR) = 10% of FF = 1,470 kg.',
    'Fixed Reserve (FR) = 3,300 kg.',
    'Taxi/Shutdown (TS) = 100 kg.',
    'Step 5: Calculate the total Fuel on Board (FOB) at Brakes Release. FOB = 14696 + 1470 + 3300 + 100 = 19,566 kg.',
    'Step 6: Add the start-up fuel to find the total fuel required at the gate.',
    'Start-up Fuel (ST) = 150 kg.',
    'Total Fuel at Start = 19,566 + 150 = 19,716 kg (closest to 19,700 kg).'
  ]::text[],
  NOW(),
  NOW()
);

-- Question: AFPA_073
-- Category: PNR 1-INOP (Return to Departure)
INSERT INTO questions (
  id, title, description, type, category, marks, reference, given_data, options, correct_answer, expected_answers, working_steps, created_at, updated_at
) VALUES (
  'AFPA_073',
  'In-flight PNR/1-INOP Calculation from Fix',
  'Refer B727 Performance and Operating Handbook, ERC H2 and RSWT Extract. A flight is enroute from DARWIN (YPDN) to TOWNSVILLE (YBTL) via J138. Current position is 99 nm past EGORE. You have the following inflight data: Cruise level FL330, TMN 0.79, Gross weight 78600 kg, Useable Fuel on Board 12820 kg. DARWIN is ACCEPTABLE, but may be considered SUITABLE if 30 minutes holding fuel is carried. TOWNSVILLE is SUITABLE. Your calculation of the position of the PNR/1-INOP, measured as a distance from DARWIN is closest to -',
  'short_answer',
  'pnr_1_inop_return_departure',
  5,
  'Part 61 MOS Schedule 3 Unit 1.10.2 AFPA 2.1.1(i) PNR 1-INOP',
  '{
    "Route": "YPDN to YBTL",
    "Position": "99 nm past EGORE",
    "Cruise Level": "FL330",
    "TMN": "0.79",
    "GW": "78600 kg",
    "FOB": "12820 kg"
  }'::jsonb,
  NULL,
  NULL,
  '["622 nm"]'::jsonb,
  ARRAY[
    'Step 1: Determine the flight fuel available from the current position for the PNR calculation.',
    'Available Fuel = FOB - FR (1,500) - Holding (2,000) = 12,820 - 1,500 - 2,000 = 9,320 kg. This includes the 10% VR.',
    'Step 2: Calculate the flight fuel available by dividing by 1.1. Flight Fuel = 9,320 / 1.1 = 8,473 kg.',
    'Step 3: The worked solution uses a trial PNR at a position 671 nm from Darwin and calculates the total fuel required for that trip is 9,454 kg.',
    'Step 4: Compare required fuel to available fuel. Fuel Deficit = 9,454 - 8,473 = 981 kg. The trial PNR is too far.',
    'Step 5: Calculate the Specific Ground Ranges. SGR Out ≈ 8.6 kg/nm. SGR Home ≈ 11.56 kg/nm.',
    'Step 6: Adjust the PNR distance based on the deficit. Adjustment = Deficit / (SGR Out + SGR Home) = 981 / (8.6 + 11.56) = 49 nm.',
    'Step 7: Calculate the corrected PNR distance from Darwin.',
    'Corrected PNR = 671 nm - 49 nm = 622 nm from YPDN.'
  ]::text[],
  NOW(),
  NOW()
);
