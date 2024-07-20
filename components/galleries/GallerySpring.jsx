import './gallery.css';
import imgData from './imgData';
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

const images = imgData;

export default function Gallery({
  showGallery,
  galleryType,
  showGalleryString,
}) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [galleryTypeArr, setGalleryTypeArr] = useState([]);

  useEffect(() => {
    const newGalleryTypeArr = images.filter(
      (image) => image.type === showGalleryString
    );
    setGalleryTypeArr(newGalleryTypeArr);
  }, [galleryType]);

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
          {galleryTypeArr.map((image, index) => (
            <img key={index} src={image.img} className="thumbNailPhoto" />
          ))}
        </div>
        <>
          <div className="galleryLeftBottom">
            <div className="furnitureName">
              {galleryTypeArr[currentPhoto]?.name}
            </div>
            <br />
            <div className="furnitureDescription">
              {galleryTypeArr[currentPhoto]?.description}
            </div>
            <br />
            <br />
            <div className="furniturePrice">
              Price: {galleryTypeArr[currentPhoto]?.price}
            </div>

            <br />
          </div>
        </>
      </div>
      <div className="currentPhoto">
        {galleryTypeArr.length > 0 && (
          <animated.img
            style={{ ...spring }}
            className="masterImage"
            src={
              galleryTypeArr[currentPhoto]?.img
                ? galleryTypeArr[currentPhoto]?.img
                : galleryTypeArr[0]
            }
          />
        )}
      </div>
    </div>
  );
}
