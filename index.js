import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { log, error } from './log';

const memoize = initMemoize(initBlobStore({ path: './data' }));

const someSlowFunction = i => Promise.resolve(`your number is ${i}`);
const getValue = memoize(someSlowFunction, 'someSlowFunction');

getValue(2)
.then(log)
.then(error);
