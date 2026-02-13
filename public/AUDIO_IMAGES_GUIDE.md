# Audio & Image Assets Guide

## Directory Structure

The app supports background images and audio files in the following locations:

```
public/
├── images/
│   └── background.jpg          # Background image for the app
└── audio/
    ├── background-music.mp3    # Background music (will loop)
    ├── draw-effect.mp3         # Sound when drawing
    ├── win-effect.mp3          # Sound when winning
    └── click-effect.mp3        # Click sound effect
```

## How to Add Your Files

### 1. Background Image
- Place a background image in `public/images/`
- Supported formats: JPG, PNG, WebP
- Recommended size: 1920x1080 or higher for HD quality
- File size: Keep under 5MB for better performance

### 2. Background Music
- Place your background music file in `public/audio/background-music.mp3`
- File will loop continuously at low volume (0.3)
- Supported formats: MP3, WAV, OGG
- Recommended: MP3 for best browser compatibility
- Suggested duration: 2-5 minutes for loop

### 3. Sound Effects

#### Draw Effect (`draw-effect.mp3`)
- Plays when the user clicks to start the draw
- Volume: 0.8 (out of 1.0)
- Recommended duration: 0.5-1 second

#### Win Effect (`win-effect.mp3`)
- Plays when a number is drawn
- Volume: 1.0 (loudest)
- Recommended duration: 1-2 seconds

#### Click Effect (`click-effect.mp3`)
- Plays when buttons are clicked
- Volume: 0.6
- Recommended duration: 0.1-0.5 seconds

## Audio Control

Users can:
- Toggle background music on/off using the speaker icon in the header
- Volume is controlled in the Admin Panel settings
- All sound effects can be muted together with the background music

## Configuration

In the app's Admin Panel, you can:
- Upload custom background music via file upload
- Adjust volume levels (0.0 - 1.0)
- Toggle background music on/off
- Configure prize settings and other options

## Default Audio Source

If no custom audio files are provided:
- Default background music will play from a CDN
- No default sound effects (optional enhancement)

## Tips for Best Results

1. **Audio Quality**: Use 192kbps MP3 for good quality with small file size
2. **Music Selection**: Choose festive, loopable background music suitable for Lunar New Year (Tết)
3. **Sound Effects**: Use short, punchy sounds for effects to avoid overlap issues
4. **Testing**: Test on target devices to ensure audio plays smoothly
5. **Browser Support**: Modern browsers support HTML5 audio - ensure compatibility with your target audience

## Browser Audio Autoplay Policy

Modern browsers require user interaction to autoplay audio. The app handles this by:
- Waiting for the first click to start background music
- Ensuring all audio starts after user interaction

If background music doesn't play automatically, click anywhere on the page to start it.

## Custom Upload (via Admin Panel)

Users can also upload custom background music directly through the Admin Panel, which will be stored in the browser's IndexedDB database for persistence.
