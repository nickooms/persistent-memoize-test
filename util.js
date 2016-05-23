import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';

const memoize = initMemoize(initBlobStore({ path: './data' }));
const returning = f => x => (f(x) && undefined) || x;

export { memoize, returning };
