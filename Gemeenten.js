import { doReq } from './req';
import Gemeente from './Gemeente';

export default class Gemeenten {
  static map = list => list.map(Gemeente.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ GewestId = 2, SorteerVeld = 0 } = {}) =>
    doReq('ListGemeentenByGewestId', { GewestId, SorteerVeld })
    .then(Gemeenten.map);
}
