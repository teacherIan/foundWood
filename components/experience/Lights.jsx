export default function Lights() {
  const lightIntensity = 50;
  return (
    <>
      <ambientLight intensity={5} />
      <pointLight position={[5, 10, 5]} intensity={lightIntensity} castShadow />
      <pointLight
        position={[-5, 10, -5]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight position={[0, 10, 0]} intensity={lightIntensity} castShadow />
      <pointLight position={[5, 20, 5]} intensity={lightIntensity} castShadow />
      <pointLight position={[0, 20, 5]} intensity={lightIntensity} castShadow />
    </>
  );
}
