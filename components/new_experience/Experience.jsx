import './experienceStyles.css';
import { OrbitControls, Splat, Box } from '@react-three/drei';
import splat from '../../src/assets/new_experience/full.splat';
import { Canvas, useFrame } from '@react-three/fiber';

function App({ isAnimating }) {
  return (
    <Canvas camera={{ position: [1, 2, 2] }}>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={1}
        target={[window.innerWidth > 1000 ? -1 : 0, 0, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        maxDistance={7}
        minDistance={2}
      />

      {isAnimating && (
        <Splat chunkSize={16} position={[0, 0, 0]} scale={2} src={splat} />
      )}
    </Canvas>
  );
}

export default App;
