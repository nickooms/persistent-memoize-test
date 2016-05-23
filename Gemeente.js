import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { doReq } from './req';
import Gemeenten from './Gemeenten';

const memoize = initMemoize(initBlobStore({ path: './data' }));

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
    Gemeente.getListByGewestId(gewestId, SorteerVeld)
    // doReq('ListGemeentenByGewestId', { GewestId: gewestId, SorteerVeld })
    .then(list => list.map(Gemeente.map))
    .then(Gemeenten.filter(Gemeente.filter({ naam, taalCode })))
    .then(list => list[0]);
}

const listGemeentenByGewestId = (gewestId, SorteerVeld) =>
  doReq('ListGemeentenByGewestId', { GewestId: gewestId, SorteerVeld });
Gemeente.getListByGewestId = memoize(listGemeentenByGewestId, 'listGemeentenByGewestId');
