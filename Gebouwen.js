import { doReq } from './req';
import { memoize } from './util';
import Gebouw from './Gebouw';

export default class Gebouwen {
  static map = list => list.map(Gebouw.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ huisnummerId: HuisnummerId, SorteerVeld = 0 } = {}) =>
    Gebouwen.byHuisnummerId(HuisnummerId, SorteerVeld).then(Gebouwen.map);
  static byHuisnummerId = memoize((huisnummerId, SorteerVeld) => name =>
    doReq(name, { HuisnummerId: huisnummerId, SorteerVeld }), 'ListGebouwenByHuisnummerId');
}
