'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { SpellingWord, CreateSpellingWordData } from '@/types';

interface WordFormProps {
  word?: SpellingWord | null;  // For editing existing word
  onComplete: () => void;
  onCancel: () => void;
}

export function WordForm({ word, onComplete, onCancel }: WordFormProps) {
  const [formData, setFormData] = useState({
    word: word?.word || '',
    grade_level: word?.grade_level || 2,
    difficulty: word?.difficulty || 'easy' as 'easy' | 'medium' | 'hard',
    notes: word?.notes || ''
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(
    word?.audio_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${word.audio_path}` : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade_level' ? parseInt(value) || null : value
    }));
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      setError('Please select an audio file (MP3, M4A, WAV, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Audio file must be less than 5MB');
      return;
    }

    setAudioFile(file);
    setAudioPreview(URL.createObjectURL(file));
    setError(null);
  };

  const uploadAudio = async (wordText: string): Promise<string> => {
    if (!audioFile) {
      throw new Error('No audio file selected');
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileName = `${wordText.toLowerCase()}.m4a`;
      const filePath = `spelling/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filePath, audioFile, {
          cacheControl: '3600',
          upsert: true  // Replace if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress(100);
      return `audio/${filePath}`;
    } catch (err) {
      console.error('Audio upload error:', err);
      throw new Error('Failed to upload audio file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.word.trim()) {
      setError('Word is required');
      return;
    }

    // For new words, require audio file
    if (!word && !audioFile) {
      setError('Audio file is required for new words');
      return;
    }

    setIsSubmitting(true);

    try {
      let audioPath = word?.audio_path || '';

      // Upload audio if new file selected
      if (audioFile) {
        audioPath = await uploadAudio(formData.word);
      }

      // Prepare word data
      const wordData: CreateSpellingWordData = {
        word: formData.word.trim().toLowerCase(),
        audio_path: audioPath,
        audio_verified: !!audioFile || word?.audio_verified || false,
        grade_level: formData.grade_level || null,
        difficulty: formData.difficulty || null,
        notes: formData.notes?.trim() || null
      };

      // Import query functions dynamically to avoid circular deps
      const { addSpellingWord, updateSpellingWord } = await import('@/lib/supabase/queries/spelling');

      if (word) {
        // Update existing word
        await updateSpellingWord(word.id, {
          word: wordData.word,
          audio_path: wordData.audio_path,
          audio_verified: wordData.audio_verified,
          grade_level: wordData.grade_level,
          difficulty: wordData.difficulty,
          notes: wordData.notes
        });
      } else {
        // Create new word
        await addSpellingWord(wordData);
      }

      onComplete();
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to save word. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.word.trim() && (word || audioFile);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Word Input */}
      <div>
        <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
          Word <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="word"
          name="word"
          value={formData.word}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle focus:border-transparent"
          placeholder="e.g., example"
          required
        />
      </div>

      {/* Audio Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Audio File {!word && <span className="text-red-500">*</span>}
        </label>

        {/* Audio Preview */}
        {audioPreview && (
          <div className="mb-3 p-4 bg-gray-50 rounded-lg">
            <audio controls className="w-full">
              <source src={audioPreview} />
              Your browser does not support audio playback.
            </audio>
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleAudioChange}
          disabled={isSubmitting || isUploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting || isUploading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          {audioFile ? 'Change Audio File' : (word ? 'Replace Audio File' : 'Select Audio File')}
        </button>

        {audioFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {audioFile.name} ({(audioFile.size / 1024).toFixed(1)} KB)
          </p>
        )}

        {isUploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-jungle h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* Grade Level */}
      <div>
        <label htmlFor="grade_level" className="block text-sm font-medium text-gray-700 mb-2">
          Grade Level
        </label>
        <select
          id="grade_level"
          name="grade_level"
          value={formData.grade_level || ''}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle focus:border-transparent"
        >
          <option value="">Select Grade</option>
          <option value="1">1st Grade</option>
          <option value="2">2nd Grade</option>
          <option value="3">3rd Grade</option>
          <option value="4">4th Grade</option>
          <option value="5">5th Grade</option>
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty
        </label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty || ''}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle focus:border-transparent"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          disabled={isSubmitting}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jungle focus:border-transparent resize-none"
          placeholder="Optional notes about this word..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting || isUploading}
          className="flex-1 px-6 py-3 bg-gradient-to-b from-jungle to-jungle-dark text-white rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? 'Saving...' : (word ? 'Update Word' : 'Create Word')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || isUploading}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
