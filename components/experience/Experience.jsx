import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  useMemo,
} from 'react';
import { Splat, Text, PresentationControls } from '@react-three/drei';
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
const AnimatedText = memo(
  ({
    position,
    children,
    fontSize,
    delay = 0,
    initialLoadComplete,
    alphaAnimationComplete,
  }) => {
    const deviceConfig = getDeviceConfig();
    // Match backup: start below grass line then animate up
    const grassLevel = deviceConfig.isMobile
      ? -1.5
      : deviceConfig.isTablet
      ? -1.2
      : -1.0;
    const startPosition = [position[0], grassLevel, position[2]];
    // Always render at the final position immediately (no gating on alpha animation)
    const { animatedPosition } = useSpring({
      animatedPosition: position,
      config: {
        mass: 3,
        tension: 180,
        friction: 35,
        precision: 0.001,
      },
      delay: 0,
    });

    return (
      <animated.group position={animatedPosition}>
        <Text
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
      </animated.group>
    );
  }
);

// Error Fallback Component - invisible placeholder instead of red cube
const ErrorFallback = () => <group position={[0, 0, 0]} />;

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
  const [manualAlphaTest, setManualAlphaTest] = useState(0.5);
  const [alphaAnimationComplete, setAlphaAnimationComplete] = useState(false);

  const animationRef = useRef();
  const alphaAnimationRequestRef = useRef(null);
  const isInitialMountRef = useRef(true);
  const { camera, scene } = useThree();

  // Set scene background
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color('#f8f8f8');
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
    // Auto-rotate only on main screen (no overlays). Pause when user is interacting.
    if (!userInteracting && !hasOverlay) {
      const time = state.clock.getElapsedTime();

      // Orbital rotation around the seat (assumed to be at [0, 0, 0])
      // Reduced radius to bring camera closer to the chair
      const radius = deviceConfig.isMobile
        ? 3.2
        : deviceConfig.isTablet
        ? 3.0
        : 2.8; // Distance from the seat
      const rotationSpeed = 0.1; // Base rotation speed
      const baseHeight = 1.5; // Base camera height above ground (increased for safety)
      const heightVariation = 0.2; // Reduced height variation for stability
      const minHeight = 1.0; // Absolute minimum height above grass level
      const maxHeight = 2.5; // Maximum height to prevent extreme angles

      // Calculate orbital position without mouse influence; user drag is handled by PresentationControls
      const angle = time * rotationSpeed;
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
      const horizontalDistance = Math.sqrt(
        cameraToSeat.x * cameraToSeat.x + cameraToSeat.z * cameraToSeat.z
      );
      const maxTiltAngle = Math.PI / 6; // 30 degrees maximum tilt
      const currentTiltAngle = Math.atan2(
        Math.abs(cameraToSeat.y),
        horizontalDistance
      );

      // Adjust seat look-at position if tilt would be too extreme
      let adjustedSeatY = 0;
      if (currentTiltAngle > maxTiltAngle) {
        const maxYDiff = horizontalDistance * Math.tan(maxTiltAngle);
        adjustedSeatY =
          camera.position.y > 0
            ? camera.position.y - maxYDiff
            : camera.position.y + maxYDiff;
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
        const currentAlpha = 0.5 + (0.2 - 0.5) * progress;

        setManualAlphaTest(currentAlpha);

        if (progress < 1) {
          alphaAnimationRequestRef.current =
            requestAnimationFrame(animateAlpha);
        } else {
          setAlphaAnimationComplete(true);
          alphaAnimationRequestRef.current = null;
        }
      };

      alphaAnimationRequestRef.current = requestAnimationFrame(animateAlpha);
      isInitialMountRef.current = false;
    } else if (!isInitialMountRef.current) {
      // Handle overlay changes
      const targetAlpha = hasOverlay ? 0.6 : 0.2;
      const duration = hasOverlay ? 600 : 400;

      if (manualAlphaTest !== targetAlpha) {
        const startAlpha = manualAlphaTest;
        const startTime = Date.now();

        const animateAlpha = () => {
          const elapsedTime = Date.now() - startTime;
          const progress = Math.min(elapsedTime / duration, 1);

          setManualAlphaTest(
            startAlpha + (targetAlpha - startAlpha) * progress
          );

          if (progress < 1) {
            alphaAnimationRequestRef.current =
              requestAnimationFrame(animateAlpha);
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

  const handlePointerMove = useCallback(
    (event) => {
      // No-op: dragging is handled by PresentationControls; we only track down/up to pause auto-rotate
      return;
    },
    [hasOverlay, windowWidth]
  );

  // Exact three-word layout from backup: positions, sizes, and splat config
  const deviceConfigExact = useMemo(() => {
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 1300;
    const isDesktop = windowWidth >= 1300;
    const isPortrait = window.innerHeight > window.innerWidth;

    let titlePosition, foundPosition, woodPosition, fontSize, splatConfig;

    if (isMobile) {
      // Mobile: DOUG'S, Found, Wood
      titlePosition = [-0.7, -0.1, -0.3];
      foundPosition = [0, -0.1, 0.0];
      woodPosition = [0.7, -0.1, -0.3];
      fontSize = isPortrait ? 0.25 : 0.22;
      splatConfig = { size: 40, scale: 0.8, position: [0, 0, -0.5] };
    } else if (isTablet) {
      // Tablet
      titlePosition = [-0.9, -0.1, -0.3];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1, -0.1, -0.3];
      fontSize = isPortrait ? 0.3 : 0.28;
      splatConfig = { size: 35, scale: 1, position: [0, 0, 0] };
    } else {
      // Desktop
      titlePosition = [-1.2, -0.1, 0.0];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1.2, -0.1, 0];
      fontSize = 0.35;
      splatConfig = { size: 30, scale: 1, position: [0, 0, 0] };
    }

    return {
      titlePosition,
      foundPosition,
      woodPosition,
      fontSize,
      splatConfig,
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
    };
  }, [windowWidth]);

  return (
    <PresentationControls
      // Draggable only when main screen is open (no overlays)
      enabled={!hasOverlay}
      global={false}
      cursor={true}
      snap={false}
      speed={1}
      zoom={1}
      rotation={[0, 0, 0]}
      // Allow left-right (azimuth) and up-down (polar); no roll
      azimuth={[-Math.PI / 3, Math.PI / 3]}
      polar={[-Math.PI / 8, Math.PI / 3]}
      config={{ mass: 1, tension: 170, friction: 26 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {/* Splat Component - exact config */}
      <SmartSplat
        position={deviceConfigExact.splatConfig.position}
        scale={deviceConfigExact.splatConfig.scale}
        alphaTest={manualAlphaTest}
        onSplatLoaded={onSplatLoaded}
        renderOrder={1}
        splatSize={deviceConfigExact.splatConfig.size}
      />

      {/* Exact three-word text layout */}
      {!hasOverlay && (
        <>
          <AnimatedText
            position={deviceConfigExact.titlePosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.2}
            initialLoadComplete={initialLoadComplete}
            alphaAnimationComplete={alphaAnimationComplete}
          >
            DOUG'S
          </AnimatedText>
          <AnimatedText
            position={deviceConfigExact.foundPosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.5}
            initialLoadComplete={initialLoadComplete}
            alphaAnimationComplete={alphaAnimationComplete}
          >
            Found
          </AnimatedText>
          <AnimatedText
            position={deviceConfigExact.woodPosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.8}
            initialLoadComplete={initialLoadComplete}
            alphaAnimationComplete={alphaAnimationComplete}
          >
            Wood
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
        position: [0.4, 1.2, 3.2],
        fov: 45,
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
        antialias: false,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
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
