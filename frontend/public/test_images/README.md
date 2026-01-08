# Test Images for Advanced Features

## How to Create Test Images

### Option 1: Use Online Tools
1. Visit https://www.imgonline.com.ua/eng/create-color-image.php
2. Create images with different colors:
   - Red: 256x256 pixels
   - Green: 256x256 pixels
   - Blue: 256x256 pixels
   - Yellow: 256x256 pixels
   - Orange: 256x256 pixels
3. Save as PNG files

### Option 2: Use Python Script
```python
from PIL import Image

colors = ['red', 'green', 'blue', 'yellow', 'orange']
for i, color in enumerate(colors):
    img = Image.new('RGB', (256, 256), color=color)
    img.save(f'test_image_{i+1}_{color}.png')
```

### Option 3: Use Real Animal Photos
- Use photos of cattle/buffalo from the internet
- Ensure good lighting and clear visibility
- Recommended size: 256x256 to 512x512 pixels

## Test Image Suggestions

### For Batch Processing:
- Use 3-5 different colored images
- Or use 3-5 different animal photos
- Name them: `test_animal_1.png`, `test_animal_2.png`, etc.

### For Breed Identification:
- Use clear photos of Indian cattle breeds
- Gir, Murrah, Sahiwal, Jaffarabadi, etc.
- Full body or side view preferred

### For Risk Assessment:
- Use photos showing different health conditions
- Good condition: Shiny coat, alert eyes
- Poor condition: Dull coat, discharge visible

## Quick Test Image Generator

Run this in browser console to create test images:

```javascript
// Create a test image canvas
function createTestImage(color) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  return canvas.toDataURL('image/png');
}

// Generate test images
const colors = ['red', 'green', 'blue', 'yellow', 'orange'];
colors.forEach((color, i) => {
  const imgData = createTestImage(color);
  console.log(`Test Image ${i+1} (${color}):`, imgData.substring(0, 50) + '...');
  // You can download it or use directly
});
```

