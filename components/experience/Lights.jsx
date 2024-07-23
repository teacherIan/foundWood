export default function Lights() {
  const lightIntensity = 50;
  return (
    <>
      <ambientLight intensity={3} />
      <pointLight
        position={[-5, 10, 20]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight
        position={[-20, 10, -5]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight
        position={[20, 10, -5]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight
        position={[5, 20, 15]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight position={[2, 20, 2]} intensity={lightIntensity} castShadow />
    </>
  );
}
