import { doReq } from './req';
import Gemeenten from './Gemeenten';
import { memoize, point } from './util';

export default class Gemeente {
  constructor(x) {
    Object.assign(this, x);
  }
  static map = x => ({
    id: +x.GemeenteId,
    naam: x.GemeenteNaam,
    taalCode: x.TaalCode,
    nisCode: +x.NISGemeenteCode,
  });
  static object = x => Object.assign(Gemeente.map(x), {
    center: point(x.CenterX, x.CenterY),
    minimum: point(x.MinimumX, x.MinimumY),
    maximum: point(x.MaximumX, x.MaximumY),
    nisCode: +x.NisGemeenteCode,
  });
  static naam = naam => x => naam === x.naam;
  static taalCode = taalCode => x => taalCode === x.taalCode;
  static filter = filter => x =>
    (!filter.naam || Gemeente.naam(filter.naam)(x)) &&
    (!filter.taalCode || Gemeente.taalCode(filter.taalCode)(x));
  static find = ({ gewestId, naam, taalCode, SorteerVeld = 0 } = {}) =>
    Gemeente.getListByGewestId(gewestId, SorteerVeld)
    .then(list => list.map(Gemeente.map))
    .then(Gemeenten.filter(Gemeente.filter({ naam, taalCode })))
    .then(list => new Gemeente(list[0]));
  static get = gemeente =>
    doReq('GetGemeenteByGemeenteId', { GemeenteId: gemeente.id })
    .then(list => list.map(Gemeente.object))
    .then(list => new Gemeente(list[0]));
}

const name = 'ListGemeentenByGewestId';
const list = (gewestId, SorteerVeld) =>
  doReq(name, { GewestId: gewestId, SorteerVeld });
Gemeente.getListByGewestId = memoize(list, name);
