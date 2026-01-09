'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface AdminAuthProps {
  onLogin: (pin: string) => boolean;
}

/**
 * PIN entry screen for admin authentication
 */
export function AdminAuth({ onLogin }: AdminAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (): void => {
    if (!pin.trim()) {
      setError('Please enter a PIN');
      return;
    }

    const success = onLogin(pin);
    if (!success) {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-jungle-dark via-jungle to-jungle-light flex items-center justify-center p-8">
      <div className="bg-white/95 rounded-[30px] p-12 border-[6px] border-orange max-w-md w-full">
        <h2 className="text-3xl font-bold text-jungle mb-2 text-center">
          Parent Access
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Enter PIN to access admin panel
        </p>

        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter PIN"
          className="text-2xl px-6 py-4 border-4 border-jungle rounded-xl w-full mb-4 text-center tracking-widest focus:outline-none focus:ring-4 focus:ring-orange"
          autoFocus
          maxLength={10}
        />

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full text-2xl py-4 bg-gradient-to-b from-orange to-orange-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
        >
          Enter
        </button>

        <Link
          href="/"
          className="block text-center text-jungle hover:text-orange mt-6 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
