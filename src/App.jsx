import './App.css';
import { useState, useRef, useCallback, useEffect } from 'react';
import { AiFillCaretRight } from 'react-icons/ai';
import { AiFillCaretLeft } from 'react-icons/ai';
import found_wood from './assets/found_wood_icon.png';
import Contact from '../components/contact/Contact';
import GallerySpring from '../components/galleries/GallerySpring';
import Types from '../components/select_gallery/Types';
import Canvas from '../components/experience/Experience';
import Mission from '../components/mission/Mission';
import NewCanvas from '../components/new_experience/Experience';

function App() {
  const amtFixtures = 3;

  const types = {
    chairs: 'chairs',
    smallTable: 'smallTable',
    largeTable: 'largeTable',
    structure: 'structure',
    other: 'other',
  };

  const typeArray = [
    'chairs',
    'smallTable',
    'largeTable',
    'structure',
    'other',
  ];

  const [activeGalleryTypeString, setActiveGalleryTypeString] =
    useState('chairs');
  const [activeGalleryType, setActiveGalleryType] = useState(1);
  const [showMission, setShowMission] = useState(false);
  const [showTypes, setShowTypes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showContactPage, setShowContactPage] = useState(false);
  const [counter, setCounter] = useState(-1);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const c = setTimeout(() => {
      setCounter(0);
    }, 200);

    return () => {
      clearInterval(c);
    };
  }, []);

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
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
    showTypes ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showTypes]);

  const handleMissionButtonClickCallback = useCallback(() => {
    setShowTypes(false);
    setShowMission(!showMission);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);

    showMission ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showMission]);

  const handleGalleryButtonClickCallback = useCallback(() => {
    setShowTypes(false);
    setShowMission(false);
    setShowGallery(true);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
    showGallery ? setCounter(0) : setCounter(-1);
  }, [setShowTypes, setShowGallery, setShowMission, showGallery]);

  function handleEmblemClick() {
    setShowTypes(false);
    setShowMission(false);
    setShowGallery(false);
    setTimeout(() => {
      setShowDetails(false);
    }, 1000);
    setCounter(0);
  }

  return (
    <>
      <Mission showMission={showMission} />
      <GallerySpring
        galleryType={activeGalleryType}
        showGallery={showGallery}
        showGalleryString={activeGalleryTypeString}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
      />
      <Types
        showTypes={showTypes}
        onGalleryTypesClick={handleGalleryTypesClickCallback}
        onMissionButtonClick={handleMissionButtonClickCallback}
        onTypeSelect={handleGalleryButtonClickCallback}
        setActiveGalleryType={setActiveGalleryType}
        setActiveGalleryTypeString={setActiveGalleryTypeString}
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
            counter == -1
              ? { bottom: '-25%', opacity: 0 }
              : window.innerHeight < 1000
              ? { bottom: '5%', opacity: 1 }
              : { bottom: '0%', opacity: 1 }
          }
        >
          Unique Handcrafted Furniture
          <br />
          Beautiful yet Functional
        </div>
        <div className="blur">
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
          {/* <Canvas counter={counter} setCounter={setCounter} /> */}
          <NewCanvas />

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
