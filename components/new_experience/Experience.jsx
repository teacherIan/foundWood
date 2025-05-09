import { useEffect, useRef, useState } from 'react';
import { OrbitControls, Splat } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import './experienceStyles.css';
import splat from '../../src/assets/new_experience/full.splat';

function Scene({ isAnimating, showContactPage }) {
  const [targetX, setTargetX] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const controlsRef = useRef();

  useEffect(() => {
    console.log('Show contact page changed');
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !showContactPage;
      controlsRef.current.update();
    }
  }, [showContactPage]);

  useFrame((_, delta) => {
    controlsRef.current?.update();

    // Animate the loading progress
    if (isAnimating && loadProgress < 1) {
      setLoadProgress((prev) => Math.min(prev + delta * 0.5, 1));
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setTargetX(window.innerWidth > 1000 ? -1.5 : 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        autoRotate={!showContactPage}
        autoRotateSpeed={1}
        target={[targetX, 0, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        maxDistance={8}
        minDistance={2}
      />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {isAnimating && (
        <Splat
          chunkSize={1} // Reduced chunk size for slower parsing
          position={[0, -1 * (1 - loadProgress), 0]} // Vertical reveal
          scale={loadProgress * 1.7} // Animated scale
          opacity={loadProgress} // Fade-in effect
          src={splat}
        />
      )}
    </>
  );
}

export default function App({ isAnimating, showContactPage }) {
  return (
    <Canvas camera={{ position: [1, 2, 2] }}>
      <Scene showContactPage={showContactPage} isAnimating={isAnimating} />
    </Canvas>
  );
}
