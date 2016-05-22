import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { error } from '../log';

const memoize = initMemoize(initBlobStore({ path: './data' }));

const someSlowFunction = i => Promise.resolve(`your number is ${i}`);
const getValue = memoize(someSlowFunction, 'someSlowFunction');

const NUMBER = 2;

describe('persistent-memoize', () => {
  beforeEach(() => {});

  it(`should find "${NUMBER}"`, done => {
    getValue(NUMBER)
    .then(x => expect(x).toEqual('your number is 2'))
    .then(done).catch(error);
  });
});
