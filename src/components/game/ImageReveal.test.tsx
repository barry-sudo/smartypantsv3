import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImageReveal } from './ImageReveal';

describe('ImageReveal', () => {
  it('renders image with correct src', () => {
    render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);
    const image = screen.getByAltText('Mystery');
    expect(image).toHaveAttribute('src', 'test.jpg');
  });

  it('starts with all 25 cells covered', () => {
    render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);
    const cells = screen.getAllByRole('cell');
    expect(cells).toHaveLength(25);
    cells.forEach(cell => {
      expect(cell).toHaveClass('opacity-100');
    });
  });

  it('reveals cells as count increases', () => {
    const { rerender } = render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);

    // Initially all covered
    let cells = screen.getAllByRole('cell');
    const coveredCells = cells.filter(cell => cell.classList.contains('opacity-100'));
    expect(coveredCells).toHaveLength(25);

    // Reveal 5 cells
    rerender(<ImageReveal imageUrl="test.jpg" revealedCount={5} />);
    cells = screen.getAllByRole('cell');
    const revealedCells = cells.filter(cell => cell.classList.contains('opacity-0'));
    expect(revealedCells).toHaveLength(5);
  });

  it('does not reveal more cells than total', () => {
    render(<ImageReveal imageUrl="test.jpg" revealedCount={30} />);
    const cells = screen.getAllByRole('cell');
    const revealedCells = cells.filter(cell => cell.classList.contains('opacity-0'));
    expect(revealedCells.length).toBeLessThanOrEqual(25);
  });

  it('applies transition classes for smooth animation', () => {
    render(<ImageReveal imageUrl="test.jpg" revealedCount={0} />);
    const cells = screen.getAllByRole('cell');
    cells.forEach(cell => {
      expect(cell).toHaveClass('transition-opacity');
      expect(cell).toHaveClass('duration-700');
    });
  });
});
