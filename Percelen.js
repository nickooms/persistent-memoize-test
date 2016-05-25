import { doReq } from './req';
import Perceel from './Perceel';

export default class Percelen {
  static map = list => list.map(Perceel.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ HuisnummerId = 1373962, SorteerVeld = 0 } = {}) =>
    doReq('ListPercelenByHuisnummerId', { HuisnummerId, SorteerVeld })
    .then(Percelen.map);
}
