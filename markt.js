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
import Terreinobject from './Terreinobject';
import { log } from './log';
import fs from 'fs';

const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Markt';
const coords = [];
const objects = {
  gebouwen: [],
  terreinen: [],
  wegobjecten: [],
  wegsegmenten: [],
};

const processGebouw = x => Gebouw.get(x).then(gebouw => {
  if (gebouw.polygon) objects.gebouwen.push(gebouw.polygon);
});

const processTerreinobject = x => Terreinobject.get(x)
  .then(({ center, minimum, maximum }) => objects.terreinen.push(center, minimum, maximum));

const processHuisnummer = huisnummer => {
  const id = { huisnummerId: huisnummer.id };
  return Promise.all([
    Gebouw.find(id).then(x => processGebouw(x)),
    Terreinobject.find(id).then(x => processTerreinobject(x)),
  ]);
};

const processWegobject = x => Wegobject.get(x)
  .then(({ center, minimum, maximum }) => objects.wegobjecten.push(center, minimum, maximum));

const processWegsegment = x => Wegsegment.get(x)
  .then(wegsegment => objects.wegsegmenten.push(wegsegment.lineString));

const processHuisnummers = list => Promise.all(list.map(x => processHuisnummer(x)));

const processWegobjecten = list => Promise.all(list.map(x => processWegobject(x)));

const processWegsegmenten = list => Promise.all(list.map(x => processWegsegment(x)));

const getStraat = gemeente => {
  Gemeente.get(gemeente).then(log);
  return Straat.find({ gemeenteId: gemeente.id, naam: STRAAT });
};

const polygon = (min, strokeColor = 'black', strokeWidth = 3, fill = 'red') => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * 10;
    const y = Math.floor(p[1] - min.y) * 10;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polygon points="${pss.join(' ')}" ${stroke} ${strokeW} fill="${fill}" />`;
};

const polyline = (min, strokeColor = 'black', strokeWidth = 3, fill = 'red') => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * 10;
    const y = Math.floor(p[1] - min.y) * 10;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polyline points="${pss.join(' ')}" ${stroke} ${strokeW} />`;
};

const circle = (min, strokeColor = 'black', strokeWidth = 3, fill = 'red') => p => {
  const cx = Math.floor(p[0] - min.x) * 10;
  const cy = Math.floor(p[1] - min.y) * 10;
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <circle cx="${cx}" cy="${cy}" r="1" ${stroke} ${strokeW} fill="${fill}" />`;
};

const processStraat = straat => {
  const id = { straatnaamId: straat.id };
  Promise.all([
    Huisnummers.list(id).then(huisnummers => processHuisnummers(huisnummers)),
    Wegobjecten.list(id).then(wegobjecten => processWegobjecten(wegobjecten)),
    Wegsegmenten.list(id).then(wegsegmenten => processWegsegmenten(wegsegmenten)),
  ]).then(() => {
    objects.gebouwen.forEach(g => coords.push(...g));
    objects.wegsegmenten.forEach(g => coords.push(...g));
    // console.log(objects.terreinen);
    // console.log(objects.wegsegmenten);
    coords.push(...objects.terreinen);
    coords.push(...objects.wegobjecten);
    // coords.push(...objects.wegsegmenten);
    const list = coords.filter(coord => coord);
    const x = list.map(coord => coord[0]);
    const y = list.map(coord => coord[1]);
    const min = { x: Math.min(...x), y: Math.min(...y) };
    const max = { x: Math.max(...x), y: Math.max(...y) };
    const w = Math.ceil(max.x - min.x);
    const h = Math.ceil(max.y - min.y);
    const width = 'width="100%"';
    const height = 'height="100%"';
    const viewPort = `viewPort="0 0 ${w * 10} ${h * 10}"`;
    const ns = 'xmlns="http://www.w3.org/2000/svg"';
    const svg = `<svg ${width} ${height} ${viewPort} version="1.1" ${ns}>
${objects.gebouwen.filter(coord => coord).map(polygon(min, 'black', 1)).join('\n')}
${objects.wegsegmenten.filter(coord => coord).map(polyline(min, 'black', 1)).join('\n')}
${objects.wegobjecten.filter(coord => coord).map(circle(min, 'blue', 3)).join('\n')}
${objects.terreinen.filter(coord => coord).map(circle(min, 'green', 3)).join('\n')}
</svg>`;
    fs.writeFileSync('test2.svg', svg);
  }).catch(e => log(e));
};

Taal.find({ naam: TAAL }).then(log)
.then(taal => Gewest.find({ taalCode: taal.code, naam: GEWEST })).then(log)
.then(gewest => Gemeente.find({ gewestId: gewest.id, naam: GEMEENTE })).then(log)
.then(gemeente => getStraat(gemeente)).then(log)
.then(straat => processStraat(straat));
