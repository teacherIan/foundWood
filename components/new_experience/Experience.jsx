import './experienceStyles.css';
import { OrbitControls, Splat, Box } from '@react-three/drei';
import splat from '../../src/assets/new_experience/my_splat.splat';
import { Canvas, useFrame } from '@react-three/fiber';
import { useState } from 'react';
function App({ isAnimating }) {
  return (
    <Canvas camera={{ position: [1, 2, 2] }}>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={1}
        target={[window.innerWidth > 1000 ? -1 : 0, 0, 0]}
      />

      {isAnimating && (
        <Splat
          chunkSize={16}
          position={[0, 0, 0]}
          scale={2}
          src={
            'https://huggingface.co/datasets/ianmalloy/test/resolve/main/full.splat?'
            //   splat
          }
        />
      )}
    </Canvas>
  );
}

export default App;
