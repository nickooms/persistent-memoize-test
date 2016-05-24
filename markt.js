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

const Scale = 4.5;
const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Markt';
const coords = [];
const objects = { gebouwen: [], terreinen: [], wegobjecten: [], wegsegmenten: [] };

class Color {
  constructor({ r, g, b }) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  static random = () => new Color({
    r: (Math.random() * 0xff) | 0,
    g: (Math.random() * 0xff) | 0,
    b: (Math.random() * 0xff) | 0,
  });
  toArray() {
    const { r, g, b } = this;
    return [r, g, b];
  }
  toString() {
    const { r, g, b } = this;
    return `#${r}${g}${b}`;
  }
  toHex = () => `#${this.toArray()
    .map(component => component.toString(16))
    .map(string => '0'.repeat(2 - string.length) + string)
    .join('')}`;
}

const red = Color.random();
console.log(red);

const polygon = (min, strokeColor = 'black', strokeWidth = 3, fill = red) => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(p[1] - min.y) * Scale;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polygon points="${pss.join(' ')}" ${stroke} ${strokeW} fill="${fill.toHex()}" />`;
};

const polyline = (min, strokeColor = 'black', strokeWidth = 3/* , fill = 'red'*/) => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(p[1] - min.y) * Scale;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polyline points="${pss.join(' ')}" ${stroke} ${strokeW} />`;
};

const circle = (min, strokeColor = 'black', strokeWidth = 3, fill = 'red') => p => {
  const cx = Math.floor(p[0] - min.x) * Scale;
  const cy = Math.floor(p[1] - min.y) * Scale;
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <circle cx="${cx}" cy="${cy}" r="1" ${stroke} ${strokeW} fill="${fill}" />`;
};

/* class CMM {
  center;
  minimum;
  maximum;
}*/

const Parse = {
  gebouw: x => Gebouw.get(x).then(gebouw => {
    if (gebouw.polygon) objects.gebouwen.push(gebouw.polygon);
  }),

  terreinobject: x => Terreinobject.get(x)
    .then(({ center, minimum, maximum }) => objects.terreinen.push(center, minimum, maximum)),

  Huisnummer: huisnummer => {
    const id = { huisnummerId: huisnummer.id };
    return Promise.all([
      Gebouw.find(id).then(Parse.gebouw),
      Terreinobject.find(id).then(Parse.terreinobject),
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
    ]).then(() => {
      objects.gebouwen.forEach(g => coords.push(...g));
      objects.wegsegmenten.forEach(g => coords.push(...g));
      coords.push(...objects.terreinen);
      coords.push(...objects.wegobjecten);
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
${objects.gebouwen.filter(coord => coord).map(polygon(min, 'black', 1)).join('\n')}
${objects.wegsegmenten.filter(coord => coord).map(polyline(min, 'black', 1)).join('\n')}
${objects.wegobjecten.filter(coord => coord).map(circle(min, 'blue', 3)).join('\n')}
${objects.terreinen.filter(coord => coord).map(circle(min, 'green', 3)).join('\n')}
</svg>`;
      fs.writeFileSync('test2.svg', svg);
    }).catch(e => log(e));
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
.then(log)
.then(Parse.Straat);
