import { Huisnummers, Wegobjecten, Wegobject, Wegsegmenten, Wegsegment, Gebouwen, Gebouw,
  Percelen, Perceel, Terreinobjecten, Terreinobject } from './CRAB';
import { log, error
 } from './log';

const objects = { gebouwen: [], terreinen: [], wegobjecten: [], wegsegmenten: [], percelen: [] };

const Resolve = {
  getList: id => x => x.list(id).then(Resolve[x.name]).catch(error),

  Gebouw: x => Gebouw.get(x)
  .then(({ polygon }) => objects.gebouwen.push(polygon)),

  Terreinobject: x => Terreinobject.get(x)
  .then(({ center, minimum, maximum }) => objects.terreinen.push({ center, minimum, maximum })),

  Perceel: x => Perceel.get(x)
  .then(({ center }) => objects.percelen.push(center)),

  Huisnummer: x => Promise.all([Gebouwen, Terreinobjecten, Percelen]
    .map(Resolve.getList({ huisnummerId: x.id }))),

  Gebouwen: x => Promise.all(x.map(Resolve.Gebouw)),
  Terreinobjecten: x => Promise.all(x.map(Resolve.Terreinobject)),
  Percelen: x => Promise.all(x.map(Resolve.Perceel)),
  Huisnummers: x => Promise.all(x.map(Resolve.Huisnummer)),
  Wegobjecten: x => Promise.all(x.map(Resolve.Wegobject)),
  Wegsegmenten: x => Promise.all(x.map(Resolve.Wegsegment)),

  Wegobject: x => Wegobject.get(x)
  .then(({ center, minimum, maximum }) => objects.wegobjecten.push({ center, minimum, maximum })),

  Wegsegment: x => Wegsegment.get(x)
  .then(({ lineString }) => objects.wegsegmenten.push(lineString)),

  Straat: fn => straat => {
    const id = { straatnaamId: straat.id };
    Promise.all([
      Huisnummers.list(id).then(Resolve.Huisnummers),
      Wegobjecten.list(id).then(Resolve.Wegobjecten),
      Wegsegmenten.list(id).then(Resolve.Wegsegmenten),
    ])
    .then(() => fn(objects))
    .catch(e => log(e));
  },
};

export default Resolve;
