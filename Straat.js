import { doReq } from './req';
import Straten from './Straten';

export default class Straat {
  static map = x => ({
    id: +x.StraatnaamId,
    naam: x.Straatnaam,
    taalCode: x.TaalCode,
  });
  static naam = naam => x => naam === x.naam;
  static taalCode = taalCode => x => taalCode === x.taalCode;
  static filter = filter => x =>
    (!filter.naam || Straat.naam(filter.naam)(x)) &&
    (!filter.taalCode || Straat.taalCode(filter.taalCode)(x));
  static find = ({ gemeenteId, naam, taalCode, SorteerVeld = 0 } = {}) =>
    doReq('ListStraatnamenByGemeenteId', { GemeenteId: gemeenteId, SorteerVeld })
    .then(list => list.map(Straat.map))
    .then(Straten.filter(Straat.filter({ naam, taalCode })))
    .then(list => list[0]);
}
