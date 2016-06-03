import { doReq } from './req';
import { memoize } from './util';
import Terreinobject from './Terreinobject';

export default class Terreinobjecten {
  static map = list => list.map(Terreinobject.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ huisnummerId: HuisnummerId, SorteerVeld = 0 } = {}) =>
    Terreinobjecten.byHuisnummerId(HuisnummerId, SorteerVeld).then(Terreinobjecten.map);
  static byHuisnummerId = memoize((huisnummerId, SorteerVeld) => name =>
    doReq(name, { HuisnummerId: huisnummerId, SorteerVeld }), 'ListTerreinobjectenByHuisnummerId');
}
