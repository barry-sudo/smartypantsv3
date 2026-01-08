import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { LetterBoxes } from './LetterBoxes';

describe('LetterBoxes', () => {
  it('renders correct number of input boxes', () => {
    const onComplete = vi.fn();
    const { container } = render(
      <LetterBoxes wordLength={3} correctWord="cat" onComplete={onComplete} />
    );

    const inputs = container.querySelectorAll('input');
    expect(inputs).toHaveLength(3);
  });

  it('renders boxes for different word lengths', () => {
    const onComplete = vi.fn();
    const { container: container1 } = render(
      <LetterBoxes wordLength={5} correctWord="hello" onComplete={onComplete} />
    );
    expect(container1.querySelectorAll('input')).toHaveLength(5);

    const { container: container2 } = render(
      <LetterBoxes wordLength={8} correctWord="together" onComplete={onComplete} />
    );
    expect(container2.querySelectorAll('input')).toHaveLength(8);
  });

  it('applies correct styling classes', () => {
    const onComplete = vi.fn();
    const { container } = render(
      <LetterBoxes wordLength={3} correctWord="cat" onComplete={onComplete} />
    );

    const input = container.querySelector('input');
    expect(input?.className).toContain('border-jungle');
    expect(input?.className).toContain('rounded-xl');
    expect(input?.className).toContain('uppercase');
  });

  it('sets maxLength to 1 for each input', () => {
    const onComplete = vi.fn();
    const { container } = render(
      <LetterBoxes wordLength={3} correctWord="cat" onComplete={onComplete} />
    );

    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      expect(input.getAttribute('maxLength')).toBe('1');
    });
  });
});
