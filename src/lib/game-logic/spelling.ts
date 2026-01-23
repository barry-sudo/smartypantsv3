import { getSpellingWords } from '@/lib/supabase/queries/spelling';
import { WORD_LIST } from './word-list';

/**
 * Fetch active spelling words from database
 * Falls back to WORD_LIST if database fetch fails
 *
 * @returns Array of active, audio-verified words
 */
export async function getActiveWords(): Promise<string[]> {
  try {
    const words = await getSpellingWords({ active: true, audio_verified: true });

    // If we got words from database, use them
    if (words && words.length > 0) {
      return words.map(w => w.word);
    }

    // Fallback to hardcoded list
    console.warn('No words from database, falling back to hardcoded list');
    return [...WORD_LIST];
  } catch (error) {
    console.error('Error fetching spelling words from database:', error);
    console.warn('Falling back to hardcoded word list');
    return [...WORD_LIST];
  }
}

/**
 * Selects a random word from provided word list, avoiding recently used words
 *
 * @param allWords - Complete list of available words
 * @param usedWords - Array of words already used in the current session
 * @returns A random word from the available pool
 *
 * @example
 * const word = selectRandomWord(['cat', 'dog', 'bird'], ['cat']);
 * // Returns 'dog' or 'bird'
 */
export function selectRandomWord(allWords: string[], usedWords: string[] = []): string {
  // Filter out used words
  const availableWords = allWords.filter(word => !usedWords.includes(word));

  // If all words have been used, reset and use full list
  if (availableWords.length === 0) {
    return allWords[Math.floor(Math.random() * allWords.length)];
  }

  // Select random word from available pool
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}

/**
 * Validates if the user's input matches the correct word (case-insensitive)
 *
 * @param userInput - The user's spelling attempt
 * @param correctWord - The correct spelling
 * @returns true if the spelling is correct, false otherwise
 *
 * @example
 * validateSpelling('CAT', 'cat'); // true
 * validateSpelling('kat', 'cat'); // false
 */
export function validateSpelling(userInput: string, correctWord: string): boolean {
  return userInput.toLowerCase().trim() === correctWord.toLowerCase().trim();
}

/**
 * Validates if a single letter matches the expected letter at a given position
 *
 * @param letter - The user's letter input
 * @param correctWord - The correct word
 * @param position - The index position in the word (0-based)
 * @returns true if the letter matches the position, false otherwise
 *
 * @example
 * validateLetter('c', 'cat', 0); // true
 * validateLetter('a', 'cat', 0); // false
 */
export function validateLetter(letter: string, correctWord: string, position: number): boolean {
  if (position < 0 || position >= correctWord.length) {
    return false;
  }

  return letter.toLowerCase() === correctWord[position].toLowerCase();
}
