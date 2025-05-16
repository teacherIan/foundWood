import { useEffect, useState, useRef } from 'react';
import {
  Splat,
  Text,
  PresentationControls,
  useProgress,
} from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import './experienceStyles.css';
import splat from '../../src/assets/new_experience/full.splat';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';

function Scene({ isAnimating, showContactPage }) {
  const [targetX, setTargetX] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { progress } = useProgress();
  const animationRef = useRef();
  const { camera } = useThree();

  // Handle resize once and store window width in state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setTargetX(width > 1000 ? -1.5 : 0);

      // Update camera position based on screen size
      if (camera) {
        camera.position.set(0, width < 1300 ? 1 : 0.5, width < 1300 ? 2.2 : 2);
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

  // Determine text positions based on window width
  const isSmallScreen = windowWidth < 1300;
  const titlePosition = isSmallScreen ? [0, -0.15, 0.7] : [-1, -0.12, 0];
  const foundPosition = isSmallScreen ? [0, -0.1, 1] : [0, -0.1, 1];
  const woodPosition = isSmallScreen ? [0, -0.1, 1.25] : [1, -0.15, 0];

  return (
    <PresentationControls
      makeDefault
      enabled={!showContactPage}
      global
      snap
      rotation={[0, 0, 0]}
      polar={[-Math.PI / 50, Math.PI / 50]}
      azimuth={[-Math.PI / 50, Math.PI / 50]}
      config={{ mass: 10, tension: 100, friction: 20 }}
      speed={2}
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
            fontSize={0.3}
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
            fontSize={0.3}
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
            fontSize={0.3}
          >
            Wood
          </Text>
          <Splat
            alphaTest={0.2}
            alphaHashing={true}
            chunkSize={0.01}
            src={splat}
            splatSize={isSmallScreen ? 35 : 30}
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
        position: [0, 0.5, 2],
        fov: 50,
      }}
      dpr={[1, 2]} // Optimize for different pixel ratios
      performance={{ min: 0.5 }} // Performance optimization
    >
      <Scene showContactPage={showContactPage} isAnimating={isAnimating} />
    </Canvas>
  );
}
