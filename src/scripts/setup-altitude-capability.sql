-- B727 Altitude Capability Table
-- Based on POH data for weight/altitude limitations and cruise thrust limits

CREATE TABLE IF NOT EXISTS altitude_capability (
  id SERIAL PRIMARY KEY,
  flight_level INTEGER NOT NULL,
  cruise_schedule VARCHAR(10) NOT NULL,
  tat_for_isa INTEGER,
  optimum_weight_for_flight_level_kg INTEGER,
  cruise_thrust_limit_isa_minus_5 DECIMAL(4,1),
  cruise_thrust_limit_isa DECIMAL(4,1),
  cruise_thrust_limit_isa_plus_5 DECIMAL(4,1),
  cruise_thrust_limit_isa_plus_10 DECIMAL(4,1),
  cruise_thrust_limit_isa_plus_15 DECIMAL(4,1),
  cruise_thrust_limit_isa_plus_20 DECIMAL(4,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_altitude_capability_fl_schedule 
ON altitude_capability(flight_level, cruise_schedule);

CREATE INDEX IF NOT EXISTS idx_altitude_capability_weight_lookup 
ON altitude_capability(cruise_schedule, cruise_thrust_limit_isa);

-- Enable Row Level Security (RLS)
ALTER TABLE altitude_capability ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY IF NOT EXISTS "Allow read access to altitude capability data"
ON altitude_capability
FOR SELECT
TO authenticated
USING (true);

-- Allow admin users to insert/update (for data management)
CREATE POLICY IF NOT EXISTS "Allow admin users to manage altitude capability data"
ON altitude_capability
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (role = 'admin' OR role = 'instructor')
  )
);

COMMENT ON TABLE altitude_capability IS 'B727 altitude capability data from POH for weight/altitude validation and cruise thrust limits across ISA deviations';
COMMENT ON COLUMN altitude_capability.flight_level IS 'Flight level (e.g., 350 for FL350)';
COMMENT ON COLUMN altitude_capability.cruise_schedule IS 'Cruise schedule: LRC, 0.79, 0.80, 0.82, 0.84';
COMMENT ON COLUMN altitude_capability.tat_for_isa IS 'Total Air Temperature for ISA conditions (°C)';
COMMENT ON COLUMN altitude_capability.optimum_weight_for_flight_level_kg IS 'Optimum weight for this flight level (kg × 1000)';
COMMENT ON COLUMN altitude_capability.cruise_thrust_limit_isa IS 'Cruise weight limit at ISA conditions (1000kg)';