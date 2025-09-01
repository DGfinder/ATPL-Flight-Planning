// Simple Supabase connection test
// Run this in browser console to test connectivity

import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connectivity...');
    const { error } = await supabase
      .from('questions')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');
    
    // Test 2: Authentication check
    console.log('🔐 Checking authentication status...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      console.log('✅ User authenticated:', session.user?.email);
    } else {
      console.log('ℹ️  No active session (guest mode)');
    }
    
    // Test 3: Database schema check
    console.log('🗄️ Checking database tables...');
    const tables = ['questions', 'user_progress', 'study_sessions', 'profiles'];
    
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.warn(`⚠️  Table '${table}' might not exist:`, tableError.message);
      } else {
        console.log(`✅ Table '${table}' accessible`);
      }
    }
    
    console.log('🎉 Supabase connection test completed!');
    return true;
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    return false;
  }
}

// Make function available globally for browser console testing
(window as Window & { testSupabaseConnection?: typeof testSupabaseConnection }).testSupabaseConnection = testSupabaseConnection;