import './gallery.css';
import doubleChair from '../../src/assets/gallery/real_double_chair.jpg';
import highChair from '../../src/assets/gallery/cropped/real_high_chair.jpg';
import picnicTable from '../../src/assets/gallery/cropped/real_picnic_table.jpg';
import tableA from '../../src/assets/gallery/real_tableA.jpg';
import hobbit_house from '../../src/assets/gallery/cropped/hobbit_house.jpg';
import doubleChairB from '../../src/assets/gallery/new/double_seat.jpg';
import doubleChairNoBG from '../../src/assets/gallery/new/double_chair_noBG.png';

import { useState } from 'react';

const images = [
  doubleChair,
  highChair,
  picnicTable,
  tableA,
  hobbit_house,
  doubleChairB,
  doubleChairNoBG,
];

export default function Gallery() {
  const [currentPhoto, setCurrentPhoto] = useState(-1);

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
    <div className="galleryContainer">
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
