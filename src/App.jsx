import Fixture from '../components/Fixture';
import Lights from '../components/Lights';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import { OrbitControls } from '@react-three/drei';
import plantStandA from '/3d/plantStandAFixed.glb?url';
import chairA from '/3d/chairA.glb?url';
import chairC from '/3d/chairC.glb?url';
import plantStandB from '/3d/tableACompact.glb?url';
import found_wood from '/found_wood_icon.png?url';
import Contact from '../components/Contact';
import Gallery from '../components/Gallery';
import Types from '../components/Types';

function App() {
  const [showTypes, setShowTypes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [counter, setCounter] = useState(0);
  const controls = useRef();

  function add() {
    setCounter(counter + 1);
  }

  function subtract() {
    setCounter(counter - 1);
  }

  function handleGalleryClick() {
    console.log('Gallery Clicked');
    setShowTypes(!showTypes);
  }

  return (
    <>
      <Types showTypes={showTypes} setShowTypes={setShowTypes} />
      {showGallery ? (
        <Gallery />
      ) : (
        <div
          className="appContainer"
          style={
            showTypes ? { filter: 'blur(700px)' } : { filter: 'blur(0px)' }
          }
        >
          <div className="infoGraphic">
            Unique Handcrafted Furniture
            <br />
            Beautiful yet Functional
          </div>
          <Contact
            showContactPage={showContactPage}
            setShowContactPage={setShowContactPage}
          />
          <div className="header">
            <div className="menu">
              <img src={found_wood} className="icon"></img>
              <div
                className="menu-item"
                // onClick={() => setShowGallery(!showGallery)}
                onClick={() => handleGalleryClick()}
              >
                Gallery
              </div>
              <div className="menu-item">Mission</div>

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
            <Fixture
              fixtureNumber={3}
              counter={counter}
              setCounter={setCounter}
              scale={5}
              offset={1.1}
              model={plantStandB}
            />
          </Canvas>
          <div className="selectButton right" onClick={() => add()}>
            <AiFillCaretRight className="arrow" />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
