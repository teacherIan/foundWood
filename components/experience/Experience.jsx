import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
} from 'react';
import {
  Splat,
  Text,
  PresentationControls,
} from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import './experienceStyles.css';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';

// Device configuration
const getDeviceConfig = () => {
  const width = window.innerWidth;
  return {
    isMobile: width <= 768,
    isTablet: width > 768 && width <= 1024,
    isDesktop: width > 1024,
  };
};

// Animated Text Component
const AnimatedText = memo(({
  position,
  children,
  fontSize,
  delay = 0,
  initialLoadComplete,
  alphaAnimationComplete,
}) => {
  const deviceConfig = getDeviceConfig();
  const grassLevel = deviceConfig.isMobile ? -0.8 : deviceConfig.isTablet ? -0.7 : -0.6;
  const startPosition = [position[0], grassLevel, position[2]];
  const shouldAnimateText = initialLoadComplete && alphaAnimationComplete;

  const { animatedPosition } = useSpring({
    animatedPosition: shouldAnimateText ? position : startPosition,
    config: {
      mass: 3,
      tension: 180,
      friction: 35,
      precision: 0.001,
    },
    delay: shouldAnimateText ? delay * 1000 : 0,
  });

  return (
    <animated.group position={animatedPosition}>
      <Text
        color="#77481C"
        anchorX="center"
        anchorY="middle"
        font={driftwood}
        fontSize={fontSize}
        letterSpacing={0.03}
        textAlign="center"
        maxWidth={200}
        lineHeight={1.2}
      >
        <meshBasicMaterial color="#77481C" />
        {children}
      </Text>
    </animated.group>
  );
});

// Error Fallback Component - invisible placeholder instead of red cube
const ErrorFallback = () => (
  <group position={[0, 0, 0]} />
);

// Simple Splat Component - uses local file only
const SmartSplat = memo(({ onSplatLoaded, alphaTest, ...props }) => {
  const localSplatUrl = '/assets/experience/fixed_model.splat';

  // Progress Checker
  useEffect(() => {
    if (onSplatLoaded) {
      const timer = setTimeout(() => {
        onSplatLoaded();
      }, 1000); // Reduced timeout since it's local
      return () => clearTimeout(timer);
    }
  }, [onSplatLoaded]);

  try {
    return (
      <Splat
        src={localSplatUrl}
        alphaTest={alphaTest}
        {...props}
      />
    );
  } catch (error) {
    console.warn('Failed to load local splat file:', error);
    return <ErrorFallback />;
  }
});

