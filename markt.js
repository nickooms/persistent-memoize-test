import Taal from './Taal';
import Gewest from './Gewest';
import Gemeente from './Gemeente';
import Straat from './Straat';
// import Huisnummer from './Huisnummer';
import Huisnummers from './Huisnummers';
import Wegobject from './Wegobject';
import Wegobjecten from './Wegobjecten';
import Wegsegment from './Wegsegment';
import Wegsegmenten from './Wegsegmenten';
import Gebouw from './Gebouw';
import Terreinobject from './Terreinobject';
import { log } from './log';
// import chalk from 'chalk';

const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Markt';

const processHuisnummer = huisnummer => {
  const idHuisnummer = { huisnummerId: huisnummer.id };
  Gebouw.find(idHuisnummer).then(log);
  Terreinobject.find(idHuisnummer).then(log);
};

const processWegobject = wegobject => {
  Wegobject.get(wegobject).then(log);
};

const processWegsegment = wegsegment => {
  Wegsegment.get(wegsegment).then(log);
};

const processHuisnummers = huisnummers => {
  huisnummers.forEach(huisnummer => processHuisnummer(huisnummer));
};

const processWegobjecten = wegobjecten => {
  wegobjecten.forEach(wegobject => processWegobject(wegobject));
};

const processWegsegmenten = wegsegmenten => {
  wegsegmenten.forEach(wegsegment => processWegsegment(wegsegment));
};

const getStraat = gemeente => {
  Gemeente.get(gemeente).then(log);
  return Straat.find({ gemeenteId: gemeente.id, naam: STRAAT });
};

const processStraat = straat => {
  const idStraat = { straatnaamId: straat.id };
  Huisnummers.list(idStraat).then(log)
  .then(huisnummers => processHuisnummers(huisnummers));
  Wegobjecten.list(idStraat).then(log)
  .then(wegobjecten => processWegobjecten(wegobjecten));
  Wegsegmenten.list(idStraat).then(log)
  .then(wegsegmenten => processWegsegmenten(wegsegmenten));
};

Taal.find({ naam: TAAL }).then(log)
.then(taal => Gewest.find({ taalCode: taal.code, naam: GEWEST })).then(log)
.then(gewest => Gemeente.find({ gewestId: gewest.id, naam: GEMEENTE })).then(log)
.then(gemeente => getStraat(gemeente)).then(log)
.then(straat => processStraat(straat));
