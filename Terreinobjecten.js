import { doReq } from './req';
import Terreinobject from './Terreinobject';

export default class Terreinobjecten {
  static map = list => list.map(Terreinobject.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ HuisnummerId = 1373962, SorteerVeld = 0 } = {}) =>
    doReq('ListTerreinobjectenByHuisnummerId', { HuisnummerId, SorteerVeld })
    .then(Terreinobjecten.map);
}
