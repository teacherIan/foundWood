import './gallery.css';
import imgData from './imgData';
import { useState, useEffect } from 'react';

const images = [
  imgData[0].img,
  imgData[1].img,
  imgData[2].img,
  imgData[3].img,
  imgData[4].img,
  imgData[5].img,
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
            <div style={{ color: 'red' }}>
              DevNum: {imgData[currentPhoto].orderNumber}
            </div>
            {imgData[currentPhoto].name}
            <br />
            {imgData[currentPhoto].description}
            <br />
            Price: {imgData[currentPhoto].price}
            <br />
            Please Contact us for more information
          </div>
        </>
      </div>
      <div className="currentPhoto">
        <img className="masterImage" src={images[currentPhoto]} />
      </div>
    </div>
  );
}