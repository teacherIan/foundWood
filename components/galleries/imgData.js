import doubleChair from '../../src/assets/gallery/real_double_chair.jpg';
import captainChair from '../../src/assets/gallery/cropped/real_high_chair.jpg';
import kidsPicnicTable from '../../src/assets/gallery/real_picnic_table_rotated.png';
import coffeeTable from '../../src/assets/gallery/real_tableA.jpg';
import playSet from '../../src/assets/gallery/cropped/hobbit_house.jpg';
import gaudiChair from '../../src/assets/gallery/double_seat.png';
import coffeeTableStudio from '../../src/assets/gallery/coffeeTable_studio.jpeg';
import plantStand from '../../src/assets/gallery/plantStand.jpeg';
import door from '../../src/assets/gallery/pet_door.jpg';
import fort_b from '../../src/assets/gallery/fort_b.jpg';
import adult_picnic_table from '../../src/assets/gallery/large_tables/adult_picnic_table.jpg';
import glass_table from '../../src/assets/gallery/large_tables/small_table.jpg';
import hobbit_house_b from '../../src/assets/gallery/structures/hobbit_house.jpg';
import adirondack_chair_w_stool from '../../src/assets/gallery/chairs/chair_w_stool.jpg';
import dresser from '../../src/assets/gallery/other/dresser.jpg';
import latch from '../../src/assets/gallery/other/latch.jpg';
import outsideStorage from '../../src/assets/gallery/structures/outside_storage.jpeg';
import swingA from '../../src/assets/gallery/chairs/swing_a.jpg';
import hobbitHouseDark from '../../src/assets/gallery/structures/hobbit_house_dark.jpg';
import swingB from '../../src/assets/gallery/chairs/swingB.jpeg';
import swingC from '../../src/assets/gallery/chairs/swingC.jpeg';
import lightA from '../../src/assets/gallery/other/lightA.jpeg';
import plantStandCaryl from '../../src/assets/gallery/small_tables/plantStandD.jpeg';
import picnicTableC from '../../src/assets/gallery/large_tables/picnic_table_b.jpg';
import tree_house_steps from '../../src/assets/gallery/structures/tree_house_steps.jpg';
import tables from '../../src/assets/gallery/small_tables/tables.jpg';
import outside_adirondack_chair from '../../src/assets/gallery/chairs/Adirondack_chair.jpeg';
import new_hob from '../../src/assets/gallery/structures/new_hob_highRise.jpg';
import fort_w_child from '../../src/assets/gallery/structures/fort_w_child.png';
import swing_back from '../../src/assets/gallery/chairs/swing_back.jpg';
import love_seat from '../../src/assets/gallery/chairs/doubleChair.jpg';

//this would be a bit cleaner with TS --  enum

// const types = ['chairs', 'smallTable', 'largeTable', 'structure', 'other'];

const types = {
  chairs: 'chairs',
  smallTable: 'smallTable',
  largeTable: 'largeTable',
  structure: 'structure',
  other: 'other',
};

