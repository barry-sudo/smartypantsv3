#!/usr/bin/env node

/**
 * Supabase Connection Test Script
 * 
 * Tests connection to Supabase and queries the sessions table.
 * Uses credentials from .env.local file.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== Supabase Connection Test ===\n');

// Validate environment variables
if (!SUPABASE_URL) {
  console.error('❌ ERROR: Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

if (!SUPABASE_ANON_KEY && !SUPABASE_SERVICE_KEY) {
  console.error('❌ ERROR: Missing both NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('✓ Environment variables loaded');
console.log(`  URL: ${SUPABASE_URL}`);

// Determine which key to use
let apiKey = SUPABASE_ANON_KEY;
let keyType = 'anon';

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('sb_secret_')) {
  console.log('  ⚠ Anon key appears invalid, using service role key instead');
  apiKey = SUPABASE_SERVICE_KEY;
  keyType = 'service_role';
}

console.log(`  Using ${keyType} key: ${apiKey.substring(0, 20)}...`);
console.log();

// Create Supabase client
const supabase = createClient(SUPABASE_URL, apiKey);
console.log('✓ Supabase client created\n');

async function testConnection() {
  try {
    // Test 1: Query sessions table
    console.log('Test 1: Querying sessions table...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('sessions')
      .select('*')
      .limit(5);

    if (sessionsError) {
      console.error('❌ Sessions query failed:', sessionsError.message);
      console.error('   Details:', sessionsError);
      console.error('\n   Possible issues:');
      console.error('   - API key is invalid or expired');
      console.error('   - Database tables not created yet (run migrations)');
      console.error('   - Row Level Security (RLS) blocking access');
      return false;
    }

    console.log(`✓ Sessions table accessible`);
    console.log(`  Found ${sessions.length} session(s)`);
    if (sessions.length > 0) {
      console.log('  Sample session:', JSON.stringify(sessions[0], null, 2));
    }
    console.log();

    // Test 2: Query attempts table
    console.log('Test 2: Querying attempts table...');
    const { data: attempts, error: attemptsError } = await supabase
      .from('attempts')
      .select('*')
      .limit(5);

    if (attemptsError) {
      console.error('❌ Attempts query failed:', attemptsError.message);
      return false;
    }

    console.log(`✓ Attempts table accessible`);
    console.log(`  Found ${attempts.length} attempt(s)`);
    console.log();

    // Test 3: Query goals table
    console.log('Test 3: Querying goals table...');
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .limit(5);

    if (goalsError) {
      console.error('❌ Goals query failed:', goalsError.message);
      return false;
    }

    console.log(`✓ Goals table accessible`);
    console.log(`  Found ${goals.length} goal(s)`);
    console.log();

    // Test 4: Check table schemas
    console.log('Test 4: Checking table existence...');
    const tables = ['sessions', 'attempts', 'goals'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Table '${table}' not accessible:`, error.message);
        return false;
      }
      
      console.log(`✓ Table '${table}' exists (${count} rows)`);
    }
    console.log();

    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('   Stack:', error.stack);
    return false;
  }
}

// Run tests
testConnection().then((success) => {
  console.log('\n=== Test Summary ===');
  if (success) {
    console.log('✓ All tests passed!');
    console.log('  Supabase connection is working correctly.');
    console.log('  Database schema is properly set up.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed.');
    console.log('  Check error messages above for details.');
    console.log('\n  Next steps:');
    console.log('  1. Verify your Supabase project is active');
    console.log('  2. Check that API keys are correct in .env.local');
    console.log('  3. Run database migrations if tables don\'t exist');
    console.log('  4. Check RLS policies in Supabase dashboard');
    process.exit(1);
  }
});
