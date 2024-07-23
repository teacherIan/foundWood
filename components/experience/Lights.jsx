export default function Lights() {
  const lightIntensity = 60;
  return (
    <>
      <ambientLight intensity={5} />
      <pointLight
        position={[-15, 10, 20]}
        intensity={lightIntensity}
        castShadow
      />
      {/* <pointLight position={[3, 1, 3]} intensity={lightIntensity} castShadow /> */}
      <pointLight
        position={[20, 10, -15]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight
        position={[5, 10, 15]}
        intensity={lightIntensity}
        castShadow
      />
      <pointLight
        position={[12, 5, 12]}
        intensity={lightIntensity}
        castShadow
      />
    </>
  );
}
