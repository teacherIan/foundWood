import coffeeTableStudio from '../../../src/assets/gallery/small_tables/coffeeTable_studio.jpeg';
import coffeeTable from '../../../src/assets/gallery/small_tables/real_tableA.jpg';
import plantStand from '../../../src/assets/gallery/small_tables/plantStand.jpeg';
import glass_table from '../../../src/assets/gallery/large_tables/small_table.jpg';
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
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a cherry burl but white birch and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on and is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '013',
    img: glass_table,
    type: types.smallTable,
    name: 'Glass Table',
    description: 'Glass Table',
    price: '$1500 - $3000',
  },
  {
    orderNumber: '024',
    img: plantStandCaryl,
    name: 'End Table/Plant table',
    type: types.smallTable,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The picture shown is of a white birch burl but cherry and maple burls are also available. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '027',
    img: tables,
    name: 'End Table/Plant table',
    type: types.smallTable,
    description:
      'Customers have used these 30 inch high tables as both end tables and plant stands. The focal point of each is the top which is made of spalted burls. The legs are made with the same wood type as the top. Each leg has the bark left on though it is sanded and treated to make it firmly attached to the base wood. The process gives the bark an attractive marble like appearance and leads the eye to the top.',
    price: '$1000',
  },
  {
    orderNumber: '033',
    img: small_table,
    name: 'Burl Table',
    type: types.smallTable,
    description: 'Need Description',
    price: '$1000',
  },
];
