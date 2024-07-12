import doubleChair from '../../src/assets/gallery/real_double_chair.jpg';
import highChair from '../../src/assets/gallery/cropped/real_high_chair.jpg';
import picnicTable from '../../src/assets/gallery/real_picnic_table_rotated.png';
import coffeeTable from '../../src/assets/gallery/real_tableA.jpg';
import hobbit_house from '../../src/assets/gallery/cropped/hobbit_house.jpg';
import gaudiChair from '../../src/assets/gallery/double_seat.png';
import coffeeTableStudio from '../../src/assets/gallery/coffeeTable_studio.jpeg';
import plantStand from '../../src/assets/gallery/plantStand.jpeg';
import door from '../../src/assets/gallery/pet_door.jpg';
import fort from '../../src/assets/gallery/fort_b.jpg';

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
    price: '$2000',
  },
  {
    orderNumber: '003',
    img: highChair,
    type: types[0],
    name: 'High Chair',
    description: 'Need High Chair Description',
    price: '$2000',
  },
  {
    orderNumber: '004',
    img: picnicTable,
    type: types[2],
    name: 'Picnic Table',
    description: 'Need Picnic Table description',
    price: '$3000',
  },
  {
    orderNumber: '005',
    img: coffeeTable,
    type: types[1],
    name: 'Coffee Table',
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },
  {
    orderNumber: '006',
    img: hobbit_house,
    type: types[3],
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '007',
    img: gaudiChair,
    name: 'Gaudi Chair',
    types: types[0],
    description:
      'This double chair was inspired by the architect Gaudi. This chair allows each of the people sitting in it to have an intimate conversation since when sitting back, their heads are close enough so to be able to talk in whispers. The chair is done entirely in cedar with five coats of finish and mahogany plugs. ',
    price: '$2000',
  },
  {
    orderNumber: '008',
    img: coffeeTableStudio,
    name: 'Coffee Table',
    types: types[1],
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },
  {
    orderNumber: '009',
    img: plantStand,
    name: 'End Table/Plant table',
    types: types[1],
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a white birch burl but cherry and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '010',
    img: door,
    name: 'Found Wood Door',
    types: types[4],
    description:
      'Exterior and interior doors have been created. In some cases new door frame are included so that nonrectangular doors are possible. Carvings, stained glass and contrasting wood colors can be added. In all cases, the rich wood finish appears in the wood rather than on it due to a hand rubbed application of the multiple coats.',
    price: '$1500',
  },
  {
    orderNumber: '011',
    img: fort,
    name: 'Fort',
    types: types[3],
    description:
      'This product will be built to the needs of the buyer. The one shown is the base unit and contains two platforms of different heights with an inclined ramp connecting them. Options include sunken stumps to walk on, slides, swings and a curved roof.',
    price: '$10,000 ~ $20,000',
  },
];
