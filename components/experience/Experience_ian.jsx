import {Splat} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

export default function Experience_ian(props) {
  return (
    <Canvas {...props} camera={{ position: [0, 0, 5], fov: 45 }} style={{ height: '100vh', width: '100vw' }}>
        <Splat
        src="/public/assets/experience/fixed_model_new.splat"
    />

    </Canvas>
  );
}

