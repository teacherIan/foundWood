import types from './types';
import kidsPicnicTable from '../../../src/assets/gallery/real_picnic_table_rotated.png';
import adult_picnic_table from '../../../src/assets/gallery/large_tables/adult_picnic_table.png';
import picnicTableC from '../../../src/assets/gallery/large_tables/picnic_table_b.jpg';
import diningTableTop from '../../../src/assets/gallery/large_tables/dining_table_overhead.jpeg';
import diningTableUnder from '../../../src/assets/gallery/large_tables/dining_table_under.jpeg';
import glass_table from '../../../src/assets/gallery/large_tables/small_table.jpg';

export default [
  {
    orderNumber: '304',
    img: kidsPicnicTable,
    type: types.largeTable,
    name: 'Kids Picnic Table',
    description:
      'Crafted from natural Maine white cedar roots and planks, this rustic children sized picnic table blends durability with woodland charm. Its organic root base offers sturdy support, while the smooth, rounded planks ensure safety and comfort—perfect for outdoor play and gatherings.',
    price: '$1000 ~ $1500',
  },
  {
    orderNumber: '312',
    img: adult_picnic_table,
    type: types.largeTable,
    name: 'Picnic Table',
    description:
      'This large picnic table is made of Maine White Cedar roots and planks and custom built to a variety of heights, lengths and widths.  ',
    price: '$1400 ~ $2000',
  },
  {
    orderNumber: '325',
    img: picnicTableC,
    type: types.largeTable,
    name: 'Picnic Table',
    description:
      'This large picnic table is made of Maine White Cedar roots and planks',
    price: '$1400 ~ $2000',
  },
  {
    orderNumber: '335',
    img: diningTableTop,
    type: types.largeTable,
    name: 'Glass Dining Table',
    description:
      'Pictured is the root system of three interconnected cedar trees.  Often the roots of the trees are interconnected & they lead themselves to the table bases.',
    price: '$2000 ~ $4000',
  },
  {
    orderNumber: '336',
    img: diningTableUnder,
    type: types.largeTable,
    name: 'Glass Dining Table',
    description:
      'Top view of the glass table. Ceder grows slowly and, under the ground often takes interesting shapes that support a glass top',
    price: '$2000 ~ $4000',
  },
  {
    orderNumber: '013',
    img: glass_table,
    type: types.largeTable,
    name: 'Glass Table',
    description:
      'Ceder grows slowly and, under the ground often takes interesting shapes that support a glass top ',
    price: '$1000 ~ $1200',
  },
];
