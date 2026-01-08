# Smarty Pants - 2nd Grade Math Game

Welcome to Smarty Pants! This interactive math game helps your daughter practice addition and subtraction while having fun.

## 📁 File Structure

```
Smarty Pants/
├── index.html              # Landing page with Math/Spelling buttons
├── math-selection.html     # Choose Addition or Subtraction
├── addition.html           # Addition game
├── subtraction.html        # Subtraction game
├── spelling.html           # Spelling game with 200 sight words
├── Gster.jpeg             # Your daughter's photo (on landing page)
├── Pictures/              # Folder for mystery images (randomly selected)
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── image3.jpg
│   ├── image4.jpg
│   └── image5.jpg
└── Videos/                # Folder for celebration videos (randomly selected)
    ├── video1.mp4
    ├── video2.mp4
    └── video3.mp4
```

## 🎮 Features

### Math Module
- **Addition**: Practice adding numbers (results up to 40)
- **Subtraction**: Practice subtracting numbers (results 0-19)
- **Progressive Reveal**: Solve 25 problems to reveal a mystery image
- **Variety**: Random images and videos each session

### Spelling Module
- **200 Sight Words**: Organized by difficulty (2nd grade level)
- **Interactive Spelling**: Click any letter space to type
- **Text-to-Speech**: App speaks each word twice
- **Stoplight System**: Red → Yellow → Green feedback
- **Controls**:
  - 🔊 Hear Again: Replay the word
  - ⏭️ Try Again Later: Skip word (returns at end)
- **25 Words Per Session**: Random selection from 200-word library

### Tracking & Stats
- **Timer**: Optional timer (checkbox in upper right)
- **Accuracy Tracking**: Correct answers / total attempts
- **Best Records**: Tracks best time and best accuracy
- **Win Badges**: Shows star badge for each completed session
- **Stats Screen**: Displays after each session:
  - Session time
  - Session accuracy
  - Best time (all-time)
  - Best accuracy (all-time)
  - Total wins with star badges

### Game Mechanics
- 25 correct answers = Win
- Wrong answers prompt "Try Again!" (no penalty)
- Each correct answer reveals one cell of the mystery image
- Celebration video plays after winning
- Stats screen shows achievements

## 🔧 Setup Instructions

### 1. Replace Placeholder Images
The `Pictures/` folder contains 5 placeholder images. Replace them with your own:
- Keep the same filenames (image1.jpg, image2.jpg, etc.)
- Recommended size: 800x800 pixels or larger
- Formats: .jpg, .jpeg, or .png
- Ideas: animals, characters, favorite things, family photos

### 2. Replace Placeholder Videos
The `Videos/` folder contains 3 placeholder videos. Replace them with your own:
- Keep the same filenames (video1.mp4, video2.mp4, video3.mp4)
- Recommended: 3-10 seconds long
- Format: .mp4
- Ideas: celebration clips, funny animal videos, dance videos

### 3. Add Audio (Optional)
- If you have a "tigerroar.mp3" or similar sound effect, add it to the main folder
- This plays when answers are correct (in math) and words are spelled correctly
- If file is missing, games still work (just no sound)

## 🚀 How to Use

1. Open `index.html` in a web browser
2. Click **Math** or **Spelling**
3. For Math: Choose **Addition** or **Subtraction**
4. For Math: (Optional) Check the **Timer** box to track speed
5. Complete your session!
6. View your stats and badges after each session

### Spelling Tips:
- Listen carefully to the word (spoken twice)
- Click any blank space to type
- Letters appear when correct
- Use "Hear Again" if you need to hear the word again
- Use "Try Again Later" to skip a word (it comes back at the end)

## 💾 Data Storage

Stats are stored in the browser's localStorage:
- **Addition stats**: Separate tracking
- **Subtraction stats**: Separate tracking
- **Spelling stats**: Separate tracking
- Data persists between sessions
- To reset stats: Clear browser data or use browser's developer tools

## 🎨 Customization Ideas

- Change colors in the CSS
- Add more images/videos to the folders
- Adjust problem difficulty ranges
- Modify celebration messages
- Add your own sound effects

## 📱 Device Compatibility

- Desktop computers ✅
- Tablets ✅
- Mobile phones ✅ (responsive design)

## ⚙️ Technical Notes

- No internet connection required (runs offline)
- Uses browser localStorage for stats
- Images/videos randomly selected each session
- Separate stat tracking for addition and subtraction

## 🐛 Troubleshooting

**Images not showing?**
- Check that image files are in the Pictures/ folder
- Verify filenames match (image1.jpg, image2.jpg, etc.)
- Check file formats (.jpg, .jpeg, or .png)

**Videos not playing?**
- Ensure videos are in Videos/ folder
- Verify filenames match (video1.mp4, video2.mp4, video3.mp4)
- Make sure videos are .mp4 format

**Stats not saving?**
- Make sure browser allows localStorage
- Check browser privacy settings
- Avoid using private/incognito mode

**Timer not appearing?**
- Make sure the Timer checkbox is checked
- Timer only displays when checkbox is enabled

---

## 📝 Quick Start Checklist

- [ ] Replace images in Pictures/ folder (5 images)
- [ ] Replace videos in Videos/ folder (3 videos)
- [ ] (Optional) Add tigerroar.mp3 sound effect
- [ ] Open index.html in browser
- [ ] Test addition game
- [ ] Test subtraction game
- [ ] Test spelling game
- [ ] Check stats are saving

Enjoy Smarty Pants! 🎓⭐
