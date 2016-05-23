import { doReq } from './req';
import Gewest from './Gewest';

export default class Gewesten {
  static map = list => list.map(Gewest.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ SorteerVeld = 0 } = {}) =>
    doReq('ListGewesten', { SorteerVeld })
    .then(Gewesten.map);
}
