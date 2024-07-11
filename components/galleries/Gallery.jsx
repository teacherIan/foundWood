import './gallery.css';
import imgData from './imgData';
import { useState, useEffect } from 'react';

const images = [
  imgData[1].img,
  imgData[2].img,
  imgData[3].img,
  imgData[4].img,
  imgData[5].img,
  // imgData[6].img,
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
          ? { width: '100svw', height: '100svh', opacity: 1 }
          : { width: '0svw', height: '0svh', opacity: 0 }
      }
    >
      <div className="thumbNails" onMouseOver={handleThumbNailHover}>
        {images.map((image, index) => (
          <img src={image} key={index} className="thumbNailPhoto" />
        ))}
      </div>
      <div className="currentPhoto">
        <img className="masterImage" src={images[currentPhoto]} />
      </div>
    </div>
  );
}
