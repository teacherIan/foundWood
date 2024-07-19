import { useSpring, animated, config } from '@react-spring/three';
import { useState, useEffect } from 'react';
import { useGLTF, Sky } from '@react-three/drei';

export default function Fixture({
  counter,
  fixtureNumber,
  model,
  scale,
  offset,
}) {
  const configAnimation = {
    mass: 3,
    tension: 100,
    friction: 70,
    precision: 0.0001,
  };

  const [springs, api] = useSpring(() => ({
    position: [0, 5, -0],
    config: configAnimation,
    scale: 0,
  }));

  const modelImport = useGLTF(model);

  useEffect(() => {
    const handleResize = () => {
      // Your code here will be executed on resize
      if (fixtureNumber === counter) {
        api.start({
          position: [0, -4.5 + offset, 0],
          config: configAnimation,
          scale: scale,
        });
      }

      if (fixtureNumber > counter) {
        api.start({
          position: [0, 60, 0],
          scale: 0,
          config: configAnimation,
        });
      }

      if (fixtureNumber < counter) {
        api.start({
          position: [0, -60, 0],
          scale: 0,
          config: configAnimation,
        });
      }
    };

    handleResize(); // Call the function initially

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [counter, window]);

  return (
    <>
      {/* <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
        // position={[0, 10, 0]}
      /> */}

      <animated.mesh receiveShadow position={[0, -3, 0]}>
        <boxGeometry args={[1000, 0.1, 1000]} />
        <shadowMaterial transparent opacity={0.09} />
      </animated.mesh>

      <animated.mesh
        position={springs.position}
        scale={springs.scale}
        castShadow
        geometry={modelImport.scene.children[0].geometry}
        material={modelImport.scene.children[0].material}
      />
    </>
  );
}
