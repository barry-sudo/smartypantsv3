# Build Spec: Phase 0 - Setup

**Phase:** 0 (Pre-build foundation)  
**Feature:** Supabase project + asset upload  
**Complexity:** Simple  
**Estimated Time:** ~2 hours  
**Status:** ⏳ Not Started

---

## Objective

Create Supabase project, configure database, create storage buckets, and upload all game assets (images, videos, audio) to CDN.

---

## Prerequisites

**Must have before starting:**
- [ ] Supabase account created (free tier sufficient)
- [ ] All assets collected and organized locally:
  - [ ] 5 tiger images (from `Pictures/` folder)
  - [ ] 3 celebration videos (from `Videos/` folder)
  - [ ] 1 tiger roar audio (tigerroar.mp3)
  - [ ] 172 spelling word audio files (from `Audio/` folder)
  - [ ] 1 prize photo (Gster.jpeg or placeholder)

---

## What to Build

This phase is infrastructure setup, not code. Complete these steps:

### 1. Create Supabase Project

**Steps:**
1. Go to https://supabase.com
2. Create new organization: "Smarty Pants" (or your preference)
3. Create new project:
   - Name: `smarty-pants-v3`
   - Database password: [Choose strong password, save securely]
   - Region: `us-east-1` (or closest to Pennsylvania)
4. Wait for project provisioning (~2 minutes)

**Save these values:**
- Project URL: `https://[project-id].supabase.co`
- Anon/public key: `eyJ...` (from Settings → API)
- Service role key: `eyJ...` (keep secret, for migrations)

### 2. Create Storage Buckets

In Supabase dashboard → Storage:

**Create these buckets (all public):**

1. **`images`**
   - Public bucket: Yes
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png

2. **`videos`**
   - Public bucket: Yes
   - File size limit: 50MB
   - Allowed MIME types: video/mp4

3. **`audio`**
   - Public bucket: Yes
   - File size limit: 5MB
   - Allowed MIME types: audio/mpeg, audio/m4a, audio/mp3

4. **`prizes`**
   - Public bucket: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png

**Set storage policies (for all buckets):**
```sql
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('images', 'videos', 'audio', 'prizes'));

-- Allow authenticated uploads (for future admin features)
CREATE POLICY "Authenticated Upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('images', 'videos', 'audio', 'prizes') 
    AND auth.role() = 'authenticated'
  );
```

### 3. Upload Assets

**Upload via Supabase dashboard (Storage tab):**

**Images bucket:**
- Upload 5 tiger images: `image1.jpg`, `image2.jpg`, `image3.jpg`, `image4.jpg`, `image5.jpg`

**Videos bucket:**
- Upload 3 celebration videos: `video1.mp4`, `video2.mp4`, `video3.mp4`

**Audio bucket:**
- Create folder: `spelling/`
- Upload 172 word files into `audio/spelling/`: `and.m4a`, `away.m4a`, etc.
- Upload tiger roar to root: `tigerroar.mp3`

**Prizes bucket:**
- Upload current prize photo: `current-goal.jpg` (or Gster.jpeg renamed)

### 4. Record Asset URLs

Create document: `ASSET-URLS.md` (for reference during build)

```markdown
# Asset URLs

Base URL: https://[project-id].supabase.co/storage/v1/object/public

## Images
- image1.jpg: [base]/images/image1.jpg
- image2.jpg: [base]/images/image2.jpg
- image3.jpg: [base]/images/image3.jpg
- image4.jpg: [base]/images/image4.jpg
- image5.jpg: [base]/images/image5.jpg

## Videos
- video1.mp4: [base]/videos/video1.mp4
- video2.mp4: [base]/videos/video2.mp4
- video3.mp4: [base]/videos/video3.mp4

## Audio
- tigerroar.mp3: [base]/audio/tigerroar.mp3
- Spelling words: [base]/audio/spelling/[word].m4a

## Prizes
- current-goal.jpg: [base]/prizes/current-goal.jpg
```

### 5. Create Environment Variables File

Create `.env.local` file (for Phase 1):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ[your-anon-key]

# For migrations/admin (DO NOT commit)
SUPABASE_SERVICE_ROLE_KEY=eyJ[your-service-key]

