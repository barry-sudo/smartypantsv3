import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from './Timer';

describe('Timer', () => {
  it('displays time in MM:SS format', () => {
    render(<Timer seconds={0} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('formats single digit seconds with leading zero', () => {
    render(<Timer seconds={5} />);
    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('displays minutes correctly', () => {
    render(<Timer seconds={125} />);
    expect(screen.getByText('02:05')).toBeInTheDocument();
  });

  it('displays double digit seconds correctly', () => {
    render(<Timer seconds={75} />);
    expect(screen.getByText('01:15')).toBeInTheDocument();
  });

  it('handles zero seconds', () => {
    render(<Timer seconds={0} />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('handles exactly 60 seconds', () => {
    render(<Timer seconds={60} />);
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  it('handles large time values', () => {
    render(<Timer seconds={3661} />); // 61 minutes, 1 second
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });
});
