//arrays
import chairsArray from './dataTypes/chairs';
import smallTableArray from './dataTypes/smallTables';
import largeTableArray from './dataTypes/largeTable';
import structuresArray from './dataTypes/structures';
import otherArray from './dataTypes/other';

//this would be a bit cleaner with TS --  enum

// const types = ['chairs', 'smallTable', 'largeTable', 'structure', 'other'];

export default [
  ...chairsArray,
  ...smallTableArray,
  ...largeTableArray,
  ...structuresArray,
  ...otherArray,
];
