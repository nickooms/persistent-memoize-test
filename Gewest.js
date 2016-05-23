import { doReq } from './req';
import Gewesten from './Gewesten';
import { memoize } from './util';

export default class Gewest {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.GewestId,
    naam: x.GewestNaam,
    taalCode: x.TaalCodeGewestNaam,
  });
  static taalCode = taalCode => x => taalCode === x.taalCode;
  static naam = naam => x => naam === x.naam;
  static filter = filter => x =>
    Gewest.taalCode(filter.taalCode)(x) &&
    Gewest.naam(filter.naam)(x);
  static find = ({ taalCode = 'nl', naam = 'Vlaams Gewest', SorteerVeld = 0 } = {}) =>
    Gewest.getList(SorteerVeld)
    .then(list => list.map(Gewest.map))
    .then(Gewesten.filter(Gewest.filter({ taalCode, naam })))
    .then(list => new Gewest(list[0]));
}

const name = 'ListGewesten';
const list = SorteerVeld => doReq(name, { SorteerVeld });
Gewest.getList = memoize(list, name);
