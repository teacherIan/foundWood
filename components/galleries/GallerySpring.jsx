import './gallery.css';
import imgData from './imgData';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const images = [
  imgData[0].img,
  imgData[1].img,
  imgData[2].img,
  imgData[3].img,
  imgData[4].img,
  imgData[5].img,
  imgData[6].img,
  imgData[7].img,
  imgData[8].img,
  imgData[9].img,
];

export default function Gallery({ showGallery }) {
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const handleThumbNailHover = (event) => {
    const index = Array.prototype.indexOf.call(
      event.target.parentNode.children,
      event.target
    );

    if (event.target.className == 'thumbNailPhoto') {
      setCurrentPhoto(index);
    }
  };

  const [spring, api] = useSpring(() => ({
    opacity: 1,
  }));

  return (
    <div
      className="galleryContainer"
      style={
        showGallery
          ? { width: '100svw', height: '100svh', opacity: 1, zIndex: 20000 }
          : { width: '100svw', height: '100svh', opacity: 0, zIndex: 0 }
      }
    >
      <div className="galleryLeftTop">
        <div className="thumbNails" onMouseOver={handleThumbNailHover}>
          {images.map((image, index) => (
            <img src={image} key={index} className="thumbNailPhoto" />
          ))}
        </div>
        <>
          <div className="galleryLeftBottom">
            <div className="furnitureName">{imgData[currentPhoto].name}</div>
            <br />
            {imgData[currentPhoto].description}
            <br />
            <br />
            <div className="furniturePrice">
              Price: {imgData[currentPhoto].price}
            </div>

            <br />
            <div className="galleryContact">Contact</div>
          </div>
        </>
      </div>
      <div className="currentPhoto">
        <animated.img
          style={{ ...spring }}
          className="masterImage"
          src={images[currentPhoto]}
        />
      </div>
    </div>
  );
}
