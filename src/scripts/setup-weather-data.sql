-- Weather Data Table for Aviation Questions
-- Stores weather information separately from questions for reliability and reusability

CREATE TABLE IF NOT EXISTS weather_data (
  id SERIAL PRIMARY KEY,
  weather_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'AFPA_070_WEATHER_001'
  scenario_name VARCHAR(100) NOT NULL, -- e.g., 'DARWIN_MELBOURNE_DEPRESSURISATION'
  route_from VARCHAR(10), -- ICAO code, e.g., 'YPDN'
  route_to VARCHAR(10), -- ICAO code, e.g., 'YMML'
  
  -- Complete RSWT extract data (all standard flight levels)
  rswt_data JSONB, -- Complete RSWT extract: {"185": {"isa_dev": -21, "ypdn_ybas": "280/30", "ybas_lec": "280/20", "lec_ymml": "270/30"}, "235": {...}, "300": {...}, "340": {...}, "385": {...}, "445": {...}}
  
  -- Route information
  total_distance_nm INTEGER,
  segment_distances JSONB, -- {"YBAS_to_CPDP": 480, "CPDP_to_YMML": 320}
  
  -- Additional weather parameters
  pressure_altitude INTEGER, -- Pressure altitude in feet
  isa_deviation INTEGER, -- ISA deviation in Celsius
  visibility_nm DECIMAL(4,1), -- Visibility in nautical miles
  cloud_base_ft INTEGER, -- Cloud base in feet
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Constraints (JSONB validation)
  CONSTRAINT valid_rswt_data CHECK (
    jsonb_typeof(rswt_data) = 'object' AND 
    rswt_data ? '185' AND 
    rswt_data ? '235' AND 
    rswt_data ? '300' AND 
    rswt_data ? '340' AND 
    rswt_data ? '385' AND 
    rswt_data ? '445'
  )
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_weather_data_scenario ON weather_data(scenario_name);
CREATE INDEX IF NOT EXISTS idx_weather_data_route ON weather_data(route_from, route_to);
CREATE INDEX IF NOT EXISTS idx_weather_data_weather_id ON weather_data(weather_id);

-- Enable Row Level Security (RLS)
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to weather data"
ON weather_data
FOR SELECT
TO authenticated
USING (true);

-- Allow all authenticated users to insert/update weather data
CREATE POLICY "Allow authenticated users to manage weather data"
ON weather_data
FOR ALL
TO authenticated
USING (true);

-- Add comments for documentation
COMMENT ON TABLE weather_data IS 'Weather data for aviation questions - stored separately for reliability and reusability';
COMMENT ON COLUMN weather_data.weather_id IS 'Unique identifier for weather scenario (e.g., AFPA_070_WEATHER_001)';
COMMENT ON COLUMN weather_data.scenario_name IS 'Human-readable scenario name';
COMMENT ON COLUMN weather_data.rswt_data IS 'Complete RSWT extract with all flight levels (185, 235, 300, 340, 385, 445)';
COMMENT ON COLUMN weather_data.segment_distances IS 'JSON object with segment distances in nautical miles';

-- Create a view for easy weather data access
CREATE OR REPLACE VIEW weather_data_formatted AS
SELECT 
  weather_id,
  scenario_name,
  route_from,
  route_to,
  rswt_data,
  total_distance_nm,
  segment_distances,
  created_at,
  updated_at
FROM weather_data;

-- Grant access to the view
GRANT SELECT ON weather_data_formatted TO authenticated;
