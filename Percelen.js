import { doReq } from './req';
import { memoize } from './util';
import Perceel from './Perceel';

export default class Percelen {
  static map = list => list.map(Perceel.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ huisnummerId: HuisnummerId, SorteerVeld = 0 } = {}) =>
    Percelen.byHuisnummerId(HuisnummerId, SorteerVeld).then(Percelen.map);
  static byHuisnummerId = memoize((huisnummerId, SorteerVeld) => name =>
    doReq(name, { HuisnummerId: huisnummerId, SorteerVeld }), 'ListPercelenByHuisnummerId');
}
