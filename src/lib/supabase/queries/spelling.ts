/**
 * Spelling Words Database Queries
 *
 * Centralized database operations for spelling_words table
 * Following Architectural DNA Section 3.4: Centralized Database Query Pattern
 */

import { supabase } from '../client';
import type {
  SpellingWord,
  CreateSpellingWordData,
  UpdateSpellingWordData
} from '@/types';

/**
 * Get all spelling words (optionally filtered)
 *
 * @param filters - Optional filters for active, grade_level, difficulty, audio_verified
 * @returns Array of spelling words
 */
export async function getSpellingWords(filters?: {
  active?: boolean;
  grade_level?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  audio_verified?: boolean;
}): Promise<SpellingWord[]> {
  let query = supabase
    .from('spelling_words')
    .select('*')
    .order('word', { ascending: true });

  // Apply filters if provided
  if (filters?.active !== undefined) {
    query = query.eq('active', filters.active);
  }
  if (filters?.grade_level !== undefined) {
    query = query.eq('grade_level', filters.grade_level);
  }
  if (filters?.difficulty !== undefined) {
    query = query.eq('difficulty', filters.difficulty);
  }
  if (filters?.audio_verified !== undefined) {
    query = query.eq('audio_verified', filters.audio_verified);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching spelling words:', error);
    throw new Error(`Failed to fetch spelling words: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single spelling word by ID
 *
 * @param id - Word UUID
 * @returns Single spelling word or null
 */
export async function getSpellingWord(id: string): Promise<SpellingWord | null> {
  const { data, error } = await supabase
    .from('spelling_words')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching spelling word:', error);
    throw new Error(`Failed to fetch spelling word: ${error.message}`);
  }

  return data;
}

/**
 * Get a spelling word by its text
 *
 * @param word - The word text
 * @returns Single spelling word or null
 */
export async function getSpellingWordByText(word: string): Promise<SpellingWord | null> {
  const { data, error } = await supabase
    .from('spelling_words')
    .select('*')
    .eq('word', word.toLowerCase())
    .single();

  if (error) {
    // Not found is expected, don't throw
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching spelling word by text:', error);
    throw new Error(`Failed to fetch spelling word: ${error.message}`);
  }

  return data;
}

/**
 * Check if audio file exists in Supabase Storage
 *
 * @param audioPath - Path to audio file (e.g., 'audio/spelling/word.m4a')
 * @returns true if file exists, false otherwise
 */
export async function checkAudioExists(audioPath: string): Promise<boolean> {
  try {
    // Extract filename from path
    const filename = audioPath.split('/').pop();
    if (!filename) return false;

    const { data, error } = await supabase.storage
      .from('audio')
      .list('spelling', {
        search: filename
      });

    if (error) {
      console.warn('Error checking audio file:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.warn('Exception checking audio file:', err);
    return false;
  }
}

/**
 * Create a new spelling word
 *
 * @param wordData - Word data to create
 * @returns Created spelling word
 */
export async function addSpellingWord(
  wordData: CreateSpellingWordData
): Promise<SpellingWord> {
  // Check if word already exists
  const existingWord = await getSpellingWordByText(wordData.word);
  if (existingWord) {
    throw new Error(`Word "${wordData.word}" already exists`);
  }

  // Verify audio exists if audio_verified is true
  if (wordData.audio_verified && wordData.audio_path) {
    const audioExists = await checkAudioExists(wordData.audio_path);
    if (!audioExists) {
      throw new Error(`Audio file not found: ${wordData.audio_path}`);
    }
  }

  const { data, error } = await supabase
    .from('spelling_words')
    .insert({
      word: wordData.word.toLowerCase(),
      audio_path: wordData.audio_path,
      audio_verified: wordData.audio_verified ?? false,
      grade_level: wordData.grade_level ?? null,
      difficulty: wordData.difficulty ?? null,
      notes: wordData.notes ?? null,
      active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating spelling word:', error);
    throw new Error(`Failed to create spelling word: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing spelling word
 *
 * @param id - Word UUID
 * @param updates - Fields to update
 * @returns Updated spelling word
 */
export async function updateSpellingWord(
  id: string,
  updates: UpdateSpellingWordData
): Promise<SpellingWord> {
  // If updating audio_path and marking as verified, check file exists
  if (updates.audio_verified && updates.audio_path) {
    const audioExists = await checkAudioExists(updates.audio_path);
    if (!audioExists) {
      throw new Error(`Audio file not found: ${updates.audio_path}`);
    }
  }

  // If updating word text, check for duplicates
  if (updates.word) {
    const existingWord = await getSpellingWordByText(updates.word);
    if (existingWord && existingWord.id !== id) {
      throw new Error(`Word "${updates.word}" already exists`);
    }
    // Normalize to lowercase
    updates.word = updates.word.toLowerCase();
  }

  const { data, error } = await supabase
    .from('spelling_words')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating spelling word:', error);
    throw new Error(`Failed to update spelling word: ${error.message}`);
  }

  return data;
}

/**
 * Deactivate a spelling word (soft delete)
 *
 * @param id - Word UUID
 * @returns true if successful
 */
export async function deactivateSpellingWord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('spelling_words')
    .update({ active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deactivating spelling word:', error);
    throw new Error(`Failed to deactivate spelling word: ${error.message}`);
  }

  return true;
}

/**
 * Reactivate a deactivated spelling word
 *
 * @param id - Word UUID
 * @returns true if successful
 */
export async function reactivateSpellingWord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('spelling_words')
    .update({ active: true })
    .eq('id', id);

  if (error) {
    console.error('Error reactivating spelling word:', error);
    throw new Error(`Failed to reactivate spelling word: ${error.message}`);
  }

  return true;
}

/**
 * Permanently delete a spelling word (use with caution)
 *
 * @param id - Word UUID
 * @returns true if successful
 */
export async function deleteSpellingWord(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('spelling_words')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting spelling word:', error);
    throw new Error(`Failed to delete spelling word: ${error.message}`);
  }

  return true;
}

/**
 * Get count of words by status
 *
 * @returns Statistics about spelling words
 */
export async function getSpellingWordsStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  audioVerified: number;
  audioUnverified: number;
}> {
  const { data, error } = await supabase
    .from('spelling_words')
    .select('active, audio_verified');

  if (error) {
    console.error('Error fetching spelling words stats:', error);
    throw new Error(`Failed to fetch stats: ${error.message}`);
  }

  const stats = {
    total: data.length,
    active: data.filter(w => w.active).length,
    inactive: data.filter(w => !w.active).length,
    audioVerified: data.filter(w => w.audio_verified).length,
    audioUnverified: data.filter(w => !w.audio_verified).length
  };

  return stats;
}