export default [
  {
    orderNumber: '002',
    img: doubleChair,
    type: types.chairs,
    arrayType: 0,
    name: 'Adirondack Loveseat',
    description:
      'Like the Adirondack Chair this loveseat is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
  {
    orderNumber: '003',
    img: captainChair,
    type: types.chairs,
    arrayType: 0,
    name: 'Captain Chair',
    description:
      'Like the Adirondack Chair, the Captain’s Chair is made with 5/4 Red Cedar slats, mahogany plugs, and white cedar slats. It is finished with multiple coats of Found Wood secret recipe varnish which is heated and rubbed to protect the chair from the elements.  This chair is raised, leading to superior views of the surrounding area.',
    price: '$2000',
  },
  {
    orderNumber: '004',
    img: kidsPicnicTable,
    type: types.largeTable,
    arrayType: 2,
    name: 'Kids Picnic Table',
    description: 'Need kids Picnic Table description',
    price: '$2500',
  },
  {
    orderNumber: '005',
    img: coffeeTable,
    type: types.largeTable,
    arrayType: 1,
    name: 'Coffee Table',
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },
  {
    orderNumber: '006',
    img: playSet,
    type: types.structure,
    arrayType: 3,
    name: 'Play Set',
    description:
      'The play sets have all varied with the needs of the families. They may contain two laddered lookouts,  each with portholes to spy on the other. Between them there can be a swing and a trapeze. Available also are a hobbit house style roof and a slide.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '007',
    img: gaudiChair,
    name: 'Gaudi Chair',
    types: types.chairs,
    arrayType: 0,
    description:
      'This double chair was inspired by the architect Gaudi. This chair allows each of the people sitting in it to have an intimate conversation since when sitting back, their heads are close enough so to be able to talk in whispers. The chair is done entirely in cedar with five coats of finish and mahogany plugs. ',
    price: '$2000',
  },
  {
    orderNumber: '008',
    img: coffeeTableStudio,
    name: 'Coffee Table',
    types: types.smallTable,
    arrayType: 1,
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },
  {
    orderNumber: '009',
    img: plantStand,
    name: 'End Table/Plant table',
    types: types.smallTable,
    arrayType: 1,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a white birch burl but cherry and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '010',
    img: door,
    name: 'Found Wood Door',
    types: types.other,
    arrayType: 4,
    description:
      'Exterior and interior doors have been created. In some cases new door frame are included so that nonrectangular doors are possible. Carvings, stained glass and contrasting wood colors can be added. In all cases, the rich wood finish appears in the wood rather than on it due to a hand rubbed application of the multiple coats.',
    price: '$1500 ~ $3000',
  },
  {
    orderNumber: '011',
    img: fort_b,
    name: 'Fort',
    types: types.structure,
    arrayType: 3,
    description:
      'This product will be built to the needs of the buyer. The one shown is the base unit and contains two platforms of different heights with an inclined ramp connecting them. Options include sunken stumps to walk on, slides, swings and a curved roof.',
    price: '$10,000 ~ $20,000',
  },
  {
    orderNumber: '012',
    img: adult_picnic_table,
    type: types.largeTable,
    arrayType: 2,
    name: 'Picnic Table',
    description: 'Need Picnic Table description',
    price: '$3000',
  },
  {
    orderNumber: '013',
    img: glass_table,
    type: types.smallTable,
    arrayType: 2,
    name: 'Glass Table',
    description: 'Glass Table',
    price: '$1500 - $3000',
  },
  {
    orderNumber: '014',
    img: adirondack_chair_w_stool,
    type: types.chairs,
    arrayType: 0,
    name: 'Adirondack Chair With Ottoman ',
    description:
      'This very comfortable chair has White Cedar uprights cut and shaped for lumbar support and 6/4" Cedar arms which are screwed together and covered with Mahogany plugs. This chair is made to last as four coats of spar varnish are heated into the wood. For those who will be using the chair indoors or in a more sheltered location, a different, less durable but richer finish will be used.',
    price: '$1400',
  },
  {
    orderNumber: '015',
    img: hobbit_house_b,
    type: types.structure,
    arrayType: 3,
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '016',
    img: dresser,
    name: 'Found Wood Dresser',
    types: types.other,
    arrayType: 4,
    description: 'Need Description',
    price: '$3000',
  },
  {
    orderNumber: '017',
    img: latch,
    name: 'Found Wood Latch',
    types: types.other,
    arrayType: 4,
    description: 'Need Description',
    price: '$300',
  },
  {
    orderNumber: '018',
    img: outsideStorage,
    name: 'Outdoor Storage',
    types: types.structure,
    arrayType: 3,
    description:
      'Outdoor storage units can be constructed using various types of wood and shapes designed to match the surrounding area or buildings. The storage units are finished with the patented FoundWood finish which protects the wood from the elements.',
    price: '$3000',
  },
  {
    orderNumber: '019',
    img: swingA,
    type: types.chairs,
    arrayType: 0,
    name: 'Found Wood Swing',
    description:
      'Like the Adirondack Chair, the Found Wood Swing is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
  {
    orderNumber: '020',
    img: hobbitHouseDark,
    type: types.structure,
    arrayType: 3,
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '021',
    img: swingB,
    type: types.chairs,
    arrayType: 0,
    name: 'Found Wood Swing',
    description:
      'Like the Adirondack Chair, the Found Wood Swing is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
  {
    orderNumber: '022',
    img: swingC,
    type: types.chairs,
    arrayType: 0,
    name: 'Found Wood Swing',
    description:
      'Like the Adirondack Chair, the Found Wood Swing is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
  {
    orderNumber: '023',
    img: lightA,
    name: 'Light',
    types: types.other,
    arrayType: 4,
    description: 'Need Light description',
    price: '$500',
  },
  {
    orderNumber: '024',
    img: plantStandCaryl,
    name: 'End Table/Plant table',
    types: types.smallTable,
    arrayType: 1,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a white birch burl but cherry and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '025',
    img: picnicTableC,
    type: types.largeTable,
    arrayType: 2,
    name: 'Picnic Table',
    description: 'need Description',
    price: '$3000',
  },
  {
    orderNumber: '026',
    img: tree_house_steps,
    type: types.structure,
    arrayType: 3,
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '027',
    img: tables,
    name: 'End Table/Plant table',
    types: types.smallTable,
    arrayType: 1,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a white birch burl but cherry and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '028',
    img: outside_adirondack_chair,
    name: 'Adirondack Chair',
    types: types.smallTable,
    arrayType: 0,
    description:
      'This very comfortable chair has White Cedar uprights cut and shaped for lumbar support and 6/4" Cedar arms which are screwed together and covered with Mahogany plugs. This chair is made to last as four coats of spar varnish are heated into the wood. For those who will be using the chair indoors or in a more sheltered location, a different, less durable but richer finish will be used.',
    price: '$1200',
  },
  {
    orderNumber: '029',
    img: new_hob,
    type: types.structure,
    arrayType: 3,
    name: 'Hobbit House',
    description:
      'The Hobbit House playhouse was designed with input from the teachers at the Tuft’s University Eliot Pearson Children’s School. The house is designed so that children can use it in a variety of ways, to play store, as a jungle gym with passageways, and as a kid’s size place to sit with their friends.',
    price: '$15,000 ~ $20,000',
  },
  {
    orderNumber: '030',
    img: fort_w_child,
    type: types.structure,
    arrayType: 3,
    name: 'Hobbit House',
    description:
      'This product will be built to the needs of the buyer. The one shown is the base unit and contains two platforms of different heights with an inclined ramp connecting them. Options include sunken stumps to walk on, slides, swings and a curved roof.',
    price: '$10,000 ~ $20,000',
  },
  {
    orderNumber: '031',
    img: swing_back,
    type: types.chairs,
    arrayType: 0,
    name: 'Swing',
    description:
      'Like the Adirondack Chair, the Found Wood Swing is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
  {
    orderNumber: '032',
    img: love_seat,
    type: types.chairs,
    arrayType: 0,
    name: 'Adirondack Loveseat',
    description:
      'Like the Adirondack Chair this loveseat is made with 5/4 Red Cedar slats, mahogany plugs and white cedar slats. It is finished with multiple coats of spar varnish that is heated and rubbed in.',
    price: '$2000',
  },
];
