import { doReq } from './req';
import Huisnummer from './Huisnummer';

export default class Huisnummers {
  static map = list => list.map(Huisnummer.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ StraatnaamId = 7338, SorteerVeld = 0 } = {}) =>
    doReq('ListHuisnummersByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then(Huisnummers.map);
}
