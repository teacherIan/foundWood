import types from './types';
import kidsPicnicTable from '../../../src/assets/gallery/real_picnic_table_rotated.png';
import adult_picnic_table from '../../../src/assets/gallery/large_tables/adult_picnic_table.jpg';
import picnicTableC from '../../../src/assets/gallery/large_tables/picnic_table_b.jpg';
import largeGlassTable from '../../../src/assets/gallery/large_tables/largeGlassTable.jpeg';
import diningTableTop from '../../../src/assets/gallery/large_tables/dining_table_overhead.jpeg';
import diningTableUnder from '../../../src/assets/gallery/large_tables/dining_table_under.jpeg';

export default [
  {
    orderNumber: '304',
    img: kidsPicnicTable,
    type: types.largeTable,
    name: 'Kids Picnic Table',
    description: 'Need kids Picnic Table description',
    price: '$2500',
  },
  {
    orderNumber: '312',
    img: adult_picnic_table,
    type: types.largeTable,
    name: 'Picnic Table',
    description: 'Need Picnic Table description',
    price: '$3000',
  },
  {
    orderNumber: '325',
    img: picnicTableC,
    type: types.largeTable,
    name: 'Picnic Table',
    description: 'need Description',
    price: '$3000',
  },
  {
    orderNumber: '334',
    img: largeGlassTable,
    type: types.largeTable,
    name: 'Glass Dining Table',
    description: 'need Description',
    price: '$3000',
  },
  {
    orderNumber: '335',
    img: diningTableTop,
    type: types.largeTable,
    name: 'Glass Dining Table',
    description: 'need Description',
    price: '$3000',
  },
  {
    orderNumber: '336',
    img: diningTableUnder,
    type: types.largeTable,
    name: 'Glass Dining Table',
    description: 'need Description',
    price: '$3000',
  },
];
