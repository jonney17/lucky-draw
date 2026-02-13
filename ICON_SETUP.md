# Application Icon Setup

## Current Icon

I've created a festive icon (`public/icon.svg`) featuring a golden horse for the Year of the Horse 2026.

The icon is used in:
- Application window title bar
- Development environment

## For Production Build

### Icon Format Requirements

For the best result with electron-builder on Windows, you should provide icons in these formats:

#### Option 1: PNG Icons (Easier)
Create PNG images by sizes:
- `512x512.png` - Main icon
- `256x256.png` - Secondary icon
- `128x128.png` - Smaller size

Place them in the `assets/` folder:
```
assets/
├── 512x512.png
├── 256x256.png
└── 128x128.png
```

#### Option 2: Dedicated Icon File
Create a `.ico` file and save as `assets/icon.ico`

### How to Generate Icons from the SVG

Using an online tool:
1. Go to https://icoconvert.com/ or similar
2. Upload `public/icon.svg`
3. Download as PNG (512x512, 256x256, 128x128)
4. Save to `assets/` folder

OR use a desktop tool:
- **ImageMagick**: `convert public/icon.svg -define icon:auto-resize=512,256,128 assets/icon.ico`
- **Inkscape**: Export SVG as PNG at different resolutions
- **GIMP**: File > Export As PNG at desired sizes

### Update Configuration

Once you have the icon files, update or create `assets/` folder structure:
```
assets/
├── icon.ico          (Windows installer icon)
├── 512x512.png       (Launcher icon)
├── 256x256.png       (Taskbar icon)
└── 128x128.png       (File browser icon)
```

Then update `package.json` build configuration:
```json
"build": {
  "...other config...",
  "win": {
    "icon": "assets/icon.ico"
  }
}
```

## Current Setup

✅ App window icon: `/public/icon.svg` (for development)
✅ Build configuration: Updated to include `public/` folder
⏳ Production icons: Need to add PNG or ICO files

## Next Steps

1. Convert `public/icon.svg` to PNG files (512x512, 256x256, 128x128)
2. Create `assets/` folder in project root
3. Place PNG files in `assets/`
4. (Optional) Convert to `.ico` for Windows installer
5. Build: `npm run dist`

## Testing

After adding proper icons:
```powershell
npm run dist
```

This will build the executable with the proper icons for:
- Application shortcut
- Installer
- Taskbar
- File browser

## Icon Design Recommendations

The current icon features:
- 🐴 Golden horse (Year of the Horse 2026)
- 🎆 Red and gold colors (traditional Tết colors)
- ✨ Festive, clean design

Consider keeping this theme for all sizes!
