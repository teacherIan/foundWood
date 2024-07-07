import Fixture from './Fixture';
import Lights from './Lights';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import plantStandA from '../../src/assets/3d/plantStandAFixed.glb';
import chairA from '../../src/assets/3d/chairA.glb';
import chairC from '../../src/assets/3d/chairC.glb';
import plantStandB from '../../src/assets/3d/tableACompact.glb';

export default function Experience({ counter, setCounter }) {
  return (
    <>
      <Canvas camera={{ position: [0, 5, 7] }}>
        <OrbitControls makeDefault autoRotate />
        <Lights />
        <Fixture
          fixtureNumber={0}
          counter={counter}
          setCounter={setCounter}
          scale={6}
          offset={0}
          model={plantStandA}
        />
        <Fixture
          fixtureNumber={1}
          counter={counter}
          setCounter={setCounter}
          scale={4}
          offset={3}
          model={chairA}
        />
        <Fixture
          fixtureNumber={2}
          counter={counter}
          setCounter={setCounter}
          scale={4}
          offset={2}
          model={chairC}
        />
        <Fixture
          fixtureNumber={3}
          counter={counter}
          setCounter={setCounter}
          scale={5}
          offset={2}
          model={plantStandB}
        />
      </Canvas>
    </>
  );
}
