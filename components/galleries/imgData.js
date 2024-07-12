import doubleChair from '../../src/assets/gallery/real_double_chair.jpg';
import highChair from '../../src/assets/gallery/cropped/real_high_chair.jpg';
import picnicTable from '../../src/assets/gallery/real_picnic_table_rotated.png';
import coffeeTable from '../../src/assets/gallery/real_tableA.jpg';
import hobbit_house from '../../src/assets/gallery/cropped/hobbit_house.jpg';
import gaudiChair from '../../src/assets/gallery/new/double_seat.jpg';

//this would be a bit cleaner with TS

const types = ['chairs', 'smallTable', 'largeTable', 'structure', 'other'];

export default [
  {
    orderNumber: '002',
    img: doubleChair,
    type: types[0],
    name: 'Adirondack Loveseat',
    description:
      'Like the Adirondack Chair this loveseat is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    debugInfo: '',
    price: '$2000',
  },
  {
    orderNumber: '003',
    img: highChair,
    type: types[0],
    name: 'High Chair',
    description: 'None',
    debugInfo: 'Need info written',
    price: '$2000',
  },
  {
    orderNumber: '004',
    img: picnicTable,
    type: types[2],
    name: 'Picnic Table',
    description: 'Some random description for 004',
    debugInfo: 'Need to add a description',
    price: '$3000',
  },
  {
    orderNumber: '005',
    img: coffeeTable,
    type: types[1],
    name: 'Coffee Table',
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    debugInfo: 'price?',
    price: '$1000',
  },
  {
    orderNumber: '006',
    img: hobbit_house,
    type: types[3],
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    debugInfo: 'Price?',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '007',
    img: gaudiChair,
    name: 'Gaudi Chair',
    types: types[0],
    description:
      'This double chair was inspired by the architect Gaudi. This chair allows each of the people sitting in it to have an intimate conversation since when sitting back, their heads are close enough so to be able to talk in whispers. The chair is done entirely in cedar with five coats of finish and mahogany plugs. ',
    debugInfo: 'Price?',
    price: '$2000',
  },
];