# Admin PIN
ADMIN_PIN=2018
```

**Important:** Add `.env.local` to `.gitignore`

---

## Success Criteria

### Infrastructure Setup
- [ ] Supabase project created and running
- [ ] All 4 storage buckets created
- [ ] Storage policies set to public read
- [ ] Project URL and keys saved securely

### Assets Uploaded
- [ ] All 5 images uploaded to `images/` bucket
- [ ] All 3 videos uploaded to `videos/` bucket
- [ ] Tiger roar uploaded to `audio/` bucket
- [ ] All 172 spelling words uploaded to `audio/spelling/` folder
- [ ] Prize photo uploaded to `prizes/` bucket

### Verification
- [ ] Can access image1.jpg via public URL in browser
- [ ] Can access video1.mp4 via public URL in browser
- [ ] Can access tigerroar.mp3 via public URL in browser
- [ ] Can access spelling/and.m4a via public URL in browser
- [ ] Can access current-goal.jpg via public URL in browser

### Documentation
- [ ] `.env.local` file created with Supabase credentials
- [ ] `ASSET-URLS.md` created with all asset paths
- [ ] Credentials stored securely (password manager)

---

## Testing Requirements

**Manual verification:**

1. **Test image loading:**
   - Open browser
   - Navigate to: `https://[project-id].supabase.co/storage/v1/object/public/images/image1.jpg`
   - Verify image displays

2. **Test video loading:**
   - Open browser
   - Navigate to video URL
   - Verify video plays

3. **Test audio loading:**
   - Open browser
   - Navigate to audio URL
   - Verify audio plays

4. **Test folder structure:**
   - In Supabase dashboard → Storage → audio bucket
   - Verify `spelling/` folder exists with 172 files

---

## Estimated Complexity

**Simple** - ~2 hours

**Breakdown:**
- Create Supabase project: 15 minutes
- Create storage buckets: 15 minutes
- Upload assets: 45 minutes (bulk upload)
- Test URLs: 15 minutes
- Create env file and docs: 30 minutes

**Note:** Bulk upload of 172 audio files is the longest step. Use Supabase CLI or dashboard batch upload if available.

---

## Dependencies

**External accounts:**
- Supabase account (free tier)

**Local assets:**
- All image, video, and audio files organized and ready

**Tools (optional but helpful):**
- Supabase CLI: `npm install -g supabase` (for faster bulk uploads)

---

## Known Issues / Challenges

**Asset organization:**
- Ensure audio files named exactly as words (lowercase, no special chars)
- Example: "and.m4a" not "AND.m4a" or "and .m4a"

**CORS (shouldn't be an issue):**
- Supabase CDN allows all origins by default
- If CORS issues arise, check bucket policies

**File size limits:**
- Some celebration videos may be large (>50MB)
- Compress if needed: https://www.freeconvert.com/video-compressor
- Target: <20MB per video for good performance

---

## Reference Materials

**Supabase Documentation:**
- Storage: https://supabase.com/docs/guides/storage
- Policies: https://supabase.com/docs/guides/storage/security/access-control
- CLI: https://supabase.com/docs/guides/cli

**Architecture:**
- Asset strategy: `docs/architecture/overview.md` (Asset Strategy section)
- ADR: `docs/decisions/ADR-003-asset-storage.md`

---

## Completion Checklist

When this phase is complete, verify:

- [ ] Supabase dashboard accessible
- [ ] All 4 buckets visible in Storage tab
- [ ] Asset counts correct:
  - [ ] 5 images
  - [ ] 3 videos
  - [ ] 173 audio files (172 words + 1 roar)
  - [ ] 1 prize photo
- [ ] Public URLs work in browser
- [ ] `.env.local` created with correct values
- [ ] `ASSET-URLS.md` created for reference
- [ ] Credentials saved securely

---

## Completion Report Format

**Status:** ✅ Complete

**Evidence:**
- [ ] Screenshot of Supabase Storage tab showing all buckets
- [ ] Test URL working (paste one working image URL)
- [ ] Asset count verified (paste folder contents or counts)

**Supabase Details:**
- Project ID: `[project-id]`
- Project URL: `https://[project-id].supabase.co`
- Region: `us-east-1`

**Asset Summary:**
- Total files uploaded: [count]
- Total storage used: [size]
- All public URLs verified: Yes/No

**Next steps:**
- Ready for Phase 1: Next.js scaffolding + database setup
- No blockers

---

## Notes

**Why upload assets now:**
- See ADR-003 for full rationale
- Summary: Avoids later migration, tests CDN immediately, consistent URLs across dev/prod

**Asset updates later:**
- To replace prize photo: Upload new file to `prizes/current-goal.jpg` (overwrite)
- To add new tiger images: Upload to `images/` bucket, update `src/lib/assets.ts` later
- To add new words: Upload to `audio/spelling/`, update word list in code

**Cost:**
- Free tier includes 1GB storage
- Current assets use ~100-150MB
- Plenty of headroom for future expansion
