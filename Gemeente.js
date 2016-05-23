import { doReq } from './req';
import Gemeenten from './Gemeenten';

export default class Gemeente {
  static map = x => ({
    id: +x.GemeenteId,
    naam: x.GemeenteNaam,
    taalCode: x.TaalCode,
    nisCode: +x.NISGemeenteCode,
  });
  static naam = naam => x => naam === x.naam;
  static taalCode = taalCode => x => taalCode === x.taalCode;
  static filter = filter => x =>
    (!filter.naam || Gemeente.naam(filter.naam)(x)) &&
    (!filter.taalCode || Gemeente.taalCode(filter.taalCode)(x));
  static find = ({ gewestId, naam, taalCode, SorteerVeld = 0 } = {}) =>
    doReq('ListGemeentenByGewestId', { GewestId: gewestId, SorteerVeld })
    .then(list => list.map(Gemeente.map))
    .then(Gemeenten.filter(Gemeente.filter({ naam, taalCode })))
    .then(list => list[0]);
}
