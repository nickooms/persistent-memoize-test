import { doReq } from './req';
import Gebouw from './Gebouw';

export default class Gebouwen {
  static map = list => list.map(Gebouw.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ HuisnummerId = 1373962, SorteerVeld = 0 } = {}) =>
    doReq('ListGebouwenByHuisnummerId', { HuisnummerId, SorteerVeld })
    .then(Gebouwen.map);
}
