import { doReq } from './req';
import Wegsegmenten from './Wegsegmenten';
import { memoize, lineString } from './util';

export default class Wegsegment {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.IdentificatorWegsegment,
    status: +x.StatusWegsegment,
  });
  static object = x => Object.assign(Wegsegment.map(x), {
    geometrieMethode: +x.GeometriemethodeWegsegment,
    lineString: lineString(x.Geometrie),
  });
  static create = wegsegment => new Wegsegment(wegsegment);
  static status = status => x => status === x.status;
  static filter = filter => x =>
    (!filter.nummer || Wegsegment.status(filter.status)(x));
  static find = ({ straatnaamId, nummer, SorteerVeld = 0 } = {}) =>
    Wegsegment.getListByStraatnaamId(straatnaamId, SorteerVeld)
    .then(list => list.map(Wegsegment.map))
    .then(Wegsegmenten.filter(Wegsegment.filter({ nummer })))
    .then(list => new Wegsegment(list[0]));
  static get = wegsegment =>
    doReq('GetWegsegmentByIdentificatorWegsegment', { IdentificatorWegsegment: wegsegment.id })
    .then(list => list.map(Wegsegment.object))
    .then(list => new Wegsegment(list[0]));
}

const name = 'ListWegsegmentenByStraatnaamId';
const list = (straatnaamId, SorteerVeld) =>
  doReq(name, { StraatnaamId: straatnaamId, SorteerVeld });
Wegsegment.getListByStraatnaamId = memoize(list, name);
