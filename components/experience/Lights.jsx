export default function Lights() {
  const lightIntensity = 0;
  return (
    <>
      <ambientLight intensity={9} />
      <pointLight position={[5, 10, 5]} intensity={lightIntensity} castShadow />
      <pointLight
        position={[-5, 10, -5]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight position={[0, 10, 0]} intensity={lightIntensity} castShadow />
      <pointLight position={[5, 1, 5]} intensity={lightIntensity} castShadow />
      <pointLight position={[0, 1, 5]} intensity={lightIntensity} castShadow />
    </>
  );
}
