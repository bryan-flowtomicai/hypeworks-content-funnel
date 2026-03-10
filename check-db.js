#!/usr/bin/env node

/**
 * Database Verification Script
 * 
 * Checks if Supabase database tables are properly configured.
 * 
 * Usage: node check-db.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
  console.log('🔍 Checking Supabase database setup...\n')

  let allGood = true

  try {
    const { error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (usersError) {
      console.log('❌ users table:', usersError.message)
      allGood = false
    } else {
      console.log('✅ users table exists')
    }
  } catch (err) {
    console.log('❌ users table error:', err.message)
    allGood = false
  }

  try {
    const { error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .limit(1)

    if (submissionsError) {
      console.log('❌ submissions table:', submissionsError.message)
      allGood = false
    } else {
      console.log('✅ submissions table exists')
    }
  } catch (err) {
    console.log('❌ submissions table error:', err.message)
    allGood = false
  }

  console.log('\n' + '='.repeat(50))
  
  if (allGood) {
    console.log('✅ Database is properly configured!')
    console.log('\nYou can now:')
    console.log('  1. Run: npm run dev')
    console.log('  2. Visit: http://localhost:3000')
    console.log('  3. Sign up and test the app')
  } else {
    console.log('⚠️  Database tables are missing!')
    console.log('\n📋 To fix this:')
    console.log('  1. Go to: https://supabase.com/dashboard/project/_/sql/new')
    console.log('  2. Copy contents of: supabase/APPLY_THIS_MIGRATION.sql')
    console.log('  3. Paste and click "Run"')
    console.log('  4. Run this script again to verify')
    console.log('\nSee SUPABASE_SETUP.md for detailed instructions.')
  }
  console.log('='.repeat(50) + '\n')
}

checkDatabase()
