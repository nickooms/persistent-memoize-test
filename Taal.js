import { doReq } from './req';
import Talen from './Talen';

export default class Taal {
  static map = x => ({
    code: x.Code,
    naam: x.Naam,
    definitie: x.Definitie,
  });
  static code = code => x => code === x.code;
  static naam = naam => x => naam === x.naam;
  static definitie = definitie => x => definitie === x.definitie;
  static filter = filter => x =>
    (!filter.code || Taal.code(filter.code)(x)) &&
    (!filter.naam || Taal.naam(filter.naam)(x)) &&
    (!filter.definitie || Taal.definitie(filter.definitie)(x));
  static find = ({ code, naam, definitie, SorteerVeld = 0 } = {}) =>
    doReq('ListTalen', { SorteerVeld })
    .then(list => list.map(Taal.map))
    .then(Talen.filter(Taal.filter({ code, naam, definitie })))
    .then(list => list[0]);
}