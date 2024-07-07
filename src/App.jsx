import Fixture from '../components/experience/Fixture';
import Lights from '../components/experience/Lights';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import { OrbitControls } from '@react-three/drei';
import plantStandA from './assets/3d/plantStandAFixed.glb';
import chairA from './assets/3d/chairA.glb';
import chairC from './assets/3d/chairC.glb';
import plantStandB from './assets/3d/tableACompact.glb';
import found_wood from './assets/found_wood_icon.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import Types from '../components/select_gallery/Types';

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
          // style={
          //   showTypes ? { filter: 'blur(200px)' } : { filter: 'blur(0px)' }
          // }
        >
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
          <div
            className="infoGraphic"
            style={
              showTypes ? { filter: 'blur(700px)' } : { filter: 'blur(0px)' }
            }
          >
            Unique Handcrafted Furniture
            <br />
            Beautiful yet Functional
          </div>
          <div
            className="blur"
            style={
              showTypes ? { filter: 'blur(700px)' } : { filter: 'blur(0px)' }
            }
          >
            <div className="selectButton" onClick={() => subtract()}>
              <AiFillCaretLeft className="arrow" />
            </div>
            <Canvas camera={{ position: [0, 5, 7] }}>
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
            <div className="selectButton right" onClick={() => add()}>
              <AiFillCaretRight className="arrow" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
