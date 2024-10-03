import coffeeTableStudio from '../../../src/assets/gallery/small_tables/coffee_table_side.jpeg';
import coffeeTable from '../../../src/assets/gallery/small_tables/real_tableA.jpg';
import plantStand from '../../../src/assets/gallery/small_tables/plantStand.jpeg';
import plantStandCaryl from '../../../src/assets/gallery/small_tables/plantStandD.jpeg';
import tables from '../../../src/assets/gallery/small_tables/tables.jpg';
import small_table from '../../../src/assets/gallery/small_tables/smallTable.jpeg';

import types from './types';

export default [
  {
    orderNumber: '008',
    img: coffeeTableStudio,
    name: 'Coffee Table',
    type: types.smallTable,
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },
  {
    orderNumber: '005',
    img: coffeeTable,
    type: types.smallTable,
    name: 'Coffee Table',
    description:
      'These tables are made with slices from a remarkable maple burl held up by spalted maple legs. the table is 18 inches high and well over 2 feet in diameter',
    price: '$1000',
  },

  {
    orderNumber: '009',
    img: plantStand,
    name: 'End Table/Plant table',
    type: types.smallTable,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The legs are made with the same wood type as the top. Each leg has the bark left on and is sanded and treated to make it firmly attached to the base wood.',
    price: '$1000',
  },

  {
    orderNumber: '024',
    img: plantStandCaryl,
    name: 'End Table/Plant table',
    type: types.smallTable,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood.',
    price: '$1000',
  },
  {
    orderNumber: '027',
    img: tables,
    name: 'End Table/Plant table',
    type: types.smallTable,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood.',
    price: '$1000',
  },
  {
    orderNumber: '033',
    img: small_table,
    name: 'Burl Side Table with "C" legs',
    type: types.smallTable,
    description:
      'A variety of unique large Maine burls are sliced and are added to a "C" shaped leg arrangement',
    price: '$500 ~ $600',
  },
];
