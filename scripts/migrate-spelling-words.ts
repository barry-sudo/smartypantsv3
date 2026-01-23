/**
 * One-time migration script to seed spelling_words table from word-list.ts
 *
 * Usage:
 *   npx tsx scripts/migrate-spelling-words.ts
 *
 * Prerequisites:
 *   npm install -D tsx
 *
 * Environment Variables Required:
 *   NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (admin access)
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { WORD_LIST } from '../src/lib/game-logic/word-list';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface MigrationResult {
  word: string;
  success: boolean;
  audioExists: boolean;
  error?: string;
}

/**
 * Check if audio file exists in Supabase Storage
 */
async function checkAudioExists(word: string): Promise<boolean> {
  const audioPath = `audio/spelling/${word.toLowerCase()}.m4a`;

  try {
    const { data, error } = await supabase.storage
      .from('audio')
      .list('spelling', {
        search: `${word.toLowerCase()}.m4a`
      });

    if (error) {
      console.warn(`⚠️  Error checking audio for "${word}":`, error.message);
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.warn(`⚠️  Exception checking audio for "${word}":`, err);
    return false;
  }
}

/**
 * Migrate a single word to database
 */
async function migrateWord(word: string): Promise<MigrationResult> {
  const audioPath = `audio/spelling/${word.toLowerCase()}.m4a`;

  // Check if audio file exists
  const audioExists = await checkAudioExists(word);

  // Insert word into database
  const { data, error } = await supabase
    .from('spelling_words')
    .insert({
      word: word,
      audio_path: audioPath,
      audio_verified: audioExists,
      grade_level: 2,  // Default: 2nd grade (Dolch sight words)
      difficulty: 'easy',
      active: true
    })
    .select()
    .single();

  if (error) {
    return {
      word,
      success: false,
      audioExists,
      error: error.message
    };
  }

  return {
    word,
    success: true,
    audioExists
  };
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting spelling words migration...');
  console.log(`📝 Found ${WORD_LIST.length} words in word-list.ts\n`);

  const results: MigrationResult[] = [];
  let successCount = 0;
  let audioVerifiedCount = 0;
  let failureCount = 0;

  // Migrate each word
  for (const word of WORD_LIST) {
    const result = await migrateWord(word);
    results.push(result);

    if (result.success) {
      successCount++;
      if (result.audioExists) {
        audioVerifiedCount++;
        console.log(`✅ ${word} (audio verified)`);
      } else {
        console.log(`⚠️  ${word} (audio NOT found)`);
      }
    } else {
      failureCount++;
      console.log(`❌ ${word} - ${result.error}`);
    }

    // Rate limiting: small delay between requests
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  // Summary
  console.log('\n📊 Migration Summary:');
  console.log(`   Total words: ${WORD_LIST.length}`);
  console.log(`   ✅ Successfully migrated: ${successCount}`);
  console.log(`   🎵 Audio verified: ${audioVerifiedCount}`);
  console.log(`   ⚠️  Missing audio: ${successCount - audioVerifiedCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);

  // List words missing audio
  const missingAudio = results.filter(r => r.success && !r.audioExists);
  if (missingAudio.length > 0) {
    console.log('\n⚠️  Words missing audio files:');
    missingAudio.forEach(r => console.log(`   - ${r.word}`));
    console.log('\nPlease upload audio files for these words.');
  }

  // Exit with error code if any failures
  if (failureCount > 0) {
    console.error(`\n❌ Migration completed with ${failureCount} failures`);
    process.exit(1);
  }

  console.log('\n✅ Migration completed successfully!');
}

// Run migration
migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
