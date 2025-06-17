# Doug's Found Wood

A beautiful 3D interactive showcase for handcrafted wooden furniture, built with React Three Fiber and React Spring.

## Features

- **3D Interactive Experience**: Explore furniture pieces in an immersive 3D environment
- **Responsive Gallery**: Browse furniture collections with smooth animations
- **Contact Integration**: Direct contact form with EmailJS integration
- **Performance Optimized**: Optimized for both desktop and mobile devices
- **Smooth Animations**: Beautiful loading animations and transitions

## Tech Stack

- **React 18** - Modern React with hooks
- **React Three Fiber** - 3D rendering with Three.js
- **React Spring** - Smooth animations and transitions
- **Vite** - Fast development and build tool
- **EmailJS** - Contact form integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd foundWood
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
foundWood/
├── src/                    # Main application source
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles
│   └── assets/            # Static assets
├── components/            # React components
│   ├── contact/           # Contact form components
│   ├── galleries/         # Gallery components
│   ├── experience/        # 3D experience components
│   └── select_gallery/    # Gallery selection components
├── public/               # Public assets
│   └── assets/          # 3D models and images
└── package.json         # Project dependencies
```

## Performance Features

- **Hardware Acceleration**: GPU-optimized rendering
- **Lazy Loading**: Images and assets loaded on demand
- **Mobile Optimization**: Responsive design with mobile-specific optimizations
- **Memory Management**: Efficient WebGL context handling

## Browser Support

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is a client project for Doug's Found Wood. Please contact the development team for contribution guidelines.

## License

Private project - All rights reserved.
