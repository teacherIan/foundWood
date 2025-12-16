# New Experience - SparkJS Implementation

This folder contains the new SparkJS-powered 3D experience for Doug's Found Wood.

## What Changed

### From Old Experience:
- ❌ Used `@react-three/drei` Splat component
- ❌ Used `.splat` files (fixed_model.splat)
- ❌ Limited splat rendering capabilities

### To New Experience:
- ✅ Uses **SparkJS** (`@sparkjsdev/spark`)
- ✅ Uses `.spz` files (full_scene.spz) - optimized format
- ✅ Better rendering quality and performance
- ✅ More creative control over Gaussian Splats
- ✅ Proper SparkRenderer integration with React Three Fiber

## Implementation Details

### Key Components:

1. **SparkRenderer**: Required for SparkJS to work properly
   - Created with access to THREE.WebGLRenderer
   - Added to the scene automatically
   - Handles all splat rendering logic

2. **SplatMesh**: The actual Gaussian Splat object
   - Loads from `/public/assets/experience/full_scene.spz`
   - Uses `onLoad` callback for proper loading detection
   - Supports position and scale transformations

3. **Vite Configuration**: Updated to handle SparkJS requirements
   - `.wasm` files served with `application/wasm` MIME type
   - `.spz` files served with proper caching headers
   - WebAssembly support enabled

## Key Features

1. **Smooth Camera Animation**: Orbital rotation around the scene
   - Device-responsive (mobile, tablet, desktop)
   - Gentle vertical wave motion
   - Pause on user interaction

2. **Creative Text Layout**: "DOUG'S Found Wood" text overlay
   - Animated entrance from below
   - Responsive positioning
   - Custom Driftwood font

3. **Interactive Controls**: PresentationControls for user interaction
   - Drag to rotate
   - Auto-rotation when idle
   - Smooth transitions

## Files

- `NewExperience.jsx` - Main component with SparkJS integration
- `newExperienceStyles.css` - Styling and animations
- `README.md` - This documentation

## SparkJS Benefits

- **Better Quality**: Superior rendering quality for complex Gaussian Splat scenes
- **Optimized Format**: `.spz` files are compressed and optimized for web
- **WebAssembly**: Uses WASM for high-performance splat processing
- **Future-Proof**: Active development and community support

## Troubleshooting

### WebAssembly MIME Type Warning
If you see a warning about WASM MIME types in the console, that's normal in development. The vite.config.js has been updated to serve WASM files with the correct `application/wasm` MIME type.

### 431 Request Header Error
This is a browser cookie warning and can be safely ignored. It doesn't affect functionality.

### SparkRenderer Constructor Error
Make sure SparkRenderer is created with the WebGLRenderer instance:
```javascript
const sparkRenderer = new SparkRenderer({
  renderer: gl, // from useThree hook
  autoUpdate: true,
});
scene.add(sparkRenderer);
```

## Usage

The component is drop-in compatible with the old Experience component:

```jsx
import NewExperience from '../components/new_experience/NewExperience';

<NewExperience
  isAnimating={isAnimating}
  showContactPage={showContactPage}
  showTypes={showTypes}
  showGallery={showGallery}
  onSplatLoaded={onSplatLoaded}
  imagesLoaded={imagesLoaded}
  initialLoadComplete={initialLoadComplete}
/>
```

## Creative Possibilities 🎨

Experiment with:
- **Camera movement**: Adjust orbital radius, rotation speed, height variation
- **Text animations**: Different entrance effects, positions, colors
- **SparkRenderer options**: 
  - `maxStdDev`: Quality vs performance (√5 to √9)
  - `blurAmount`: Anti-aliasing blur (typically 0.3)
  - `focalDistance` & `apertureAngle`: Depth of field effects
  - `falloff`: Gaussian kernel falloff (0 = flat, 1 = normal)
- **SplatMesh features**:
  - `recolor`: Tint all splats with a THREE.Color
  - `opacity`: Global opacity multiplier
  - World/object space modifiers for effects

## Resources

- [SparkJS Documentation](https://sparkjs.dev/docs/)
- [SparkJS Examples](https://sparkjs.dev/examples/)
- [SparkJS Discord](https://discord.gg/W39qmSKemS)
- [GitHub Repository](https://github.com/sparkjsdev/spark)

Have fun creating! 🎨✨

