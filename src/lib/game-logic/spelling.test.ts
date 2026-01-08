import { describe, it, expect } from 'vitest';
import { selectRandomWord, validateSpelling, validateLetter } from './spelling';
import { WORD_LIST } from './word-list';

describe('selectRandomWord', () => {
  it('returns a word from the word list', () => {
    const word = selectRandomWord();
    expect(WORD_LIST).toContain(word);
  });

  it('avoids used words when possible', () => {
    const usedWords = WORD_LIST.slice(0, 171); // All but one word
    const word = selectRandomWord(usedWords);
    expect(usedWords).not.toContain(word);
  });

  it('resets to full list when all words are used', () => {
    const allWords = [...WORD_LIST];
    const word = selectRandomWord(allWords);
    expect(WORD_LIST).toContain(word);
  });

  it('generates different words across multiple calls', () => {
    const words = new Set<string>();
    for (let i = 0; i < 20; i++) {
      words.add(selectRandomWord());
    }
    // Should generate at least some variety
    expect(words.size).toBeGreaterThan(1);
  });

  it('handles empty used words array', () => {
    const word = selectRandomWord([]);
    expect(WORD_LIST).toContain(word);
  });

  it('handles undefined used words', () => {
    const word = selectRandomWord();
    expect(WORD_LIST).toContain(word);
  });
});

describe('validateSpelling', () => {
  it('returns true for exact match', () => {
    expect(validateSpelling('cat', 'cat')).toBe(true);
  });

  it('returns true for case-insensitive match', () => {
    expect(validateSpelling('CAT', 'cat')).toBe(true);
    expect(validateSpelling('Cat', 'cat')).toBe(true);
    expect(validateSpelling('cat', 'CAT')).toBe(true);
  });

  it('returns false for incorrect spelling', () => {
    expect(validateSpelling('kat', 'cat')).toBe(false);
    expect(validateSpelling('dog', 'cat')).toBe(false);
  });

  it('trims whitespace before comparison', () => {
    expect(validateSpelling(' cat ', 'cat')).toBe(true);
    expect(validateSpelling('cat', ' cat ')).toBe(true);
  });

  it('handles empty strings', () => {
    expect(validateSpelling('', 'cat')).toBe(false);
    expect(validateSpelling('cat', '')).toBe(false);
  });
});

describe('validateLetter', () => {
  it('returns true for correct letter at position', () => {
    expect(validateLetter('c', 'cat', 0)).toBe(true);
    expect(validateLetter('a', 'cat', 1)).toBe(true);
    expect(validateLetter('t', 'cat', 2)).toBe(true);
  });

  it('returns false for incorrect letter at position', () => {
    expect(validateLetter('a', 'cat', 0)).toBe(false);
    expect(validateLetter('c', 'cat', 1)).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(validateLetter('C', 'cat', 0)).toBe(true);
    expect(validateLetter('c', 'CAT', 0)).toBe(true);
  });

  it('returns false for out-of-bounds position', () => {
    expect(validateLetter('x', 'cat', 5)).toBe(false);
    expect(validateLetter('x', 'cat', -1)).toBe(false);
  });

  it('handles empty letter', () => {
    expect(validateLetter('', 'cat', 0)).toBe(false);
  });
});
