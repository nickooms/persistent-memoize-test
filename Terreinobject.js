import { doReq } from './req';
import Terreinobjecten from './Terreinobjecten';
import { memoize, point } from './util';

export default class Terreinobject {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: x.IdentificatorTerreinobject,
    aard: +x.AardTerreinobject,
  });
  static object = x => Object.assign(Terreinobject.map(x), {
    center: point(x.CenterX, x.CenterY),
    minimum: point(x.MinimumX, x.MinimumY),
    maximum: point(x.MaximumX, x.MaximumY),
  });
  static aard = aard => x => aard === x.aard;
  static filter = filter => x =>
    (!filter.nummer || Terreinobject.aard(filter.aard)(x));
  static find = ({ huisnummerId, aard, SorteerVeld = 0 } = {}) =>
    Terreinobject.byHuisnummerId(huisnummerId, SorteerVeld)
    .then(list => list.map(Terreinobject.map))
    .then(Terreinobjecten.filter(Terreinobject.filter({ aard })))
    .then(list => new Terreinobject(list[0]));
  static get = terreinobject => Terreinobject.byId(terreinobject.id)
    .then(list => list.map(Terreinobject.object))
    .then(list => new Terreinobject(list[0]));
  static byId = memoize(id => name =>
    doReq(name, { IdentificatorTerreinobject: id }), 'GetTerreinobjectByIdentificatorTerreinobject');
  static byHuisnummerId = memoize((huisnummerId, SorteerVeld) => name =>
    doReq(name, { HuisnummerId: huisnummerId, SorteerVeld }), 'ListTerreinobjectenByHuisnummerId');
}
