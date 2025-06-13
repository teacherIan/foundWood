import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import {
  Splat,
  Text,
  PresentationControls,
  useProgress,
  Preload,
} from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import './experienceStyles.css';
import splat from '../../src/assets/new_experience/full.splat';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';

// Removed post-processing effects for better performance and simplified visuals

// Simple Text component with basic material that doesn't require lighting
const MemoizedText = memo(({ position, children, fontSize, delay = 0 }) => (
  <Text
    position={position}
    color="#ffffff"
    anchorX="center"
    anchorY="middle"
    font={driftwood}
    fontSize={fontSize}
    letterSpacing={0.03}
    textAlign="center"
    maxWidth={200}
    lineHeight={1.2}
  >
    <meshBasicMaterial color="#ffffff" />
    {children}
  </Text>
));

function Scene({ isAnimating, showContactPage, showTypes, showGallery }) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInteracting, setUserInteracting] = useState(false);
  const { progress } = useProgress();
  const animationRef = useRef();
  const { camera } = useThree();
  const idleTimeRef = useRef(0);
  const interactionTimeRef = useRef(0);

  // Check if any overlay is active
  const hasOverlay = showContactPage || showTypes || showGallery;

  // Enhanced camera animation with interaction awareness
  const animateCamera = useCallback(
    (state, delta) => {
      // Keep the scene rendering but skip camera animations when overlays are active
      // This maintains scene visibility while saving processing power on animations
      if (!isAnimating) return;
      if (hasOverlay) return; // Skip only camera animations, not rendering

      idleTimeRef.current += delta;

      // Detect user interaction
      if (userInteracting) {
        interactionTimeRef.current = 0;
        setUserInteracting(false);
      } else {
        interactionTimeRef.current += delta;
      }

      // Reduce animation intensity when user is interacting
      const interactionFactor = Math.min(1, interactionTimeRef.current / 2); // Fade in over 2 seconds

      // More sophisticated camera movement with multiple sine waves
      const slowWave =
        Math.sin(idleTimeRef.current * 0.3) * 0.015 * interactionFactor;
      const fastWave =
        Math.sin(idleTimeRef.current * 1.2) * 0.008 * interactionFactor;
      const verticalWave =
        Math.sin(idleTimeRef.current * 0.8) * 0.01 * interactionFactor;

      // Subtle breathing effect
      const breathingEffect =
        Math.sin(idleTimeRef.current * 0.5) * 0.05 * interactionFactor;

      camera.position.x = slowWave + fastWave * 0.5 + -0;
      camera.position.y =
        (windowWidth < 480 ? 1.3 : 1.2) + verticalWave + breathingEffect * 0.3;
      camera.position.z = (windowWidth < 480 ? 2.5 : 3) + breathingEffect;

      // Subtle rotation for more dynamic feel + downward tilt to see text better
      camera.rotation.y = slowWave * 0.03;
      camera.rotation.x =
        (windowWidth < 480 ? -0.1 : -0.05) + verticalWave * 0.01;

      camera.updateProjectionMatrix();
    },
    [camera, isAnimating, userInteracting, hasOverlay]
  );

  useFrame(animateCamera);

  // Enhanced resize handler with better camera positioning
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    setWindowWidth(width);
    setTargetX(width > 1000 ? -1.5 : 0);

    if (camera) {
      if (width < 480) {
        if (isPortrait) {
          camera.position.set(0, 1.6, 4.2);
          camera.rotation.x = 0;
          camera.fov = 65;
        } else {
          camera.position.set(0, 1.2, 3.2);
          camera.rotation.x = 0;
          camera.fov = 70;
        }
      } else if (width < 1300) {
        if (isPortrait) {
          camera.position.set(0, 1.1, 4.0);
          camera.rotation.x = -0.05;
          camera.fov = 65;
        } else {
          camera.position.set(0, 0.9, 3.5);
          camera.rotation.x = -0.05;
          camera.fov = 60;
        }
      } else {
        camera.position.set(0, 0.7, 3.2);
        camera.rotation.x = -0.05;
        camera.fov = 55;
      }
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useEffect(() => {
    handleResize();
    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener('resize', debouncedResize);
    return () => window.removeEventListener('resize', debouncedResize);
  }, [handleResize]);

  // Optimized animation frame
  useEffect(() => {
    if (!isAnimating) return;

    let startTime = null;
    let loadProgress = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const delta = Math.min(0.01, (elapsed / 1000) * 0.5);
      loadProgress = Math.min(loadProgress + delta, 1);

      if (loadProgress < 1 && isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Enhanced device configuration with better text positioning for portrait/landscape
  const deviceConfig = useMemo(() => {
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 1300;
    const isDesktop = windowWidth >= 1300;
    const isHighDPI = window.devicePixelRatio > 1.5;

    // Better orientation detection
    const isPortrait = window.innerHeight > window.innerWidth;
    const aspectRatio = window.innerWidth / window.innerHeight;

    let titlePosition,
      foundPosition,
      woodPosition,
      fontSize,
      splatConfig,
      effectsLevel;

    if (isMobile) {
      if (isPortrait) {
        // Portrait mobile: Vertical line arrangement for better visibility
        titlePosition = [0, -0.05, 0];
        foundPosition = [0, -0.05, 0.4];
        woodPosition = [0, -0.05, 0.7];
        fontSize = 0.28;
      } else {
        // Landscape mobile: Horizontal row arrangement
        titlePosition = [-1.2, 0.05, 0];
        foundPosition = [0, 0.05, 0.4];
        woodPosition = [1.2, 0.05, 0.7];
        fontSize = 0.22;
      }
      effectsLevel = 'low'; // Minimal effects for mobile
      splatConfig = {
        size: 40,
        scale: 0.8,
        position: [0, 0, -0.5],
      };
    } else if (isTablet) {
      if (isPortrait) {
        // Portrait tablet: Modified vertical arrangement
        titlePosition = [0, -0.1, 0.2];
        foundPosition = [0, -0.1, 0.6];
        woodPosition = [0, -0.1, 1.0];
        fontSize = 0.32;
      } else {
        // Landscape tablet: Spread out horizontally
        titlePosition = [-0.8, -0.05, 0.2];
        foundPosition = [0, -0.05, 0.8];
        woodPosition = [0.8, -0.05, 1.2];
        fontSize = 0.28;
      }
      effectsLevel = 'medium'; // Moderate effects for tablets
      splatConfig = {
        size: 35,
        scale: 1,
        position: [0, 0, 0],
      };
    } else {
      // Desktop: Optimized for landscape viewing
      titlePosition = [-1.2, -0.1, 0];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1.2, -0.1, 0];
      fontSize = 0.35;
      effectsLevel = 'high'; // Full effects for desktop
      splatConfig = {
        size: 30,
        scale: 1,
        position: [0, 0, 0],
      };
    }

    return {
      titlePosition,
      foundPosition,
      woodPosition,
      fontSize,
      splatConfig,
      effectsLevel,
      isMobile,
      isTablet,
      isDesktop,
      isHighDPI,
      isPortrait,
      aspectRatio,
    };
  }, [windowWidth]);

  // Memoized presentation controls config
  const presentationConfig = useMemo(
    () => ({
      mass: deviceConfig.isMobile ? 5 : 10,
      tension: 100,
      friction: deviceConfig.isMobile ? 15 : 20,
      speed: deviceConfig.isMobile ? 1.5 : 2,
    }),
    [deviceConfig.isMobile]
  );

  return (
    <>
      <PresentationControls
        makeDefault
        enabled={!hasOverlay}
        global
        snap
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
        config={presentationConfig}
        onStart={() => setUserInteracting(true)}
        onEnd={() => {
          // Reset after a delay to allow for smooth transition
          setTimeout(() => setUserInteracting(false), 100);
        }}
      >
        {isAnimating && (
          <>
            <MemoizedText
              position={deviceConfig.titlePosition}
              fontSize={deviceConfig.fontSize}
              delay={0}
            >
              DOUG'S
            </MemoizedText>
            <MemoizedText
              position={deviceConfig.foundPosition}
              fontSize={deviceConfig.fontSize}
              delay={0.3}
            >
              Found
            </MemoizedText>
            <MemoizedText
              position={deviceConfig.woodPosition}
              fontSize={deviceConfig.fontSize}
              delay={0.6}
            >
              Wood
            </MemoizedText>

            {/* Enhanced Splat with better rendering */}
            <mesh
              position={deviceConfig.splatConfig.position}
              scale={deviceConfig.splatConfig.scale}
            >
              <Splat
                alphaTest={0.4}
                alphaHashing={true}
                chunkSize={0.01}
                src={splat}
                splatSize={deviceConfig.splatConfig.size}
                // toneMapped={true}
              />
            </mesh>
          </>
        )}
      </PresentationControls>

      {/* Post-processing effects removed for better performance and simplicity */}
      {/* Preload assets for better performance */}
      {/* <Preload all /> */}
    </>
  );
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default function App({ isAnimating, showContactPage, showTypes, showGallery }) {
  // Adaptive performance settings based on device capability
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 1300;
  const isHighDPI = window.devicePixelRatio > 1.5;

  // Performance settings based on device
  const performanceConfig = useMemo(() => {    
    if (isMobile) {
      return {
        dpr: [1, 1.5],
        performance: { min: 0.3, max: 0.8, debounce: 300 },
        antialias: false,
        frameloop: 'always',
      };
    } else if (isTablet) {
      return {
        dpr: [1, 2],
        performance: { min: 0.4, max: 0.9, debounce: 250 },
        antialias: true,
        frameloop: 'always',
      };
    } else {
      return {
        dpr: [1, 2],
        performance: { min: 0.5, max: 1, debounce: 200 },
        antialias: true,
        frameloop: 'always',
      };
    }
  }, [isMobile, isTablet]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Canvas
      camera={{
        position: [0, 0.8, 3.5],
        fov: 60,
        near: 0.1,
        far: 100,
      }}
      dpr={performanceConfig.dpr}
      performance={performanceConfig.performance}
      style={{
        background: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: (showTypes || showGallery || showContactPage) ? 1 : 10,
      }}
      gl={{
        powerPreference: isMobile ? 'default' : 'high-performance',
        antialias: performanceConfig.antialias,
        depth: true,
        stencil: !isMobile,
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        clearColor: [0.96, 0.96, 0.96, 1],
        outputColorSpace: 'srgb',
      }}
      frameloop={performanceConfig.frameloop}
    >
      <Scene 
        showContactPage={showContactPage} 
        showTypes={showTypes}
        showGallery={showGallery}
        isAnimating={isAnimating} 
      />
    </Canvas>
  );
}
