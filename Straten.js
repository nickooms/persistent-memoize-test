import { doReq } from './req';
import Straat from './Straat';

export default class Straten {
  static map = list => list.map(Straat.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ GemeenteId = 2, SorteerVeld = 0 } = {}) =>
    doReq('ListStraatnamenByGemeenteId', { GemeenteId, SorteerVeld })
    .then(Straten.map);
}
