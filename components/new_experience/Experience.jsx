import { useEffect, useRef, useState } from 'react';
import { OrbitControls, Splat, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import './experienceStyles.css';
import splat from '../../src/assets/new_experience/full.splat';
import driftwood from '../../src/assets/fonts/DriftWood-z8W4.ttf';
import customFont from '../../src/assets/fonts/bubble_font.otf';
import * as THREE from 'three';

function Scene({ isAnimating, showContactPage }) {
  const [targetX, setTargetX] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !showContactPage;
      controlsRef.current.update();
    }
  }, [showContactPage]);

  useFrame((_, delta) => {
    controlsRef.current?.update();
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
        dampingFactor={0.01}
        autoRotate={!showContactPage}
        autoRotateSpeed={0.1}
        target={[0, 0, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        maxDistance={8}
        minDistance={2}
      />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Text
        material={
          new THREE.MeshBasicMaterial({
            // side: THREE.DoubleSide,
            transparent: true,
            opacity: 1,

            // depthWrite: false, //
          })
        }
        position={[-1, -0.15, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
        strokeColor={'white'}
        font={driftwood}
        fontSize={0.3}
        // fontWeight={100}
      >
          DOUG'S
      </Text>

      <Text
        position={[0, -0.1, 0.7]}
        color="white"
        anchorX="center"
        anchorY="middle"
        strokeColor={'white'}
        font={driftwood}
        fontSize={0.3}
        fontWeight={100}
        // strokeWidth={0.0}
      >
        Found
      </Text>

      <Text
        position={[1, -0.15, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
        strokeColor={'white'}
        font={driftwood}
        fontSize={0.3}
        fontWeight={100}
        // strokeWidth={0.0}
      >
        Wood
      </Text>

      {isAnimating && (
        <Splat
          alphaTest={0.3}
          alphaHashing={true}
          chunkSize={0.01}
          // position={[0, -1 * (1 - loadProgress), 0]}
          // scale={loadProgress * 1.5}
          // opacity={loadProgress}
          src={splat}
        />
      )}
    </>
  );
}

export default function App({ isAnimating, showContactPage }) {
  return (
    <Canvas camera={{ position: [0, 1, 2] }}>
      <Scene showContactPage={showContactPage} isAnimating={isAnimating} />
    </Canvas>
  );
}
