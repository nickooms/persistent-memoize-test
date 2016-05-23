import { doReq } from './req';
import Taal from './Taal';

export default class Talen {
  static map = list => list.map(Taal.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ SorteerVeld = 0 } = {}) =>
    doReq('ListTalen', { SorteerVeld })
    .then(Talen.map);
}
