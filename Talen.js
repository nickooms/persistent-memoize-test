import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { doReq } from './req';
import Taal from './Taal';

const memoize = initMemoize(initBlobStore({ path: './data' }));

export default class Talen {
  static map = list => list.map(Taal.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ SorteerVeld = 0 } = {}) =>
    doReq('ListTalen', { SorteerVeld })
    .then(Talen.map);
}

const talenList = x => Talen.list(x);
Talen.getList = memoize(talenList, 'talenList');
