# Build Spec: Phase 2C - Spelling Game

**Phase:** 2C  
**Feature:** Spelling game module  
**Complexity:** Medium  
**Estimated Time:** ~3 hours  
**Status:** ⏳ Not Started

---

## Objective

Build spelling game with audio word pronunciation, individual letter input boxes, and auto-advance functionality. Follows Phase 2A pattern with modifications for spelling-specific UI.

---

## Prerequisites

- [x] Phase 2A complete (pattern established)
- [x] 172 spelling word audio files uploaded to Supabase
- [x] Shared components available

---

## What to Build

### Files to Create

1. `src/lib/game-logic/spelling.ts` - Word selection logic
2. `src/lib/game-logic/spelling.test.ts` - Tests
3. `src/lib/game-logic/word-list.ts` - 172-word array
4. `src/components/game/LetterBoxes.tsx` - Individual letter inputs
5. `src/components/game/LetterBoxes.test.tsx` - Component tests
6. `src/app/spelling/page.tsx` - Spelling game page

---

## Word Selection Logic

**Location:** `src/lib/game-logic/spelling.ts`

```typescript
import { WORD_LIST } from './word-list';

export function selectRandomWord(usedWords: string[] = []): string {
  const availableWords = WORD_LIST.filter(w => !usedWords.includes(w));
  
  if (availableWords.length === 0) {
    // Reset used words when exhausted
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
}
```

**Location:** `src/lib/game-logic/word-list.ts`

```typescript
// 172 sight words (from HTML version, excluding single letters)
export const WORD_LIST = [
  "and", "away", "big", "blue", "can", "come", "down", "find", "for", 
  "funny", "go", "help", "here", "in", "is", "it", "jump", "little",
  // ... (all 172 words)
] as const;
```

---

## LetterBoxes Component

**Location:** `src/components/game/LetterBoxes.tsx`

**Purpose:** Display individual input boxes for each letter with auto-advance

```typescript
interface LetterBoxesProps {
  wordLength: number;
  correctWord: string;
  onComplete: () => void;
}

export function LetterBoxes({ wordLength, correctWord, onComplete }: LetterBoxesProps) {
  const [values, setValues] = useState<string[]>(Array(wordLength).fill(''));
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const handleInput = (index: number, value: string) => {
    const letter = value.toLowerCase();
    const correctLetter = correctWord[index];
    
    if (letter === correctLetter) {
      // Correct letter
      const newValues = [...values];
      newValues[index] = letter;
      setValues(newValues);
      
      if (index < wordLength - 1) {
        // Move to next box
        setCurrentIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      } else {
        // Word complete!
        onComplete();
      }
    } else {
      // Incorrect - shake and clear
      const input = inputRefs.current[index];
      input?.classList.add('shake');
      setTimeout(() => {
        input?.classList.remove('shake');
        if (input) input.value = '';
      }, 300);
    }
  };
  
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {Array.from({ length: wordLength }, (_, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          maxLength={1}
          className="w-20 h-20 text-4xl text-center border-4 border-jungle rounded-xl uppercase"
          value={values[i]}
          onChange={(e) => handleInput(i, e.target.value)}
          disabled={values[i] !== ''}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}
```

---

## Spelling Game Page

**Location:** `src/app/spelling/page.tsx`

**Key differences from math games:**
- Audio plays word pronunciation (from Supabase Storage)
- LetterBoxes component instead of number input
- "Play Word Again" button (replay audio)
- Optional: "Now write the word" prompt after correct spelling

**Flow:**
1. Select random word
2. Play audio: `ASSETS.getSpellingAudio(word)`
3. Display LetterBoxes for word.length
4. On complete: play tiger roar, reveal cell, next word
5. After 25 words: celebration

---

## Success Criteria

### Functional
- [ ] Word audio plays on load
- [ ] Can replay audio with button
- [ ] Letter boxes auto-advance on correct input
- [ ] Incorrect letters shake and clear
- [ ] Grid reveals per correct word
- [ ] Celebration after 25 words

### Technical
- [ ] Audio handles autoplay restrictions
- [ ] All 172 words accessible
- [ ] No word repetition in session
- [ ] Database logging works

---

## Estimated Complexity

**Medium** - ~3 hours

More complex than addition due to:
- Audio playback handling
- Custom LetterBoxes component
- Auto-advance logic

---

## Reference Materials

- HTML reference: `OLD-VERSION/spelling.html`
- Audio asset pattern: `src/lib/assets.ts` (getSpellingAudio function)
- Game pattern: Phase 2A subtraction

---

## Notes

**Audio autoplay:** Modern browsers block autoplay. Handle gracefully:
```typescript
audio.play().catch(() => {
  // Show "Click to hear word" message
});
```

**Write prompt (optional):** After correct spelling, show "Now write the word" with "I'm Done" button before advancing. This connects digital to physical practice.
