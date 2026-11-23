# App Icons

This directory contains app icons for PWA and Android deployment.

## Required Icon Sizes

### PWA / Web
- **16x16** - Favicon (icon-16.png)
- **32x32** - Favicon (icon-32.png)
- **72x72** - Android (icon-72.png)
- **96x96** - Android (icon-96.png)
- **128x128** - Android & Chrome (icon-128.png)
- **144x144** - Android (icon-144.png)
- **152x152** - iOS (icon-152.png)
- **167x167** - iOS iPad Pro (icon-167.png)
- **180x180** - iOS (icon-180.png)
- **192x192** - Android Chrome (icon-192.png)
- **384x384** - Android (icon-384.png)
- **512x512** - Android & PWA (icon-512.png) - **MASKABLE**

## How to Generate Icons

### Option 1: Online Tools (Easiest)
1. Create a single 1024x1024px master icon
2. Use one of these free tools:
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator
   - https://favicon.io/favicon-converter/

### Option 2: ImageMagick (Command Line)
```bash
# Create all sizes from a master 1024x1024 image
convert master-icon.png -resize 16x16 icon-16.png
convert master-icon.png -resize 32x32 icon-32.png
convert master-icon.png -resize 72x72 icon-72.png
convert master-icon.png -resize 96x96 icon-96.png
convert master-icon.png -resize 128x128 icon-128.png
convert master-icon.png -resize 144x144 icon-144.png
convert master-icon.png -resize 152x152 icon-152.png
convert master-icon.png -resize 167x167 icon-167.png
convert master-icon.png -resize 180x180 icon-180.png
convert master-icon.png -resize 192x192 icon-192.png
convert master-icon.png -resize 384x384 icon-384.png
convert master-icon.png -resize 512x512 icon-512.png
```

### Option 3: Python (PIL/Pillow)
```python
from PIL import Image

sizes = [16, 32, 72, 96, 128, 144, 152, 167, 180, 192, 384, 512]
master = Image.open('master-icon.png')

for size in sizes:
    resized = master.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(f'icon-{size}.png')
```

## Design Guidelines

### General
- Use a simple, recognizable icon
- Avoid text in icons (doesn't scale well)
- High contrast colors
- Should look good at small sizes (16x16)

### For Scopone Scientifico
Suggested icon elements:
- Italian playing card (7 of Denari - Settebello)
- Card deck
- Diamond suit symbol (♦)
- Green felt table background

### Color Scheme
- Background: #1a4a1a (dark green - from app theme)
- Foreground: #ffd700 (gold) or #fdf6e0 (card color)
- Accent: #c8b060 (card border color)

## Maskable Icons

The 512x512 icon should be maskable (safe zone in center 80% of canvas).
- Outer 10% on all sides may be cropped on Android
- Keep important elements in the center 80%

## Temporary Placeholder

Until you create proper icons, you can use a simple colored square:
```bash
# Create solid color placeholders (green)
for size in 16 32 72 96 128 144 152 167 180 192 384 512; do
  convert -size ${size}x${size} xc:"#1a4a1a" icon-${size}.png
done
```
