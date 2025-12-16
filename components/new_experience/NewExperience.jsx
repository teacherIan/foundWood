import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  memo,
  useMemo,
} from 'react';
import { Text, PresentationControls } from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { SplatMesh, SparkRenderer } from '@sparkjsdev/spark';
import './newExperienceStyles.css';
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
  }) => {
    const deviceConfig = getDeviceConfig();
    const grassLevel = deviceConfig.isMobile
      ? -1.5
      : deviceConfig.isTablet
      ? -1.2
      : -1.0;
    const startPosition = [position[0], grassLevel, position[2]];
    
    const { animatedPosition } = useSpring({
      animatedPosition: position,
      from: { animatedPosition: startPosition },
      config: {
        mass: 3,
        tension: 180,
        friction: 35,
        precision: 0.001,
      },
      delay: delay * 1000,
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

// SparkJS Splat Component - using the new .spz file!
const SparkSplat = memo(({ onSplatLoaded, position, scale, ...props }) => {
  const splatRef = useRef();
  const sparkRendererRef = useRef();
  const { scene, gl } = useThree();
  const [isLoaded, setIsLoaded] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    console.log('🎨 Initializing SparkJS with SparkRenderer...');
    
    // Create SparkRenderer - required for SparkJS to work properly
    const sparkRenderer = new SparkRenderer({
      renderer: gl,
      autoUpdate: true,
      preUpdate: false,
    });
    
    sparkRendererRef.current = sparkRenderer;
    scene.add(sparkRenderer);
    
    console.log('✅ SparkRenderer created and added to scene');
    
    // Create SparkJS SplatMesh with your full_scene.spz file
    const splatMesh = new SplatMesh({
      url: '/assets/experience/full_scene.spz',
      onLoad: (mesh) => {
        console.log('✅ SparkJS SplatMesh loaded!', mesh);
        setIsLoaded(true);
        if (onSplatLoaded) {
          onSplatLoaded();
        }
      },
    });

    // Set position and scale
    if (position) {
      splatMesh.position.set(...position);
    }
    if (scale) {
      if (typeof scale === 'number') {
        splatMesh.scale.set(scale, scale, scale);
      } else {
        splatMesh.scale.set(...scale);
      }
    }

    splatRef.current = splatMesh;
    
    // Add to scene
    scene.add(splatMesh);
    console.log('✅ SplatMesh added to scene');

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up SparkJS...');
      if (splatRef.current) {
        scene.remove(splatRef.current);
        if (splatRef.current.dispose) {
          splatRef.current.dispose();
        }
      }
      if (sparkRendererRef.current) {
        scene.remove(sparkRendererRef.current);
      }
    };
  }, [scene, gl, onSplatLoaded, position, scale]);

  // SparkJS handles its own rendering, so we return null for R3F
  return null;
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userInteracting, setUserInteracting] = useState(false);
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

  const deviceConfig = getDeviceConfig();
  const hasOverlay = showContactPage || showTypes || showGallery;

  // Smooth orbital camera animation
  useFrame((state, delta) => {
    if (!userInteracting && !hasOverlay) {
      const time = state.clock.getElapsedTime();

      // Orbital parameters - creative rotation around the scene
      const radius = deviceConfig.isMobile ? 3.5 : deviceConfig.isTablet ? 3.2 : 3.0;
      const rotationSpeed = 0.08; // Smooth, gentle rotation
      const baseHeight = 1.6;
      const heightVariation = 0.3;
      const minHeight = 1.0;
      const maxHeight = 2.5;

      // Calculate orbital position with gentle wave motion
      const angle = time * rotationSpeed;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Add subtle vertical motion
      const yVariation = Math.sin(time * 0.25) * heightVariation;
      const targetY = baseHeight + yVariation;
      const y = Math.max(minHeight, Math.min(maxHeight, targetY));

      // Smooth camera movement
      camera.position.x += (x - camera.position.x) * 0.015;
      camera.position.y += (y - camera.position.y) * 0.015;
      camera.position.z += (z - camera.position.z) * 0.015;

      // Ensure minimum height
      if (camera.position.y < minHeight) {
        camera.position.y = minHeight;
      }

      // Look at center with slight offset for visual interest
      const lookAtOffset = new THREE.Vector3(
        Math.sin(time * 0.1) * 0.2,
        0,
        Math.cos(time * 0.1) * 0.2
      );
      camera.lookAt(lookAtOffset);
    }
  });

  // Interaction handlers
  const handlePointerDown = useCallback(() => {
    setUserInteracting(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setUserInteracting(false);
  }, []);

  // Device-specific configuration
  const deviceConfigExact = useMemo(() => {
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 1300;
    const isDesktop = windowWidth >= 1300;
    const isPortrait = window.innerHeight > window.innerWidth;

    let titlePosition, foundPosition, woodPosition, fontSize, splatConfig;

    if (isMobile) {
      titlePosition = [-0.7, -0.1, -0.3];
      foundPosition = [0, -0.1, 0.0];
      woodPosition = [0.7, -0.1, -0.3];
      fontSize = isPortrait ? 0.25 : 0.22;
      splatConfig = { scale: 1.0, position: [0, 0, 0] };
    } else if (isTablet) {
      titlePosition = [-0.9, -0.1, -0.3];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1, -0.1, -0.3];
      fontSize = isPortrait ? 0.3 : 0.28;
      splatConfig = { scale: 1.0, position: [0, 0, 0] };
    } else {
      titlePosition = [-1.2, -0.1, 0.0];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1.2, -0.1, 0];
      fontSize = 0.35;
      splatConfig = { scale: 1.0, position: [0, 0, 0] };
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
      enabled={!hasOverlay}
      global={false}
      cursor={true}
      snap={false}
      speed={1}
      zoom={1}
      rotation={[0, 0, 0]}
      azimuth={[-Math.PI / 3, Math.PI / 3]}
      polar={[-Math.PI / 8, Math.PI / 3]}
      config={{ mass: 1, tension: 170, friction: 26 }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* SparkJS Splat - using full_scene.spz! */}
      <SparkSplat
        position={deviceConfigExact.splatConfig.position}
        scale={deviceConfigExact.splatConfig.scale}
        onSplatLoaded={onSplatLoaded}
      />

      {/* Text overlay - only show on main screen */}
      {!hasOverlay && (
        <>
          <AnimatedText
            position={deviceConfigExact.titlePosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.3}
            initialLoadComplete={initialLoadComplete}
          >
            DOUG'S
          </AnimatedText>
          <AnimatedText
            position={deviceConfigExact.foundPosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.5}
            initialLoadComplete={initialLoadComplete}
          >
            Found
          </AnimatedText>
          <AnimatedText
            position={deviceConfigExact.woodPosition}
            fontSize={deviceConfigExact.fontSize}
            delay={0.7}
            initialLoadComplete={initialLoadComplete}
          >
            Wood
          </AnimatedText>
        </>
      )}
    </PresentationControls>
  );
}

// Main NewExperience Component
export default function NewExperience({
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
        position: [0, 1.6, 3.5],
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
        antialias: true, // Better quality with SparkJS
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
