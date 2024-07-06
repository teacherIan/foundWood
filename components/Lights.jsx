export default function Lights() {
  return (
    <>
      <ambientLight intensity={3} />
      <pointLight position={[5, 10, 5]} intensity={100} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={100} castShadow />
      <pointLight position={[0, 10, 0]} intensity={100} castShadow />
      <pointLight position={[5, 1, 5]} intensity={100} castShadow />
      <pointLight position={[0, 1, 5]} intensity={100} castShadow />
      <pointLight
        position={[3, 1, 1]}
        intensity={100}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight
        position={[-5, 5, 5]}
        intensity={100}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}
