# Audio Files Setup - Required

The app is now configured to use local audio files. You need to add these files to the `public/audio/` folder:

## Required Audio Files

### 1. Background Music
**File**: `public/audio/background-music.mp3`
- **Purpose**: Background music that loops throughout the app
- **Recommended duration**: 2-5 minutes
- **Volume**: 0.3 (configured in app)
- **Format**: MP3 (for best browser compatibility)
- **Suggested features**: Festive, loopable, Lunar New Year themed

### 2. Draw Effect
**File**: `public/audio/draw-effect.mp3`
- **Purpose**: Plays when the user clicks to start drawing
- **Recommended duration**: 0.5-1 second
- **Volume**: 0.8
- **Format**: MP3

### 3. Click Effect
**File**: `public/audio/click-effect.mp3`
- **Purpose**: Button click sound effect
- **Recommended duration**: 0.1-0.5 seconds
- **Volume**: 0.6
- **Format**: MP3

### 4. Win Effect
**File**: `public/audio/win-effect.mp3`
- **Purpose**: Plays when a winning number is drawn
- **Recommended duration**: 1-2 seconds
- **Volume**: 1.0 (loudest)
- **Format**: MP3

## Example Folder Structure

```
public/
├── audio/
│   ├── background-music.mp3      (REQUIRED)
│   ├── draw-effect.mp3           (REQUIRED)
│   ├── click-effect.mp3          (REQUIRED)
│   └── win-effect.mp3            (REQUIRED)
└── default-background.svg        (default image)
```

## Where to Get Audio Files

1. **Free Resources**:
   - Mixkit: https://mixkit.co/
   - Freesound: https://freesound.org/
   - Zapsplat: https://www.zapsplat.com/

2. **Lunar New Year / Traditional Music**:
   - Search for "Lunar New Year background music" on any free audio site
   - Look for loopable, instrumental tracks

3. **Sound Effects**:
   - Search for "spin", "click", "winning" or "success" sound effects
   - Keep them short and punchy

## How to Install Audio Files

1. Create a `public/audio/` folder if it doesn't exist
2. Download or create your audio files
3. Convert to MP3 format if needed (use Audacity, FFmpeg, or online converters)
4. Place the files in `public/audio/` with the exact names listed above
5. Test by running: `npm start`

## Testing Audio

After adding the files:
1. Start the app: `npm start`
2. Click the speaker icon in the header to toggle music
3. Try the draw function to hear sound effects
4. Check browser DevTools console for any audio errors

## If Audio Files Are Missing

The app will display console errors but continue to work. You can:
- Still use the app with built-in UI feedback
- Add audio files later
- Upload custom audio via the Admin Panel

## Building for Distribution

After adding audio files:
```powershell
npm run dist    # Build the app with audio included
```

The audio files will be packaged into the installer automatically.
