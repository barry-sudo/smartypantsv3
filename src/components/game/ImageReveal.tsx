'use client';

import { useState, useEffect } from 'react';

interface ImageRevealProps {
  imageUrl: string;
  revealedCount: number;
}

export function ImageReveal({ imageUrl, revealedCount }: ImageRevealProps): JSX.Element {
  const [revealedCells, setRevealedCells] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (revealedCount > revealedCells.size) {
      // Reveal random unrevealed cell
      const unrevealedCells = Array.from({ length: 25 }, (_, i) => i)
        .filter(i => !revealedCells.has(i));

      if (unrevealedCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * unrevealedCells.length);
        const cellToReveal = unrevealedCells[randomIndex];
        setRevealedCells(prev => new Set(Array.from(prev).concat(cellToReveal)));
      }
    }
  }, [revealedCount, revealedCells]);

  return (
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt="Mystery"
        className="w-full h-full object-contain rounded-2xl"
      />
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 pointer-events-none">
        {Array.from({ length: 25 }, (_, i) => (
          <div
            key={i}
            role="cell"
            className={`
              bg-black border border-orange/30 transition-opacity duration-700
              ${revealedCells.has(i) ? 'opacity-0' : 'opacity-100'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
