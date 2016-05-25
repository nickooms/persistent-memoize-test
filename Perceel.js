import { doReq } from './req';
import { memoize, point } from './util';

export default class Perceel {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: x.IdentificatorPerceel,
  });
  static object = x => Object.assign(Perceel.map(x), {
    center: point(x.CenterX, x.CenterY),
  });
  static create = perceel => new Perceel(perceel);
  static find = ({ huisnummerId, SorteerVeld = 0 } = {}) =>
    Perceel.getListByHuisnummerId(huisnummerId, SorteerVeld)
    .then(list => list.map(Perceel.map))
    .then(list => new Perceel(list[0]));
  static get = perceel =>
    Perceel.getById(perceel.id)
    .then(list => list.map(Perceel.object))
    .then(list => new Perceel(list[0]));
}

const name = 'ListPercelenByHuisnummerId';
const list = (huisnummerId, SorteerVeld) =>
  doReq(name, { HuisnummerId: huisnummerId, SorteerVeld });
Perceel.getListByHuisnummerId = memoize(list, name);

const op = 'GetPerceelByIdentificatorPerceel';
const lst = id => doReq(op, { IdentificatorPerceel: id });
Perceel.getById = memoize(lst, op);
