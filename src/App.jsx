import './App.css';
import { useState, useRef, useCallback } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import found_wood from './assets/found_wood_icon.png';
import Contact from '../components/contact/Contact';
import Gallery from '../components/galleries/Gallery';
import GallerySpring from '../components/galleries/GallerySpring';
import Types from '../components/select_gallery/Types';
import Canvas from '../components/experience/Experience';
import Mission from '../components/mission/Mission';

function App() {
  const amtFixtures = 2;

  const [activeGalleryType, setActiveGalleryType] = useState(1);
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

  const handleGalleryTypesClickCallback = useCallback(() => {
    setShowTypes(!showTypes);
    setShowMission(false);
    setShowGallery(false);
    showTypes ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showTypes]);

  const handleMissionButtonClickCallback = useCallback(() => {
    setShowTypes(false);
    setShowMission(!showMission);
    setShowGallery(false);
    showMission ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showMission]);

  const handleGalleryButtonClickCallback = useCallback(() => {
    setShowTypes(false);
    setShowMission(false);
    setShowGallery(true);
    showGallery ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showGallery]);

  function handleEmblemClick() {
    setShowTypes(false);
    setShowMission(false);
    setShowGallery(false);
    setCounter(0);
  }

  return (
    <>
      <Mission showMission={showMission} />
      <GallerySpring
        galleryType={activeGalleryType}
        showGallery={showGallery}
      />
      <Types
        showTypes={showTypes}
        onGalleryTypesClick={handleGalleryTypesClickCallback}
        onMissionButtonClick={handleMissionButtonClickCallback}
        onTypeSelect={handleGalleryButtonClickCallback}
        setActiveGalleryType={setActiveGalleryType}
      />
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
            <div
              className="menu-item"
              onClick={() => handleGalleryTypesClickCallback()}
            >
              Gallery
            </div>
            {/* <div
              onClick={() => handleMissionButtonClickCallback()}
              className="menu-item"
            >
              Mission
            </div> */}
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
          // style={
          //   showTypes || showMission || showGallery
          //     ? { filter: 'blur(200px)', opacity: 0 }
          //     : { filter: 'blur(0px)', opacity: 1 }
          // }
          style={
            counter == -1
              ? { bottom: '-20%', opacity: 0 }
              : { bottom: '5%', opacity: 1 }
          }
        >
          Unique Handcrafted Furniture
          <br />
          Beautiful yet Functional
        </div>
        <div
          className="blur"
          // style={
          //   showTypes || showMission || showGallery
          //     ? { filter: 'blur(200px)', opacity: 0 }
          //     : { filter: 'blur(0px)', opacity: 1 }
          // }
        >
          <div className="selectButton" onClick={() => subtract()}>
            <AiFillCaretLeft
              className="arrow"
              style={
                counter > 0
                  ? { opacity: 1 }
                  : counter == -1
                  ? { opacity: 0 }
                  : { opacity: 0.5 }
              }
            />
          </div>
          <Canvas counter={counter} setCounter={setCounter} />
          <div className="selectButton right" onClick={() => add()}>
            <AiFillCaretRight
              className="arrow"
              style={
                counter >= amtFixtures - 1
                  ? { opacity: 0.5 }
                  : counter == -1
                  ? { opacity: 0 }
                  : { opacity: 1 }
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
