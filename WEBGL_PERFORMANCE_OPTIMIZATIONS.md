# WebGL Performance Optimizations

## Overview
Optimized WebGL settings in Experience.jsx to minimize processor usage and improve performance, especially during gallery interactions.

## Changes Made

### Power Preference
- **Before**: `'high-performance'` for desktop, `'default'` for mobile
- **After**: `'default'` for all devices
- **Benefit**: Reduces GPU power consumption and heat generation

### Antialiasing
- **Before**: Dynamic based on `performanceConfig.antialias`
- **After**: `false` (disabled)
- **Benefit**: Significant performance improvement, especially on lower-end devices

### Depth Buffer
- **Before**: `true`
- **After**: `false`
- **Benefit**: Reduces memory usage and improves rendering performance
- **Note**: Only disable if your 3D scene doesn't require depth testing

### Stencil Buffer
- **Before**: Enabled for desktop (`!isMobile`)
- **After**: `false` for all devices
- **Benefit**: Reduces memory usage and simplifies rendering pipeline

### Premultiplied Alpha
- **Before**: `true`
- **After**: `false`
- **Benefit**: Simpler blending operations, slightly better performance

### Fallback Handling
- **Added**: `failIfMajorPerformanceCaveat: false`
- **Benefit**: Allows fallback to software rendering if hardware acceleration causes issues

## Performance Impact
These optimizations should result in:
- Lower CPU/GPU usage
- Reduced heat generation
- Better performance on older devices
- Smoother gallery interactions
- Less battery drain on mobile devices

## Trade-offs
- Slightly reduced visual quality due to disabled antialiasing
- Some 3D effects may not work if they rely on depth/stencil buffers
- Scene may need to be designed without depth testing

## Testing Recommendations
1. Test on various devices to ensure visual quality is acceptable
2. Monitor performance metrics before/after changes
3. Re-enable specific features if visual quality is insufficient for your use case
