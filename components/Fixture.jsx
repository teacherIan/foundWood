import { useSpring, animated, config } from '@react-spring/three';
import { useState, useEffect } from 'react';
import {
  useGLTF,
  ContactShadows,
  Stage,
  Backdrop,
  Sky,
} from '@react-three/drei';
import { MeshStandardMaterial } from 'three';

export default function Fixture({
  counter,
  fixtureNumber,
  model,
  scale,
  offset,
}) {
  const configAnimation = {
    mass: 2,
    tension: 70,
    friction: 100,
    precision: 0.0001,
  };

  const [springs, api] = useSpring(() => ({
    position: [0, 10, -0],
    config: configAnimation,
    scale: 0,
  }));

  const modelImport = useGLTF(model);
  console.log(modelImport.scene.children[0].material);

  useEffect(() => {
    if (fixtureNumber === counter) {
      console.log('Same');
      // Perform the action here
      api.start({
        position: [0, -4.5 + offset, 0],
        config: configAnimation,
        scale: scale,
      });
    }

    if (fixtureNumber > counter) {
      console.log('Greater');
      api.start({
        position: [0, 60, 0],
        scale: 0,
        config: configAnimation,
      });
    }

    if (fixtureNumber < counter) {
      console.log('Less');
      api.start({
        position: [0, -60, 0],
        scale: 0,
        config: configAnimation,
      });
    }
  }, [counter]);

  const material = new MeshStandardMaterial({
    color: 'white',
  });

  return (
    <>
      {/* <ContactShadows
        smooth
        position={[0, -1.3, 0]}
        opacity={0.5}
        scale={5}
        blur={10}
        far={2}
      /> */}

      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />

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
