import { doReq } from './req';
import Wegobject from './Wegobject';

export default class Wegobjecten {
  static map = list => list.map(Wegobject.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ StraatnaamId = 7338, SorteerVeld = 0 } = {}) =>
    doReq('ListWegobjectenByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then(Wegobjecten.map)
    .then(wegobjecten => wegobjecten.map(Wegobject.create));
}
