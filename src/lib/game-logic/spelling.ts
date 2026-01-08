import { WORD_LIST } from './word-list';

/**
 * Selects a random word from the word list, avoiding recently used words
 *
 * @param usedWords - Array of words already used in the current session
 * @returns A random word from the available pool
 *
 * @example
 * const word = selectRandomWord(['cat', 'dog']);
 * // Returns a word that is not 'cat' or 'dog'
 */
export function selectRandomWord(usedWords: string[] = []): string {
  // Filter out used words
  const availableWords = WORD_LIST.filter(word => !usedWords.includes(word));

  // If all words have been used, reset and use full list
  if (availableWords.length === 0) {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
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
