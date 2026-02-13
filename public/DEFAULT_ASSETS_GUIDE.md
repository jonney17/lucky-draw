# Default Assets Setup

## Default Background Image

✅ `default-background.svg` - A festive red and gold gradient background for Tết 2026
- Located in: `public/default-background.svg`
- This is loaded automatically when the app starts

## How to Replace Default Image

1. Replace `public/default-background.svg` with your own image:
   - Supported formats: PNG, JPG, WebP, SVG
   - Recommended size: 1920x1080 or larger
   
2. Or upload a custom image via the Admin Panel in the app

## Default Audio Files

The app currently uses remote audio from a CDN. To use local default audio files:

### Step 1: Create Audio Folder Structure
```
public/
└── audio/
    ├── background-music.mp3
    ├── draw-effect.mp3
    ├── win-effect.mp3
    └── click-effect.mp3
```

### Step 2: Add Your Audio Files
- **background-music.mp3** - BGM that loops (recommended: 2-5 minutes, MP3 format)
- **draw-effect.mp3** - Sound when drawing starts
- **win-effect.mp3** - Sound when number is drawn
- **click-effect.mp3** - Button click sound

### Step 3: Update App.tsx
Change these lines in `App.tsx`:
```typescript
// Change this:
const BGM_URL_DEFAULT = "https://assets.mixkit.co/music/preview/mixkit-glimmering-stars-584.mp3";

// To this:
const BGM_URL_DEFAULT = "/audio/background-music.mp3";
```

And in `DrawScreen.tsx`, update the SFX URLs:
```typescript
const SPIN_SFX = "/audio/draw-effect.mp3";
const STOP_SFX = "/audio/click-effect.mp3";
const WINNER_SFX_DEFAULT = "/audio/win-effect.mp3";
```

## Testing

After adding audio files:
```powershell
npm run dev      # Test in development
npm run dist     # Build for production
npm start        # Run the app
```

## Tips

- Keep audio file sizes small (MP3 compression recommended)
- Test audio playback in the app before deploying
- Ensure file paths are correct (relative to `public/` folder)
- Audio files must be in the `public/` folder to be accessible
