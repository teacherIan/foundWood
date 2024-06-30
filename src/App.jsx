import Fixture from '../components/Fixture';
import Lights from '../components/Lights';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import { OrbitControls } from '@react-three/drei';
import plantStandA from '/plantStandAFixed.glb?url';
import chairA from '/chairA.glb?url';
import chairC from '/chairC.glb?url';
import found_wood from '/found_wood_icon.png?url';
import Contact from '../components/Contact';

function App() {
  const [showContactPage, setShowContactPage] = useState(false);
  const [counter, setCounter] = useState(0);
  const controls = useRef();

  function add() {
    setCounter(counter + 1);
  }

  function subtract() {
    setCounter(counter - 1);
  }

  return (
    <>
      <Contact
        showContactPage={showContactPage}
        setShowContactPage={setShowContactPage}
      />
      <div className="header">
        <div className="menu">
          <img src={found_wood} className="icon"></img>
          <div className="menu-item">Gallery</div>
          <div className="menu-item">Mission</div>
          <div className="menu-item">Showroom</div>
          <div
            onClick={() => setShowContactPage(!showContactPage)}
            className="menu-item"
          >
            Contact
          </div>
        </div>
      </div>
      <div className="selectButton" onClick={() => subtract()}>
        <AiFillCaretLeft className="arrow" />
      </div>
      <Canvas camera={{ position: [2, 6, 12] }}>
        <OrbitControls makeDefault ref={controls} autoRotate />
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
          offset={1.1}
          model={chairA}
        />
        <Fixture
          fixtureNumber={2}
          counter={counter}
          setCounter={setCounter}
          scale={4}
          offset={1.1}
          model={chairC}
        />
      </Canvas>
      <div className="selectButton right" onClick={() => add()}>
        <AiFillCaretRight className="arrow" />
      </div>
    </>
  );
}

export default App;
