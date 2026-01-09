const BASE_URL = 'https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public';

export const ASSETS = {
  profileImage: `${BASE_URL}/images/profile.jpeg`,

  images: [
    `${BASE_URL}/images/image1.jpg`,
    `${BASE_URL}/images/image2.jpg`,
    `${BASE_URL}/images/image3.jpg`,
    `${BASE_URL}/images/image4.jpg`,
    `${BASE_URL}/images/image5.jpg`,
  ],

  videos: [
    `${BASE_URL}/videos/video1.mp4`,
    `${BASE_URL}/videos/video2.mp4`,
    `${BASE_URL}/videos/video3.mp4`,
  ],

  tigerRoar: `${BASE_URL}/audio/tigerroar.mp3`,

  // Helper function to get spelling audio URL
  getSpellingAudio: (word: string): string => {
    return `${BASE_URL}/audio/spelling/${word.toLowerCase()}.m4a`;
  },

  currentPrize: `${BASE_URL}/prizes/current-goal.jpg`,
} as const;

// For TypeScript: images array is readonly
export type ImageAsset = typeof ASSETS.images[number];
export type VideoAsset = typeof ASSETS.videos[number];
