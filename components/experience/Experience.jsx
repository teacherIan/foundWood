import Fixture from './Fixture';
import Lights from './Lights';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import plantStandA from '../../src/assets/3d/plantStandAFixed.glb';
import chairA from '../../src/assets/3d/chairA.glb';
import chairC from '../../src/assets/3d/chairC.glb';
import plantStandB from '../../src/assets/3d/tableACompact.glb';
import coffeeTableA from '../../src/assets/3d/coffee_table_A.glb';
import plantStandNew from '../../src/assets/3d/coffee_table_b.glb';
import plantStandC from '../../src/assets/3d/plant_stand_c.glb';

export default function Experience({ counter, setCounter }) {
  return (
    <Canvas
      style={{ width: '100%', height: '100vh' }}
      camera={{ position: [0, 5, 5] }}
    >
      <OrbitControls
        makeDefault
        autoRotate
        minDistance={7}
        maxDistance={15}
        minPolarAngle={Math.PI / 6} // 45 degrees
        maxPolarAngle={Math.PI / 3} // 90 degrees
      />
      <Lights />
      <Fixture
        fixtureNumber={0}
        counter={counter}
        setCounter={setCounter}
        scale={7.5}
        offset={0.5}
        model={plantStandC}
      />
      <Fixture
        fixtureNumber={1}
        counter={counter}
        setCounter={setCounter}
        scale={7}
        offset={4}
        model={coffeeTableA}
      />
    </Canvas>
  );
}
