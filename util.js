import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';

const coord = x => parseFloat(parseFloat(x.replace(',', '.')).toFixed(2));
const point = (x, y) => ([coord(x), coord(y)]);
const lineString = x => x
.replace('LINESTRING (', '')
.replace(')', '')
.split(', ')
.map(p => point(p.split(' ')[0], p.split(' ')[1]));
const memoize = initMemoize(initBlobStore({ path: './data' }));
const returning = f => x => (f(x) && undefined) || x;

export { memoize, returning, point, lineString };
