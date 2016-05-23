import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { doReq } from './req';
import Straten from './Straten';

const memoize = initMemoize(initBlobStore({ path: './data' }));

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
    Straat.getListByGemeenteId(gemeenteId, SorteerVeld)
    // doReq('ListStraatnamenByGemeenteId', { GemeenteId: gemeenteId, SorteerVeld })
    .then(list => list.map(Straat.map))
    .then(Straten.filter(Straat.filter({ naam, taalCode })))
    .then(list => list[0]);
}

const listStratenByGemeenteId = (gemeenteId, SorteerVeld) =>
  doReq('ListStraatnamenByGemeenteId', { GemeenteId: gemeenteId, SorteerVeld });
Straat.getListByGemeenteId = memoize(listStratenByGemeenteId, 'listStratenByGemeenteId');
