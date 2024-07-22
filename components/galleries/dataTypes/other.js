import door from '../../../src/assets/gallery/pet_door.jpg';
import dresser from '../../../src/assets/gallery/other/dresser.jpg';
import latch from '../../../src/assets/gallery/other/latch.jpg';
import lightA from '../../../src/assets/gallery/other/lightA.jpeg';

import types from './types';
export default [
  {
    orderNumber: '010',
    img: door,
    name: 'Found Wood Door',
    type: types.other,
    description:
      'Exterior and interior doors have been created. In some cases new door frame are included so that nonrectangular doors are possible. Carvings, stained glass and contrasting wood colors can be added. In all cases, the rich wood finish appears in the wood rather than on it due to a hand rubbed application of the multiple coats.',
    price: '$1500 ~ $3000',
  },
  {
    orderNumber: '016',
    img: dresser,
    name: 'Found Wood Dresser',
    type: types.other,
    description: 'Need Description',
    price: '$3000',
  },
  {
    orderNumber: '017',
    img: latch,
    name: 'Found Wood Latch',
    type: types.other,
    description: 'Need Description',
    price: '$300',
  },
  {
    orderNumber: '023',
    img: lightA,
    name: 'Light',
    type: types.other,
    description: 'Need Light description',
    price: '$500',
  },
];
