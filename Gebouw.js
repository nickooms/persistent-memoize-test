import { doReq } from './req';
import Gebouwen from './Gebouwen';
import { memoize, polygon } from './util';

export default class Gebouw {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.IdentificatorGebouw,
    aard: +x.AardGebouw,
    status: +x.StatusGebouw,
  });
  static object = x => Object.assign(Gebouw.map(x), {
    geometrieMethode: +x.GeometriemethodeGebouw,
    polygon: polygon(x.Geometrie),
  });
  static aard = aard => x => aard === x.aard;
  static filter = filter => x =>
    (!filter.nummer || Gebouw.aard(filter.aard)(x));
  static find = ({ huisnummerId, aard, SorteerVeld = 0 } = {}) =>
    Gebouw.getListByHuisnummerId(huisnummerId, SorteerVeld)
    .then(list => list.map(Gebouw.map))
    .then(Gebouwen.filter(Gebouw.filter({ aard })))
    .then(list => new Gebouw(list[0]));
  static get = gebouw =>
    Gebouw.getById(gebouw.id)
    .then(list => list.map(Gebouw.object))
    .then(list => new Gebouw(list[0]));
}

const name = 'ListGebouwenByHuisnummerId';
const list = (huisnummerId, SorteerVeld) =>
  doReq(name, { HuisnummerId: huisnummerId, SorteerVeld });
Gebouw.getListByHuisnummerId = memoize(list, name);

const op = 'GetGebouwByIdentificatorGebouw';
const lst = id => doReq(op, { IdentificatorGebouw: id });
Gebouw.getById = memoize(lst, op);
