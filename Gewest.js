import initMemoize from 'persistent-memoize';
import initBlobStore from 'fs-blob-store';
import { doReq } from './req';
import Gewesten from './Gewesten';

const memoize = initMemoize(initBlobStore({ path: './data' }));

export default class Gewest {
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
    // doReq('ListGewesten', { SorteerVeld })
    .then(list => list.map(Gewest.map))
    .then(Gewesten.filter(Gewest.filter({ taalCode, naam })))
    .then(list => list[0]);
}

const listGewesten = SorteerVeld => doReq('ListGewesten', { SorteerVeld });
Gewest.getList = memoize(listGewesten, 'listGewesten');
