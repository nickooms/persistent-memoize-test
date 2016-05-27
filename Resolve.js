import Huisnummers from './Huisnummers';
import Wegobject from './Wegobject';
import Wegobjecten from './Wegobjecten';
import Wegsegment from './Wegsegment';
import Wegsegmenten from './Wegsegmenten';
import Gebouw from './Gebouw';
import Perceel from './Perceel';
import Terreinobject from './Terreinobject';
import { log } from './log';

const objects = {
  gebouwen: [],
  terreinen: [],
  wegobjecten: [],
  wegsegmenten: [],
  percelen: [],
};

const Resolve = {
  Gebouw: x => Gebouw.get(x).then(gebouw => {
    if (gebouw.polygon) objects.gebouwen.push(gebouw.polygon);
  }),

  Terreinobject: x => Terreinobject.get(x).then(({ center, minimum, maximum }) => {
    if (center && minimum && maximum) objects.terreinen.push({ center, minimum, maximum });
  }),

  Perceel: x => Perceel.get(x).then(perceel => {
    objects.percelen.push(perceel.center);
  }),

  Huisnummer: x => {
    const id = { huisnummerId: x.id };
    return Promise.all([
      Gebouw.find(id).then(Resolve.Gebouw),
      Terreinobject.find(id).then(Resolve.Terreinobject),
      Perceel.find(id).then(Resolve.Perceel),
    ]);
  },

  Wegobject: x => Wegobject.get(x).then(({ center, minimum, maximum }) =>
    objects.wegobjecten.push({ center, minimum, maximum })),

  Wegsegment: x => Wegsegment.get(x)
    .then(wegsegment => objects.wegsegmenten.push(wegsegment.lineString)),

  Huisnummers: x => Promise.all(x.map(Resolve.Huisnummer)),

  Wegobjecten: x => Promise.all(x.map(Resolve.Wegobject)),

  Wegsegmenten: x => Promise.all(x.map(Resolve.Wegsegment)),

  Straat: fn => straat => {
    const id = { straatnaamId: straat.id };
    Promise.all([
      Huisnummers.list(id).then(Resolve.Huisnummers),
      Wegobjecten.list(id).then(Resolve.Wegobjecten),
      Wegsegmenten.list(id).then(Resolve.Wegsegmenten),
    ]).then(() => fn(objects)).catch(e => log(e));
  },
};

export default Resolve;
