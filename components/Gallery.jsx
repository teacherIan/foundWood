import './gallery.css';
import doubleChair from '/gallery/real_double_chair.jpg?url';
import highChair from '/gallery/cropped/real_high_chair.jpg?url';
import picnicTable from '/gallery/cropped/real_picnic_table.jpg?url';
import tableA from '/gallery/real_tableA.jpg?url';
import hobbit_house from '/gallery/cropped/hobbit_house.jpg?url';
import doubleChairB from '/gallery/new/double_seat.jpg?url';
import doubleChairNoBG from '/gallery/new/double_chair_noBG.png?url';
import Information from './information';

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
      <Information />
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
