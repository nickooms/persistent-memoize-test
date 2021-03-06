import { doReq } from './req';
import Huisnummers from './Huisnummers';
import { memoize } from './util';

export default class Huisnummer {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.HuisnummerId,
    nummer: x.Huisnummer,
  });
  static create = huisnummer => new Huisnummer(huisnummer);
  static nummer = nummer => x => nummer == x.nummer;
  static filter = filter => x =>
    (!filter.nummer || Huisnummer.nummer(filter.nummer)(x));
  static find = ({ straatnaamId, nummer, SorteerVeld = 0 } = {}) =>
    Huisnummer.getListByStraatnaamId(straatnaamId, SorteerVeld)
    .then(list => list.map(Huisnummer.map))
    .then(Huisnummers.filter(Huisnummer.filter({ nummer })))
    .then(list => new Huisnummer(list[0]));
}

const name = 'ListHuisnummersByStraatnaamId';
const list = (straatnaamId, SorteerVeld) =>
  doReq(name, { StraatnaamId: straatnaamId, SorteerVeld });
Huisnummer.getListByStraatnaamId = memoize(list, name);
