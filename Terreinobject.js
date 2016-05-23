import { doReq } from './req';
import Terreinobjecten from './Terreinobjecten';
import { memoize } from './util';

export default class Terreinobject {
  static map = x => ({
    id: x.IdentificatorTerreinobject,
    aard: +x.AardTerreinobject,
  });
  static aard = aard => x => aard === x.aard;
  static filter = filter => x =>
    (!filter.nummer || Terreinobject.aard(filter.aard)(x));
  static find = ({ huisnummerId, aard, SorteerVeld = 0 } = {}) =>
    Terreinobject.getListByHuisnummerId(huisnummerId, SorteerVeld)
    .then(list => list.map(Terreinobject.map))
    .then(Terreinobjecten.filter(Terreinobject.filter({ aard })))
    .then(list => list[0]);
}

const name = 'ListTerreinobjectenByHuisnummerId';
const list = (huisnummerId, SorteerVeld) =>
  doReq(name, { HuisnummerId: huisnummerId, SorteerVeld });
Terreinobject.getListByHuisnummerId = memoize(list, name);
