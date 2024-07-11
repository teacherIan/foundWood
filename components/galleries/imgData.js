import doubleChair from '../../src/assets/gallery/real_double_chair.jpg';
import highChair from '../../src/assets/gallery/cropped/real_high_chair.jpg';
import picnicTable from '../../src/assets/gallery/cropped/real_picnic_table.jpg';
import tableA from '../../src/assets/gallery/real_tableA.jpg';
import hobbit_house from '../../src/assets/gallery/cropped/hobbit_house.jpg';
import doubleChairB from '../../src/assets/gallery/new/double_seat.jpg';

//this would be a bit cleaner with TS

const types = ['chairs', 'smallTable', 'largeTable', 'structure', 'other'];

export default [
  {
    orderNumber: '002',
    img: doubleChair,
    type: types[0],
  },
  {
    orderNumber: '003',
    img: highChair,
    type: types[0],
  },
  {
    orderNumber: '004',
    img: picnicTable,
    type: types[2],
  },
  {
    orderNumber: '005',
    img: tableA,
    type: types[1],
  },
  {
    orderNumber: '006',
    img: hobbit_house,
    type: types[3],
  },
  {
    orderNumber: '007',
    img: doubleChairB,
    types: types[0],
  },
];
