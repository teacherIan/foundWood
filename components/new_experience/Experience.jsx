import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import {
  Splat,
  Text,
  PresentationControls,
  useProgress,
} from '@react-three/drei';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import './experienceStyles.css';
import splat from '../../src/assets/new_experience/full.splat';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';

// Memoized Text component for better performance
const MemoizedText = memo(({ position, children, fontSize }) => (
  <Text
    position={position}
    color="white"
    anchorX="center"
    anchorY="middle"
    strokeColor="white"
    font={driftwood}
    fontSize={fontSize}
  >
    {children}
  </Text>
));

function Scene({ isAnimating, showContactPage }) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { progress } = useProgress();
  const animationRef = useRef();
  const { camera } = useThree();
  const idleTimeRef = useRef(0);

  // Memoized camera animation frame
  const animateCamera = useCallback((state, delta) => {
    idleTimeRef.current += delta;

    const idleX = Math.sin(idleTimeRef.current * 0.7) * 0.01;
    const idleY = Math.sin(idleTimeRef.current * 1.2) * 0.005;

    camera.position.x = idleX;
    camera.position.y = 1 + idleY;
    camera.position.z = 2.2;
    camera.rotation.y = idleX * 0.02;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(animateCamera);

  // Memoized resize handler
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setTargetX(width > 1000 ? -1.5 : 0);

    if (camera) {
      if (width < 480) {
        camera.position.set(0, 1, 2);
        camera.fov = 60;
      } else if (width < 1300) {
        camera.position.set(0, 1, 2.5);
        camera.fov = 60;
      } else {
        camera.position.set(0, 0.5, 2.2);
        camera.fov = 50;
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

  // Memoized device size calculations
  const deviceConfig = useMemo(() => {
    const isMobile = windowWidth < 480;
    const isTablet = windowWidth >= 480 && windowWidth < 1300;
    const isDesktop = windowWidth >= 1300;

    let titlePosition, foundPosition, woodPosition, fontSize, splatConfig;

    if (isMobile) {
      titlePosition = [0, -0.065, 0];
      foundPosition = [0, -0.07, 0.4];
      woodPosition = [0, -0.07, 0.7];
      fontSize = 0.25;
      splatConfig = {
        size: 40,
        scale: 0.8,
        position: [0, 0, -0.5],
      };
    } else if (isTablet) {
      titlePosition = [0, -0.1, 0.5];
      foundPosition = [0, -0.08, 0.93];
      woodPosition = [0, -0.07, 1.25];
      fontSize = 0.27;
      splatConfig = {
        size: 35,
        scale: 1,
        position: [0, 0, 0],
      };
    } else {
      titlePosition = [-1, -0.12, 0];
      foundPosition = [0, -0.1, 0.6];
      woodPosition = [1, -0.15, 0];
      fontSize = 0.3;
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
      isMobile,
      isTablet,
      isDesktop,
    };
  }, [windowWidth]);

  // Memoized presentation controls config
  const presentationConfig = useMemo(() => ({
    mass: deviceConfig.isMobile ? 5 : 10,
    tension: 100,
    friction: deviceConfig.isMobile ? 15 : 20,
    speed: deviceConfig.isMobile ? 1.5 : 2,
  }), [deviceConfig.isMobile]);

  return (
    <PresentationControls
      makeDefault
      enabled={!showContactPage}
      global
      snap
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 3, Math.PI / 3]}
      config={presentationConfig}
    >
      {isAnimating && (
        <>
          <MemoizedText
            position={deviceConfig.titlePosition}
            fontSize={deviceConfig.fontSize}
          >
            DOUG'S
          </MemoizedText>
          <MemoizedText
            position={deviceConfig.foundPosition}
            fontSize={deviceConfig.fontSize}
          >
            Found
          </MemoizedText>
          <MemoizedText
            position={deviceConfig.woodPosition}
            fontSize={deviceConfig.fontSize}
          >
            Wood
          </MemoizedText>
          <Splat
            alphaTest={0.3}
            alphaHashing={true}
            chunkSize={0.01}
            src={splat}
            splatSize={deviceConfig.splatConfig.size}
            scale={deviceConfig.splatConfig.scale}
            position={deviceConfig.splatConfig.position}
          />
        </>
      )}
    </PresentationControls>
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

export default function App({ isAnimating, showContactPage }) {
  return (
    <Canvas
      camera={{
        position: [0, 0.5, 2.2],
        fov: 50,
      }}
      dpr={[1, 2]}
      performance={{ min: 0.4 }}
      style={{
        background: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        depth: true,
        stencil: true,
        alpha: true,
        premultipliedAlpha: true,
        clearColor: [0xf5f5f5, 0xf5f5f5, 0xf5f5f5, 1],
      }}
    >
      <Scene showContactPage={showContactPage} isAnimating={isAnimating} />
    </Canvas>
  );
}
