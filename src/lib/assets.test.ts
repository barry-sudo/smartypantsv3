import { describe, it, expect } from 'vitest';
import { ASSETS } from './assets';

describe('ASSETS', () => {
  it('has 5 images', () => {
    expect(ASSETS.images).toHaveLength(5);
  });

  it('has 3 videos', () => {
    expect(ASSETS.videos).toHaveLength(3);
  });

  it('generates spelling audio URL', () => {
    const url = ASSETS.getSpellingAudio('and');
    expect(url).toContain('audio/spelling/and.m4a');
  });

  it('all image URLs contain correct base path', () => {
    ASSETS.images.forEach((imageUrl) => {
      expect(imageUrl).toContain('kwvqxvyklsrkfgykmtfu.supabase.co');
      expect(imageUrl).toContain('/images/');
    });
  });

  it('all video URLs contain correct base path', () => {
    ASSETS.videos.forEach((videoUrl) => {
      expect(videoUrl).toContain('kwvqxvyklsrkfgykmtfu.supabase.co');
      expect(videoUrl).toContain('/videos/');
    });
  });

  it('tiger roar URL is correct', () => {
    expect(ASSETS.tigerRoar).toContain('audio/tigerroar.mp3');
  });

  it('current prize URL is correct', () => {
    expect(ASSETS.currentPrize).toContain('prizes/current-goal.jpg');
  });

  it('spelling audio function handles uppercase', () => {
    const url = ASSETS.getSpellingAudio('BECAUSE');
    expect(url).toContain('audio/spelling/because.m4a');
  });
});
