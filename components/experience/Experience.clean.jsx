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
  const grassLevel = deviceConfig.isMobile ? -1.5 : deviceConfig.isTablet ? -1.2 : -1.0;
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
});

// Error Fallback Component
const ErrorFallback = () => (
  <mesh position={[0, 0, 0]}>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="red" opacity={0.5} transparent />
  </mesh>
);

// Smart Splat Component with URL handling
const SmartSplat = memo(({ onSplatLoaded, alphaTest, ...props }) => {
  const [currentSplatUrl, setCurrentSplatUrl] = useState('');
  const [isProcessingBlob, setIsProcessingBlob] = useState(false);

  const urls = [
    'https://foundwoodstorage.blob.core.windows.net/splatfiles/fixed_model.splat',
    '/assets/experience/fixed_model.splat'
  ];

  // URL Priority Logic
  useEffect(() => {
    const selectUrl = async () => {
      const isProduction = import.meta.env.PROD;
      const prioritizedUrls = isProduction ? urls : [...urls].reverse();

      for (const url of prioritizedUrls) {
        try {
          if (url.includes('blob.core.windows.net')) {
            setIsProcessingBlob(true);
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
              const blobResponse = await fetch(url);
              const blob = await blobResponse.blob();
              const objectUrl = URL.createObjectURL(blob);
              setCurrentSplatUrl(objectUrl);
              setIsProcessingBlob(false);
              return;
            }
          } else {
            setCurrentSplatUrl(url);
            return;
          }
        } catch (error) {
          continue;
        }
      }
      
      // Fallback if all URLs fail
      setCurrentSplatUrl(urls[1]);
      setIsProcessingBlob(false);
    };

    selectUrl();
  }, []);

  // Progress Checker
  useEffect(() => {
    if (currentSplatUrl && !isProcessingBlob && onSplatLoaded) {
      const timer = setTimeout(() => {
        onSplatLoaded();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentSplatUrl, isProcessingBlob, onSplatLoaded]);

  if (!currentSplatUrl || isProcessingBlob) {
    return <ErrorFallback />;
  }

  try {
    return (
      <Splat
        src={currentSplatUrl}
        alphaTest={alphaTest}
        {...props}
      />
    );
  } catch (error) {
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

  // Camera animation logic
  const deviceConfig = getDeviceConfig();
  const hasOverlay = showContactPage || showTypes || showGallery;

  useFrame((state, delta) => {
    if (!userInteracting && !hasOverlay && isAnimating) {
      const time = state.clock.getElapsedTime();
      const targetRotation = Math.sin(time * 0.1) * 0.02;
      camera.rotation.z += (targetRotation - camera.rotation.z) * 0.01;
      camera.position.x += (targetX - camera.position.x) * 0.01;
    }
  });

  // Alpha test animation
  useEffect(() => {
    if (alphaAnimationRequestRef.current) {
      cancelAnimationFrame(alphaAnimationRequestRef.current);
    }

    if (isInitialMountRef.current && initialLoadComplete) {
      const startTime = Date.now();
      const animationDuration = 5000;

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
      const normalizedX = (event.clientX / windowWidth - 0.5) * 2;
      setTargetX(normalizedX * 0.5);
    }
  }, [hasOverlay, isAnimating, windowWidth]);

  // Text positions based on device
  const getTextPositions = () => {
    if (deviceConfig.isMobile) {
      return {
        title: [0, 1.8, 0],
        subtitle: [0, 1.4, 0],
        titleSize: 0.15,
        subtitleSize: 0.08,
      };
    } else if (deviceConfig.isTablet) {
      return {
        title: [0, 2.2, 0],
        subtitle: [0, 1.7, 0],
        titleSize: 0.2,
        subtitleSize: 0.1,
      };
    } else {
      return {
        title: [0, 2.5, 0],
        subtitle: [0, 2.0, 0],
        titleSize: 0.25,
        subtitleSize: 0.12,
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
