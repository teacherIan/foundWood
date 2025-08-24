# New Image Gallery Component

This directory now contains a new **ImageGallery** component built with the `react-image-gallery` library, alongside your existing Gallery component.

## Files Created

- `ImageGallery.jsx` - The new gallery component using react-image-gallery
- `imageGallery.css` - Styling for the new gallery component  
- `ImageGalleryDemo.jsx` - Demo/example component showing how to use the new gallery

## Features

### ✨ Key Features
- **Professional Gallery Interface**: Uses react-image-gallery for a polished look
- **Thumbnail Navigation**: Bottom thumbnail strip for easy navigation
- **Fullscreen Support**: Built-in fullscreen viewing mode
- **Slideshow Mode**: Auto-play functionality with play/pause controls
- **Touch/Swipe Support**: Mobile-friendly gesture navigation
- **Lazy Loading**: Images load as needed for better performance
- **Responsive Design**: Works great on all screen sizes
- **Custom Styling**: Branded to match your foundWood aesthetic

### 🎯 Gallery Types Supported
- **Chairs** (type: 0)
- **Small Tables** (type: 1) 
- **Large Tables** (type: 2)
- **Structures** (type: 3)
- **Other** (type: 4)
- **All Items** (type: 'all')

## Usage

### Basic Usage
```jsx
import ImageGallery from './components/galleries/ImageGallery';

function MyComponent() {
  const [showGallery, setShowGallery] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowGallery(true)}>
        Open Gallery
      </button>
      
      {showGallery && (
        <ImageGallery
          galleryType={0} // 0 = chairs, 1 = small tables, etc.
          showGallery={showGallery}
          showGalleryString="Chairs"
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}
```

### Integration with Existing App
To replace your current Gallery component in `App.jsx`, simply change the import:

```jsx
// OLD
import Gallery from '../components/galleries/Gallery';

// NEW  
import ImageGallery from '../components/galleries/ImageGallery';

// Then in your JSX, replace:
<Gallery
  galleryType={state.activeGalleryType}
  showGallery={state.showGallery}
  showGalleryString={state.activeGalleryTypeString}
  // ... other props you don't need anymore
  onClose={handleHideGalleryCallback}
/>

// With:
<ImageGallery
  galleryType={state.activeGalleryType}
  showGallery={state.showGallery}
  showGalleryString={state.activeGalleryTypeString}
  onClose={handleHideGalleryCallback}
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `galleryType` | `number \| string` | Gallery filter type (0-4) or 'all' |
| `showGallery` | `boolean` | Whether to show the gallery |
| `showGalleryString` | `string` | Display name for the gallery type |
| `onClose` | `function` | Callback when gallery is closed |

## Customization

### Styling
- Edit `imageGallery.css` to customize the appearance
- The component uses CSS custom properties for easy theming
- Fully responsive with mobile-first design

### Behavior
- Modify `ImageGallery.jsx` to change:
  - Slide transition timing
  - Thumbnail position/size
  - Navigation button styles
  - Description layout

## Dependencies

The new component requires:
- `react-image-gallery` (installed)
- Your existing `imgData.js` and data type files

## Migration Notes

The new ImageGallery component:
- ✅ **Simpler Props**: Requires fewer props than the old Gallery
- ✅ **Better Performance**: Built-in lazy loading and optimization
- ✅ **More Features**: Fullscreen, slideshow, better navigation
- ✅ **Cleaner Code**: Less custom state management needed
- ✅ **Accessibility**: Better keyboard and screen reader support

## Demo

Run the demo component to see the gallery in action:
```jsx
import ImageGalleryDemo from './components/galleries/ImageGalleryDemo';

// Use in your app to test the gallery
<ImageGalleryDemo />
```

The old Gallery component remains unchanged in case you need to reference it or switch back.
