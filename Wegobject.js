import { doReq } from './req';
import Wegobjecten from './Wegobjecten';
import { memoize, point } from './util';

export default class Wegobject {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.IdentificatorWegobject,
    aard: +x.AardWegobject,
  });
  static object = x => Object.assign(Wegobject.map(x), {
    center: point(x.CenterX, x.CenterY),
    minimum: point(x.MinimumX, x.MinimumY),
    maximum: point(x.MaximumX, x.MaximumY),
  });
  static create = wegobject => new Wegobject(wegobject);
  static aard = aard => x => aard === x.aard;
  static filter = filter => x =>
    (!filter.nummer || Wegobject.aard(filter.aard)(x));
  static find = ({ straatnaamId, nummer, SorteerVeld = 0 } = {}) =>
    Wegobject.getListByStraatnaamId(straatnaamId, SorteerVeld)
    .then(list => list.map(Wegobject.map))
    .then(Wegobjecten.filter(Wegobject.filter({ nummer })))
    .then(list => new Wegobject(list[0]));
  static get = wegobject =>
    doReq('GetWegobjectByIdentificatorWegobject', { IdentificatorWegobject: wegobject.id })
    .then(list => list.map(Wegobject.object))
    .then(list => new Wegobject(list[0]));
}

const name = 'ListWegobjectenByStraatnaamId';
const list = (straatnaamId, SorteerVeld) =>
  doReq(name, { StraatnaamId: straatnaamId, SorteerVeld });
Wegobject.getListByStraatnaamId = memoize(list, name);