// Main Scene Component
function Scene({
  isAnimating,
  showContactPage,
  showTypes,
  showGallery,
  onSplatLoaded,
  initialLoadComplete,
}) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInteracting, setUserInteracting] = useState(false);
  const [manualAlphaTest, setManualAlphaTest] = useState(0.8);
  const [alphaAnimationComplete, setAlphaAnimationComplete] = useState(false);
  
  const animationRef = useRef();
  const alphaAnimationRequestRef = useRef(null);
  const isInitialMountRef = useRef(true);
  const { camera, scene } = useThree();

  // Set scene background
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color('#f5f5f5');
    }
  }, [scene]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Camera animation logic - orbital rotation around the seat
  const deviceConfig = getDeviceConfig();
  const hasOverlay = showContactPage || showTypes || showGallery;

  useFrame((state, delta) => {
    if (!userInteracting && !hasOverlay && isAnimating) {
      const time = state.clock.getElapsedTime();
      
      // Orbital rotation around the seat (assumed to be at [0, 0, 0])
      const radius = 5; // Distance from the seat
      const rotationSpeed = 0.1; // Base rotation speed
      const baseHeight = 1.5; // Base camera height above ground (increased for safety)
      const heightVariation = 0.2; // Reduced height variation for stability
      const minHeight = 1.0; // Absolute minimum height above grass level
      const maxHeight = 2.5; // Maximum height to prevent extreme angles
      
      // Calculate orbital position with mouse influence
      const mouseInfluence = targetX * 0.3; // Reduced mouse influence for stability
      const angle = time * rotationSpeed + mouseInfluence;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Calculate Y position with proper constraints
      const yVariation = Math.sin(time * 0.3) * heightVariation;
      const targetY = baseHeight + yVariation;
      const y = Math.max(minHeight, Math.min(maxHeight, targetY));
      
      // Smoothly move camera to orbital position
      camera.position.x += (x - camera.position.x) * 0.02;
      camera.position.y += (y - camera.position.y) * 0.02;
      camera.position.z += (z - camera.position.z) * 0.02;
      
      // Ensure camera never goes below grass level (extra safety check)
      if (camera.position.y < minHeight) {
        camera.position.y = minHeight;
      }
      
      // Stable look-at with angle constraints
      const seatPosition = new THREE.Vector3(0, 0, 0);
      const cameraToSeat = seatPosition.clone().sub(camera.position);
      
      // Calculate angle to prevent extreme tilting
      const horizontalDistance = Math.sqrt(cameraToSeat.x * cameraToSeat.x + cameraToSeat.z * cameraToSeat.z);
      const maxTiltAngle = Math.PI / 6; // 30 degrees maximum tilt
      const currentTiltAngle = Math.atan2(Math.abs(cameraToSeat.y), horizontalDistance);
      
      // Adjust seat look-at position if tilt would be too extreme
      let adjustedSeatY = 0;
      if (currentTiltAngle > maxTiltAngle) {
        const maxYDiff = horizontalDistance * Math.tan(maxTiltAngle);
        adjustedSeatY = camera.position.y > 0 ? camera.position.y - maxYDiff : camera.position.y + maxYDiff;
      }
      
      // Look at the seat with controlled tilt
      const lookAtTarget = new THREE.Vector3(0, adjustedSeatY, 0);
      camera.lookAt(lookAtTarget);
    }
  });

  // Alpha test animation
  useEffect(() => {
    if (alphaAnimationRequestRef.current) {
      cancelAnimationFrame(alphaAnimationRequestRef.current);
    }

    if (isInitialMountRef.current && initialLoadComplete) {
      const startTime = Date.now();
      const animationDuration = 60000; // 60 seconds for extremely slow, imperceptible transition

      const animateAlpha = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        const currentAlpha = 0.8 + (0.3 - 0.8) * progress;

        setManualAlphaTest(currentAlpha);

        if (progress < 1) {
          alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
        } else {
          setAlphaAnimationComplete(true);
          alphaAnimationRequestRef.current = null;
        }
      };

      alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
      isInitialMountRef.current = false;
    } else if (!isInitialMountRef.current) {
      // Handle overlay changes
      const targetAlpha = hasOverlay ? 0.8 : 0.3;
      const duration = hasOverlay ? 600 : 400;

      if (manualAlphaTest !== targetAlpha) {
        const startAlpha = manualAlphaTest;
        const startTime = Date.now();

        const animateAlpha = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          setManualAlphaTest(startAlpha + (targetAlpha - startAlpha) * progress);

          if (progress < 1) {
            alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
          } else {
            alphaAnimationRequestRef.current = null;
          }
        };

        alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
      }
    }

    return () => {
      if (alphaAnimationRequestRef.current) {
        cancelAnimationFrame(alphaAnimationRequestRef.current);
      }
    };
  }, [hasOverlay, initialLoadComplete, manualAlphaTest]);

  // Interaction handlers
  const handlePointerDown = useCallback(() => {
    setUserInteracting(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setUserInteracting(false);
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (!hasOverlay && isAnimating) {
      // When user moves mouse, temporarily adjust the orbital rotation speed
      const normalizedX = (event.clientX / windowWidth - 0.5) * 2;
      const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;
      
      // Influence the camera's orbital position slightly based on mouse movement
      setTargetX(normalizedX * 1.5); // This will be used to offset the orbital angle
    }
  }, [hasOverlay, isAnimating, windowWidth]);

  // Text positions based on device
  const getTextPositions = () => {
    if (deviceConfig.isMobile) {
      return {
        title: [0, 0, 0],
        subtitle: [0, -0.4, 0],
        titleSize: 0.25,
        subtitleSize: 0.12,
      };
    } else if (deviceConfig.isTablet) {
      return {
        title: [0, 0, 0.6],
        subtitle: [0, -0.4, 0.3],
        titleSize: 0.3,
        subtitleSize: 0.15,
      };
    } else {
      return {
        title: [0, 1, 0.6],
        subtitle: [0, -0.4, 0.3],
        titleSize: 0.35,
        subtitleSize: 0.18,
      };
    }
  };

  const textConfig = getTextPositions();

  return (
    <PresentationControls
      enabled={!hasOverlay && isAnimating}
      global={false}
      cursor={true}
      snap={false}
      speed={1}
      zoom={1}
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 4, Math.PI / 4]}
      azimuth={[-Math.PI / 4, Math.PI / 4]}
      config={{ mass: 1, tension: 170, friction: 26 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Splat Component */}
      <SmartSplat
        position={[0, 0, 0]}
        scale={deviceConfig.isMobile ? 0.8 : 1}
        alphaTest={manualAlphaTest}
        onSplatLoaded={onSplatLoaded}
      />

      {/* Text Elements */}
      {isAnimating && (
        <>
          <AnimatedText
            position={textConfig.title}
            fontSize={textConfig.titleSize}
            delay={0.5}
            initialLoadComplete={initialLoadComplete}
            alphaAnimationComplete={alphaAnimationComplete}
          >
            FOUND WOOD
          </AnimatedText>
          
          <AnimatedText
            position={textConfig.subtitle}
            fontSize={textConfig.subtitleSize}
            delay={1.0}
            initialLoadComplete={initialLoadComplete}
            alphaAnimationComplete={alphaAnimationComplete}
          >
            Custom Furniture & Woodworking
          </AnimatedText>
        </>
      )}
    </PresentationControls>
  );
}

// Main Experience Component
export default function Experience({
  isAnimating,
  showContactPage,
  showTypes,
  showGallery,
  onSplatLoaded,
  imagesLoaded,
  initialLoadComplete,
}) {
  const hasOverlay = showContactPage || showTypes || showGallery;

  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      style={{
        background: '#f5f5f5',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
    >
      <Scene
        showContactPage={showContactPage}
        showTypes={showTypes}
        showGallery={showGallery}
        hasOverlay={hasOverlay}
        isAnimating={isAnimating}
        onSplatLoaded={onSplatLoaded}
        imagesLoaded={imagesLoaded}
        initialLoadComplete={initialLoadComplete}
      />
    </Canvas>
  );
}
