import './App.css';
import { useState, useRef } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import found_wood from './assets/found_wood_icon.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import Types from '../components/select_gallery/Types';
import Canvas from '../components/experience/Experience';
import Mission from '../components/mission/Mission';

function App() {
  const amtFixtures = 4;

  const [showMission, setShowMission] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [counter, setCounter] = useState(0);

  function add() {
    if (counter < amtFixtures - 1) {
      setCounter(counter + 1);
    }
  }

  function subtract() {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  }

  function handleGalleryClick() {
    setShowTypes(!showTypes);
    setShowMission(false);
  }

  function handleMissionButtonClick() {
    setShowTypes(false);
    setShowMission(!showMission);
  }

  function handleEmblemClick() {
    setShowMission(false);
    setShowTypes(false);
  }

  return (
    <>
      <Mission showMission={showMission} />

      <Types showTypes={showTypes} setShowTypes={setShowTypes} />
      <div className="appContainer">
        <Contact
          showContactPage={showContactPage}
          setShowContactPage={setShowContactPage}
        />
        <div className="header">
          <div className="menu">
            <img
              onClick={() => handleEmblemClick()}
              src={found_wood}
              className="icon"
            ></img>
            <div className="menu-item" onClick={() => handleGalleryClick()}>
              Gallery
            </div>
            <div
              onClick={() => handleMissionButtonClick()}
              className="menu-item"
            >
              Mission
            </div>
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
            showTypes || showMission
              ? { filter: 'blur(700px)' }
              : { filter: 'blur(0px)' }
          }
        >
          Unique Handcrafted Furniture
          <br />
          Beautiful yet Functional
        </div>
        <div
          className="blur"
          style={
            showTypes || showMission
              ? { filter: 'blur(700px)' }
              : { filter: 'blur(0px)' }
          }
        >
          <div className="selectButton" onClick={() => subtract()}>
            <AiFillCaretLeft
              className="arrow"
              style={counter > 0 ? { opacity: 1 } : { opacity: 0.5 }}
            />
          </div>
          <Canvas counter={counter} setCounter={setCounter} />
          <div className="selectButton right" onClick={() => add()}>
            <AiFillCaretRight
              className="arrow"
              style={
                counter >= amtFixtures - 1 ? { opacity: 0.5 } : { opacity: 1 }
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
