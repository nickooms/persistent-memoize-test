import { doReq } from './req';
import Wegsegment from './Wegsegment';

export default class Wegsegmenten {
  static map = list => list.map(Wegsegment.map);
  static filter = filter => list => list.filter(filter);
  static list = ({ StraatnaamId = 7338, SorteerVeld = 0 } = {}) =>
    doReq('ListWegsegmentenByStraatnaamId', { StraatnaamId, SorteerVeld })
    .then(Wegsegmenten.map)
    .then(wegsegmenten => wegsegmenten.map(Wegsegment.create));
}
