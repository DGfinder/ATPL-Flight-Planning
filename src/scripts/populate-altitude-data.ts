// Browser-based script to populate altitude capability data
// Run this in browser console after authentication

declare global {
  interface Window {
    populateAltitudeCapability: () => Promise<void>;
    verifyAltitudeCapability: () => Promise<void>;
  }
}

const altitudeCapabilityData = [
  {flight_level: 410, cruise_schedule: 'LRC', tat_for_isa: -30, optimum_weight_for_flight_level_kg: null, cruise_thrust_limit_isa_minus_5: null, cruise_thrust_limit_isa: 57.1, cruise_thrust_limit_isa_plus_5: 56.3, cruise_thrust_limit_isa_plus_10: 55.2, cruise_thrust_limit_isa_plus_15: null, cruise_thrust_limit_isa_plus_20: null},
  {flight_level: 410, cruise_schedule: '0.79', tat_for_isa: -30, optimum_weight_for_flight_level_kg: null, cruise_thrust_limit_isa_minus_5: null, cruise_thrust_limit_isa: 57.5, cruise_thrust_limit_isa_plus_5: 56.8, cruise_thrust_limit_isa_plus_10: 55.7, cruise_thrust_limit_isa_plus_15: null, cruise_thrust_limit_isa_plus_20: null},
  {flight_level: 410, cruise_schedule: '0.8', tat_for_isa: -29, optimum_weight_for_flight_level_kg: null, cruise_thrust_limit_isa_minus_5: null, cruise_thrust_limit_isa: 57.1, cruise_thrust_limit_isa_plus_5: 56.3, cruise_thrust_limit_isa_plus_10: 55.1, cruise_thrust_limit_isa_plus_15: null, cruise_thrust_limit_isa_plus_20: null},
  {flight_level: 410, cruise_schedule: '0.82', tat_for_isa: -27, optimum_weight_for_flight_level_kg: null, cruise_thrust_limit_isa_minus_5: null, cruise_thrust_limit_isa: 55.6, cruise_thrust_limit_isa_plus_5: 54.7, cruise_thrust_limit_isa_plus_10: null, cruise_thrust_limit_isa_plus_15: null, cruise_thrust_limit_isa_plus_20: null},
  {flight_level: 390, cruise_schedule: 'LRC', tat_for_isa: -30, optimum_weight_for_flight_level_kg: 54.5, cruise_thrust_limit_isa_minus_5: 63.5, cruise_thrust_limit_isa: 63.0, cruise_thrust_limit_isa_plus_5: 62.1, cruise_thrust_limit_isa_plus_10: 60.9, cruise_thrust_limit_isa_plus_15: 59.1, cruise_thrust_limit_isa_plus_20: 56.8},
  {flight_level: 390, cruise_schedule: '0.79', tat_for_isa: -30, optimum_weight_for_flight_level_kg: 55.3, cruise_thrust_limit_isa_minus_5: 64.0, cruise_thrust_limit_isa: 63.4, cruise_thrust_limit_isa_plus_5: 62.6, cruise_thrust_limit_isa_plus_10: 61.4, cruise_thrust_limit_isa_plus_15: 59.6, cruise_thrust_limit_isa_plus_20: 57.2},
  {flight_level: 390, cruise_schedule: '0.8', tat_for_isa: -29, optimum_weight_for_flight_level_kg: 55.3, cruise_thrust_limit_isa_minus_5: 63.5, cruise_thrust_limit_isa: 62.9, cruise_thrust_limit_isa_plus_5: 62.1, cruise_thrust_limit_isa_plus_10: 60.8, cruise_thrust_limit_isa_plus_15: 58.9, cruise_thrust_limit_isa_plus_20: 56.4},
  {flight_level: 390, cruise_schedule: '0.82', tat_for_isa: -27, optimum_weight_for_flight_level_kg: 55.3, cruise_thrust_limit_isa_minus_5: 62.0, cruise_thrust_limit_isa: 61.3, cruise_thrust_limit_isa_plus_5: 60.4, cruise_thrust_limit_isa_plus_10: 58.9, cruise_thrust_limit_isa_plus_15: 56.8, cruise_thrust_limit_isa_plus_20: null},
  {flight_level: 390, cruise_schedule: '0.84', tat_for_isa: -26, optimum_weight_for_flight_level_kg: 53.5, cruise_thrust_limit_isa_minus_5: 59.4, cruise_thrust_limit_isa: 58.6, cruise_thrust_limit_isa_plus_5: 57.6, cruise_thrust_limit_isa_plus_10: 55.9, cruise_thrust_limit_isa_plus_15: null, cruise_thrust_limit_isa_plus_20: null}
  // Add remaining rows...
];

async function populateAltitudeCapability() {
  try {
    console.log('Populating altitude capability data...');
    
    // Import supabase client
    const { supabase } = await import('../lib/supabase');
    
    // Clear existing data
    const { error: deleteError } = await supabase
      .from('altitude_capability')
      .delete()
      .neq('id', 0);
    
    if (deleteError) {
      console.error('Error clearing data:', deleteError);
      return;
    }
    
    // Insert data in batches
    const batchSize = 20;
    for (let i = 0; i < altitudeCapabilityData.length; i += batchSize) {
      const batch = altitudeCapabilityData.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('altitude_capability')
        .insert(batch);
      
      if (error) {
        console.error('Error inserting batch:', error);
        return;
      }
      
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(altitudeCapabilityData.length / batchSize)}`);
    }
    
    console.log('✅ Altitude capability data populated successfully!');
  } catch (error) {
    console.error('Population failed:', error);
  }
}

async function verifyAltitudeCapability() {
  try {
    const { supabase } = await import('../lib/supabase');
    
    const { data, error } = await supabase
      .from('altitude_capability')
      .select('count(*)', { count: 'exact' });
    
    if (error) {
      console.error('Verification error:', error);
      return;
    }
    
    console.log(`✅ Altitude capability records: ${(data as any)?.[0]?.count || 0}`);
    
    // Test sample query
    const { data: sampleData, error: sampleError } = await supabase
      .from('altitude_capability')
      .select('*')
      .eq('flight_level', 350)
      .eq('cruise_schedule', 'LRC')
      .single();
    
    if (sampleError) {
      console.error('Sample query error:', sampleError);
      return;
    }
    
    console.log('✅ Sample FL350 LRC data:', sampleData);
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Make functions available globally for browser console
window.populateAltitudeCapability = populateAltitudeCapability;
window.verifyAltitudeCapability = verifyAltitudeCapability;

export { populateAltitudeCapability, verifyAltitudeCapability };