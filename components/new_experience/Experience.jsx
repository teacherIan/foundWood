import { useEffect, useState, useRef } from 'react';
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

function Scene({ isAnimating, showContactPage }) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { progress } = useProgress();
  const animationRef = useRef();
  const { camera } = useThree();
  const idleTimeRef = useRef(0);

  useFrame((state, delta) => {
    idleTimeRef.current += delta;

    // Oscillate camera position or rotation slowly
    const idleX = Math.sin(idleTimeRef.current * 0.5) * 0.01; // Side to side
    const idleY = Math.sin(idleTimeRef.current * 1) * 0.005; // Slight up/down

    // Option 1: Move camera position gently around initial position
    camera.position.x = idleX;
    camera.position.y = 1 + idleY;
    camera.position.z = 2.2;

    // Option 2: Or rotate camera slightly (uncomment if preferred)
    camera.rotation.y = idleX * 0.02;
    // camera.rotation.x = idleY * 0.01;

    camera.updateProjectionMatrix();
  });

  // Handle resize once and store window width in state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setTargetX(width > 1000 ? -1.5 : 0);

      // Update camera position based on screen size
      if (camera) {
        if (width < 480) {
          // Mobile phone specific settings
          camera.position.set(0, 1, 2); // Set camera further back for mobile
          camera.fov = 60; // Wider field of view for mobile
        } else if (width < 1300) {
          // Tablet and small screens
          camera.position.set(0, 1, 2.5);
          camera.fov = 60;
        } else {
          // Desktop
          camera.position.set(0, 0.5, 2.2);
          camera.fov = 50;
        }
        camera.updateProjectionMatrix();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  // More efficient animation using useRef and delta time
  useEffect(() => {
    let startTime = null;
    let loadProgress = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Scale animation speed based on elapsed time for smoother animation
      const delta = Math.min(0.01, (elapsed / 1000) * 0.5);
      loadProgress = Math.min(loadProgress + delta, 1);

      if (loadProgress < 1 && isAnimating) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Determine text positions and size based on window width
  const isMobile = windowWidth < 480;
  const isTablet = windowWidth >= 480 && windowWidth < 1300;
  const isDesktop = windowWidth >= 1300;

  // Text positions based on device size
  let titlePosition, foundPosition, woodPosition, fontSize;

  if (isMobile) {
    titlePosition = [0, -0.065, 0];
    foundPosition = [0, -0.07, 0.4];
    woodPosition = [0, -0.07, 0.7];
    fontSize = 0.25;
  } else if (isTablet) {
    titlePosition = [0, -0.1, 0.5];
    foundPosition = [0, -0.08, 0.93];
    woodPosition = [0, -0.07, 1.25];
    fontSize = 0.27;
  } else {
    titlePosition = [-1, -0.12, 0];
    foundPosition = [0, -0.1, 0.6];
    woodPosition = [1, -0.15, 0];
    fontSize = 0.3;
  }

  return (
    <PresentationControls
      makeDefault
      enabled={!showContactPage}
      global
      snap
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]} // Increased range for mobile
      azimuth={[-Math.PI / 3, Math.PI / 3]} // Increased range for mobile
      config={{
        mass: isMobile ? 5 : 10,
        tension: 100,
        friction: isMobile ? 15 : 20,
      }}
      speed={isMobile ? 1.5 : 2}
    >
      {isAnimating && (
        <>
          <Text
            position={titlePosition}
            color="white"
            anchorX="center"
            anchorY="middle"
            strokeColor="white"
            font={driftwood}
            fontSize={fontSize}
          >
            DOUG'S
          </Text>
          <Text
            position={foundPosition}
            color="white"
            anchorX="center"
            anchorY="middle"
            strokeColor="white"
            font={driftwood}
            fontSize={fontSize}
          >
            Found
          </Text>
          <Text
            position={woodPosition}
            color="white"
            anchorX="center"
            anchorY="middle"
            strokeColor="white"
            font={driftwood}
            fontSize={fontSize}
          >
            Wood
          </Text>
          <Splat
            alphaTest={0.3}
            alphaHashing={true}
            chunkSize={0.01}
            src={splat}
            splatSize={isMobile ? 40 : isTablet ? 35 : 30}
            scale={isMobile ? 0.8 : 1} // Scale down splat for mobile
            position={isMobile ? [0, 0, -0.5] : [0, 0, 0]} // Adjust position for mobile
          />
        </>
      )}
    </PresentationControls>
  );
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
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        depth: true,
        stencil: true,
      }}
    >
      <Scene showContactPage={showContactPage} isAnimating={isAnimating} />
    </Canvas>
  );
}
