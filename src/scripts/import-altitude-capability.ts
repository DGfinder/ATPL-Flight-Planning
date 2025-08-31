import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AltitudeCapabilityRow {
  flight_level: number;
  cruise_schedule: string;
  tat_for_isa: number | null;
  optimum_weight_for_flight_level_kg: number | null;
  cruise_thrust_limit_isa_minus_5: number | null;
  cruise_thrust_limit_isa: number | null;
  cruise_thrust_limit_isa_plus_5: number | null;
  cruise_thrust_limit_isa_plus_10: number | null;
  cruise_thrust_limit_isa_plus_15: number | null;
  cruise_thrust_limit_isa_plus_20: number | null;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseValue(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === 'null') return null;
  const parsed = parseFloat(trimmed);
  return isNaN(parsed) ? null : parsed;
}

async function importAltitudeCapability() {
  try {
    console.log('Reading CSV file...');
    const csvPath = path.join(__dirname, '../../B727_altitude_capability - b727_altitude_capability.csv.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.split('\n').filter(line => line.trim());
    const headers = parseCSVLine(lines[0]);
    
    console.log('Headers:', headers);
    console.log(`Processing ${lines.length - 1} data rows...`);
    
    const rows: AltitudeCapabilityRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length >= 4) {
        const row: AltitudeCapabilityRow = {
          flight_level: parseInt(values[0]) || 0,
          cruise_schedule: values[1] || '',
          tat_for_isa: parseValue(values[2]),
          optimum_weight_for_flight_level_kg: parseValue(values[3]),
          cruise_thrust_limit_isa_minus_5: parseValue(values[4]),
          cruise_thrust_limit_isa: parseValue(values[5]),
          cruise_thrust_limit_isa_plus_5: parseValue(values[6]),
          cruise_thrust_limit_isa_plus_10: parseValue(values[7]),
          cruise_thrust_limit_isa_plus_15: parseValue(values[8]),
          cruise_thrust_limit_isa_plus_20: parseValue(values[9])
        };
        
        if (row.flight_level > 0 && row.cruise_schedule) {
          rows.push(row);
        }
      }
    }
    
    console.log(`Parsed ${rows.length} valid rows`);
    console.log('Sample row:', rows[0]);
    
    // Clear existing data
    console.log('Clearing existing altitude capability data...');
    const { error: deleteError } = await supabase
      .from('altitude_capability')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('Error clearing data:', deleteError);
      return;
    }
    
    // Insert new data in batches
    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)}...`);
      
      const { error } = await supabase
        .from('altitude_capability')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        return;
      }
    }
    
    console.log('✅ Altitude capability data imported successfully!');
    
    // Verify import
    const { data: verifyData, error: verifyError } = await supabase
      .from('altitude_capability')
      .select('count(*)', { count: 'exact' });
    
    if (verifyError) {
      console.error('Error verifying import:', verifyError);
      return;
    }
    
    console.log(`✅ Verified: ${verifyData?.[0]?.count || 0} rows imported`);
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run import if called directly
if (require.main === module) {
  importAltitudeCapability()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

export { importAltitudeCapability };