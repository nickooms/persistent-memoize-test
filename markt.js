import { Scale, polyline, polygon, circle } from './SVG';
import Taal from './Taal';
import Gewest from './Gewest';
import Gemeente from './Gemeente';
import Straat from './Straat';
import Huisnummers from './Huisnummers';
import Wegobject from './Wegobject';
import Wegobjecten from './Wegobjecten';
import Wegsegment from './Wegsegment';
import Wegsegmenten from './Wegsegmenten';
import Gebouw from './Gebouw';
import Perceel from './Perceel';
import Terreinobject from './Terreinobject';
import { log } from './log';
import fs from 'fs';

const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Markt';
const objects = { gebouwen: [], terreinen: [], wegobjecten: [], wegsegmenten: [], percelen: [] };

const createSVG = () => {
  const { gebouwen, percelen, terreinen, wegobjecten, wegsegmenten } = objects;
  const coords = [];
  gebouwen.forEach(x => coords.push(...x));
  wegsegmenten.forEach(x => coords.push(...x));
  coords.push(...terreinen);
  coords.push(...wegobjecten);
  coords.push(...percelen);
  const list = coords.filter(coord => coord);
  const x = list.map(coord => coord[0]);
  const y = list.map(coord => coord[1]);
  const min = { x: Math.min(...x), y: Math.min(...y) };
  const max = { x: Math.max(...x), y: Math.max(...y) };
  const w = Math.ceil(max.x - min.x);
  const h = Math.ceil(max.y - min.y);
  const W = w * Scale;
  const H = h * Scale;
  const width = `width="${W}"`;
  const height = `height="${H}"`;
  const viewPort = `viewPort="0 0 ${W} ${H}"`;
  const ns = 'xmlns="http://www.w3.org/2000/svg"';
  const svg = `<svg ${width} ${height} ${viewPort} version="1.1" ${ns}>
${gebouwen.filter(coord => coord).map(polygon(min, 'black', 1)).join('\n')}
${wegsegmenten.filter(coord => coord).map(polyline(min, 'gray', 1)).join('\n')}
${wegobjecten.filter(coord => coord).map(circle(min, 'blue', 3, 'blue')).join('\n')}
${terreinen.filter(coord => coord).map(circle(min, 'green', 3, 'green')).join('\n')}
${percelen.filter(coord => coord).map(circle(min, 'purple', 3, 'purple')).join('\n')}
</svg>`;
  fs.writeFileSync('test2.svg', svg);
  log('SVG generated');
};

const Parse = {
  Gebouw: x => Gebouw.get(x).then(gebouw => {
    if (gebouw.polygon) objects.gebouwen.push(gebouw.polygon);
  }),

  Terreinobject: x => Terreinobject.get(x)
    .then(({ center, minimum, maximum }) => objects.terreinen.push(center, minimum, maximum)),

  Perceel: x => Perceel.get(x).then(perceel => {
    objects.percelen.push(perceel.center);
  }),

  Huisnummer: x => {
    const id = { huisnummerId: x.id };
    return Promise.all([
      Gebouw.find(id).then(Parse.Gebouw),
      Terreinobject.find(id).then(Parse.Terreinobject),
      Perceel.find(id).then(Parse.Perceel),
    ]);
  },

  Wegobject: x => Wegobject.get(x).then(({ center, minimum, maximum }) =>
    objects.wegobjecten.push(center, minimum, maximum)),

  Wegsegment: x => Wegsegment.get(x)
    .then(wegsegment => objects.wegsegmenten.push(wegsegment.lineString)),

  Huisnummers: x => Promise.all(x.map(Parse.Huisnummer)),

  Wegobjecten: x => Promise.all(x.map(Parse.Wegobject)),

  Wegsegmenten: x => Promise.all(x.map(Parse.Wegsegment)),

  Straat: straat => {
    const id = { straatnaamId: straat.id };
    Promise.all([
      Huisnummers.list(id).then(Parse.Huisnummers),
      Wegobjecten.list(id).then(Parse.Wegobjecten),
      Wegsegmenten.list(id).then(Parse.Wegsegmenten),
    ]).then(createSVG).catch(e => log(e));
  },
};

const getStraat = gemeente => Gemeente.get(gemeente)
  .then(Straat.find({ gemeenteId: gemeente.id, naam: STRAAT }));

Taal.find({ naam: TAAL })
.then(log)
.then(taal => Gewest.find({ taalCode: taal.code, naam: GEWEST }))
.then(log)
.then(gewest => Gemeente.find({ gewestId: gewest.id, naam: GEMEENTE }))
.then(log)
.then(gemeente => getStraat(gemeente))
.then(Parse.Straat);
