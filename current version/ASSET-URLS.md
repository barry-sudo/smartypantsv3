# Asset URLs

**Supabase Project:** smarty-pants-v3  
**Project ID:** kwvqxvyklsrkfgykmtfu  
**Base URL:** https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public

---

## Images (Tiger Photos)

- image1.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image1.jpg
- image2.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image2.jpg
- image3.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image3.jpg
- image4.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image4.jpg
- image5.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image5.jpg

---

## Videos (Celebration Videos)

- video1.mp4: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/videos/video1.mp4
- video2.mp4: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/videos/video2.mp4
- video3.mp4: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/videos/video3.mp4
- video4.mp4: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/videos/video4.mp4

---

## Audio - Tiger Roar

- tigerroar.mp3: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/tigerroar.mp3

---

## Audio - Spelling Words (173 files)

**Pattern:** `https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/[word].m4a`

**Examples:**
- and.m4a: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/and.m4a
- because.m4a: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/because.m4a
- the.m4a: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/the.m4a
- jump.m4a: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/jump.m4a
- happy.m4a: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/happy.m4a

**Complete word list:** See `current-version/words.json` for all 173 words

---

## Prizes (Goal Photos)

- current-goal.jpg: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/prizes/current-goal.jpg

---

## Usage in Code (Phase 1+)

### Asset Manifest Pattern

```typescript
// src/lib/assets.ts
const STORAGE_BASE = 'https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public';

export const ASSETS = {
  images: {
    tiger1: `${STORAGE_BASE}/images/image1.jpg`,
    tiger2: `${STORAGE_BASE}/images/image2.jpg`,
    tiger3: `${STORAGE_BASE}/images/image3.jpg`,
    tiger4: `${STORAGE_BASE}/images/image4.jpg`,
    tiger5: `${STORAGE_BASE}/images/image5.jpg`,
  },
  videos: {
    celebration1: `${STORAGE_BASE}/videos/video1.mp4`,
    celebration2: `${STORAGE_BASE}/videos/video2.mp4`,
    celebration3: `${STORAGE_BASE}/videos/video3.mp4`,
    celebration4: `${STORAGE_BASE}/videos/video4.mp4`,
  },
  audio: {
    tigerRoar: `${STORAGE_BASE}/audio/tigerroar.mp3`,
    getSpellingAudio: (word: string) => `${STORAGE_BASE}/audio/spelling/${word}.m4a`,
  },
  prizes: {
    currentGoal: `${STORAGE_BASE}/prizes/current-goal.jpg`,
  },
};
```

### Random Selection Helper

```typescript
// Get random tiger image
export function getRandomTigerImage(): string {
  const images = Object.values(ASSETS.images);
  return images[Math.floor(Math.random() * images.length)];
}

// Get random celebration video
export function getRandomCelebrationVideo(): string {
  const videos = Object.values(ASSETS.videos);
  return videos[Math.floor(Math.random() * videos.length)];
}
```

---

## Storage Usage

**Current Upload Count:**
- Images: 5 files
- Videos: 3-4 files
- Audio: 174 files (173 words + 1 roar)
- Prizes: 1 file

**Total:** ~182 files  
**Estimated Size:** ~100-150MB  
**Free Tier Limit:** 1GB

---

## Notes

- All buckets are set to **public** (no authentication required)
- MIME type `audio/x-m4a` added to support iPhone-recorded audio
- URLs are CDN-backed (fast global delivery)
- No CORS issues (Supabase Storage allows all origins)

---

## Verification Checklist

Test these URLs in your browser to confirm public access:

- [ ] Image: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/images/image1.jpg
- [ ] Video: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/videos/video1.mp4
- [ ] Audio: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/tigerroar.mp3
- [ ] Spelling: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/audio/spelling/because.m4a
- [ ] Prize: https://kwvqxvyklsrkfgykmtfu.supabase.co/storage/v1/object/public/prizes/current-goal.jpg

---

**Last Updated:** Phase 0 Setup  
**Status:** Ready for Phase 1
