import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { weatherService } from '../services/weatherService';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Weather data for AFPA_070 - Total Fuel for Depressurisation at CP/DP
// Based on complete RSWT EXTRACT from the question
const afpa070WeatherData = {
  weather_id: 'AFPA_070_WEATHER_001',
  scenario_name: 'DARWIN_MELBOURNE_DEPRESSURISATION',
  route_from: 'YPDN',
  route_to: 'YMML',
  
  // Complete RSWT extract with all standard flight levels
  rswt_data: {
    "185": { isa_dev: -21, ypdn_ybas: "280/30", ybas_lec: "280/20", lec_ymml: "270/30" },
    "235": { isa_dev: -32, ypdn_ybas: "280/50", ybas_lec: "200/30", lec_ymml: "240/30" },
    "300": { isa_dev: -45, ypdn_ybas: "290/60", ybas_lec: "270/20", lec_ymml: "260/50" },
    "340": { isa_dev: -52, ypdn_ybas: "300/40", ybas_lec: "210/20", lec_ymml: "270/45" },
    "385": { isa_dev: -56, ypdn_ybas: "300/45", ybas_lec: "320/60", lec_ymml: "300/60" },
    "445": { isa_dev: -56, ypdn_ybas: "310/45", ybas_lec: "320/50", lec_ymml: "290/50" }
  },
  
  // Route information
  total_distance_nm: 1850, // Total route distance
  segment_distances: {
    'YPDN to YBAS': 1200, // Darwin to Alice Springs
    'YBAS to CP/DP': 480, // Alice Springs to CP/DP (6nm south of YLEC)
    'CP/DP to YMML': 320  // CP/DP to Melbourne
  },
  
  // Additional weather parameters
  pressure_altitude: 34000, // FL340 pressure altitude
  visibility_nm: 10.0, // Good visibility
  cloud_base_ft: 5000 // Cloud base at 5000ft
};

// Additional weather scenarios for other questions
const additionalWeatherData = [
  {
    weather_id: 'AFPA_016_WEATHER_001',
    scenario_name: 'DARWIN_PORT_MORESBY_NORMAL',
    route_from: 'YPDN',
    route_to: 'AYPY',
    
    // Complete RSWT extract (simplified for this route)
    rswt_data: {
      "185": { isa_dev: -21, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" },
      "235": { isa_dev: -32, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" },
      "300": { isa_dev: -45, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" },
      "340": { isa_dev: -39, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" },
      "385": { isa_dev: -56, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" },
      "445": { isa_dev: -56, ypdn_ybas: "170/14", ybas_lec: "170/14", lec_ymml: "170/14" }
    },
    
    total_distance_nm: 1200,
    pressure_altitude: 34000,
    visibility_nm: 15.0,
    cloud_base_ft: 8000
  }
];

async function populateWeatherData() {
  console.log('Starting weather data population...');
  
  try {
    // Insert AFPA_070 weather data
    console.log('Inserting AFPA_070 weather data...');
    const { error: afpa070Error } = await supabase
      .from('weather_data')
      .upsert(afpa070WeatherData, { onConflict: 'weather_id' });
    
    if (afpa070Error) {
      console.error('Error inserting AFPA_070 weather data:', afpa070Error);
      throw afpa070Error;
    }
    
    console.log('✅ AFPA_070 weather data inserted successfully');
    
    // Insert additional weather data
    console.log('Inserting additional weather data...');
    const { error: additionalError } = await supabase
      .from('weather_data')
      .upsert(additionalWeatherData, { onConflict: 'weather_id' });
    
    if (additionalError) {
      console.error('Error inserting additional weather data:', additionalError);
      throw additionalError;
    }
    
    console.log('✅ Additional weather data inserted successfully');
    
    // Verify the data was inserted
    console.log('Verifying weather data...');
    const { data: weatherData, error: verifyError } = await supabase
      .from('weather_data')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying weather data:', verifyError);
      throw verifyError;
    }
    
    console.log(`✅ Successfully populated ${weatherData.length} weather records`);
    console.log('Weather data summary:');
    weatherData.forEach(wd => {
      console.log(`- ${wd.weather_id}: ${wd.scenario_name} (${wd.route_from} → ${wd.route_to})`);
    });
    
    return weatherData.length;
    
  } catch (error) {
    console.error('❌ Failed to populate weather data:', error);
    throw error;
  }
}

// Function to verify weather data
async function verifyWeatherData() {
  try {
    const { data, error } = await supabase
      .from('weather_data_formatted')
      .select('*')
      .order('scenario_name');
    
    if (error) {
      console.error('Error verifying weather data:', error);
      return;
    }
    
    console.log('Weather data verification:');
    data.forEach(wd => {
      console.log(`\n${wd.scenario_name} (${wd.weather_id}):`);
      console.log(`  Route: ${wd.route_from} → ${wd.route_to}`);
      console.log(`  Wind FL330: ${wd.wind_fl330_formatted}`);
      console.log(`  Wind FL130: ${wd.wind_fl130_formatted}`);
      console.log(`  SAT FL330: ${wd.sat_fl330_formatted}`);
      console.log(`  SAT FL130: ${wd.sat_fl130_formatted}`);
      console.log(`  Distance: ${wd.total_distance_nm} nm`);
    });
    
  } catch (error) {
    console.error('Error in verification:', error);
  }
}

// Run the population if this script is executed directly
if (require.main === module) {
  populateWeatherData()
    .then(count => {
      console.log(`\n🎉 Weather data population completed successfully!`);
      console.log(`📊 Total records: ${count}`);
      return verifyWeatherData();
    })
    .catch(error => {
      console.error('❌ Population failed:', error);
      process.exit(1);
    });
}

export { populateWeatherData, verifyWeatherData };
