-- Insert weather data for AFPA_070 - Total Fuel for Depressurisation at CP/DP
-- Based on the actual RSWT EXTRACT provided

INSERT INTO weather_data (
  weather_id,
  scenario_name,
  route_from,
  route_to,
  rswt_data
) VALUES (
  'AFPA_070_WEATHER_001',
  'DARWIN_MELBOURNE_DEPRESSURISATION',
  'YPDN',
  'YMML',
  '{
    "185": {
      "isa_temp": -21,
      "ypdn_ybas": "280/30",
      "ybas_lec": "280/20",
      "lec_ymml": "270/30",
      "temp": 11
    },
    "235": {
      "isa_temp": -32,
      "ypdn_ybas": "280/50",
      "ybas_lec": "200/30",
      "lec_ymml": "240/30",
      "temp": 22
    },
    "300": {
      "isa_temp": -45,
      "ypdn_ybas": "290/60",
      "ybas_lec": "270/20",
      "lec_ymml": "260/50",
      "temp": 34
    },
    "340": {
      "isa_temp": -52,
      "ypdn_ybas": "300/40",
      "ybas_lec": "210/20",
      "lec_ymml": "270/45",
      "temp": 41
    },
    "385": {
      "isa_temp": -56,
      "ypdn_ybas": "300/45",
      "ybas_lec": "320/60",
      "lec_ymml": "300/60",
      "temp": 49
    },
    "445": {
      "isa_temp": -56,
      "ypdn_ybas": "310/45",
      "ybas_lec": "320/50",
      "lec_ymml": "290/50",
      "temp": 60
    }
  }'::jsonb
);

-- Verify the data was inserted correctly
SELECT 
  weather_id,
  scenario_name,
  route_from,
  route_to,
  rswt_data
FROM weather_data 
WHERE weather_id = 'AFPA_070_WEATHER_001';
