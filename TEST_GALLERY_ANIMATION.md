# Gallery Alpha Animation Test

## Test Flow:

1. **Initial Load**: AlphaTest should animate from 1.0 to 0.3 over 5 seconds
2. **Click Gallery Menu**: Should show gallery types overlay
3. **Click Gallery Type (e.g., Chairs)**:
   - Should hide types overlay
   - Should show gallery
   - Should trigger alphaTest animation from 0.3 to 0.9 (1 second)
   - Splat background should become brighter/whiter
4. **Click Exit Button or Press Escape**:
   - Should hide gallery
   - Should trigger alphaTest animation from 0.9 to 0.3 (1 second)
   - Splat background should become darker

## Expected Console Logs:

- "App state changed:" - should show showGallery changes
- "Canvas props changed:" - should show prop updates
- "Splat alphaTest animating for gallery:" - should show animation triggers
- "Type clicked:" - should show which gallery type was selected

## Current Implementation:

- ✅ Initial 5-second fade-in animation (1.0 → 0.3)
- ✅ Gallery state management (SHOW_GALLERY/TOGGLE_GALLERY actions)
- ✅ alphaTest animation logic (0.3 ↔ 0.9)
- ✅ Gallery exit button with Escape key support
- ✅ Console logging for debugging

## Files Modified:

- App.jsx: Fixed TOGGLE_GALLERY to actually toggle, added SHOW_GALLERY action
- Type.jsx: Added console logging for clicks
- Gallery.jsx: Added exit button and onClose prop
- Experience.jsx: Enhanced console logging

## Next Steps:

1. Test the animation flow
2. Verify console logs show correct state changes
3. Confirm alphaTest values animate smoothly
4. Check that splat brightness changes are visible
