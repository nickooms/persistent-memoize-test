import Color from './Color';
import Resolve from './Resolve';
import CSS from './CSS';
import { Scale, SVG, polyline, polygon, circle, rect, image } from './SVG';
import { Taal, Gewest, Gemeente, Straat } from './CRAB';
import fs from 'fs';
import { log } from './log';
import WMS from './WMS';
import request from 'request';
import { memoize } from './util';

const r = request.defaults({ encoding: null });
// import BBOX from './BBOX';
const EPSG = 'EPSG:31370';

const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Frans Oomsplein';// 'Markt';

const notNull = x => x;

const functions = funcs => object => funcs.map(fn => fn(object)).join('\n');

const css = new CSS({
  'rect.terrein': { stroke: 'black', fill: 'none', 'stroke-width': 2, 'stroke-opacity': 0.5 },
  'circle.wegobject': { stroke: 'red', fill: 'red', 'stroke-width': 10 },
  'circle.terrein': { stroke: 'green', fill: 'green', 'stroke-width': 5 },
  'circle.perceel': { stroke: 'purple', fill: 'purple', 'stroke-width': 3 },
  'polygon.gebouw': { stroke: Color.random().toHex(), fill: Color.random().toHex() },
});

const download = uri => new Promise((resolve, reject) => {
  r.get(uri.split('&amp;').join('&'), (err, response, body) => {
    if (!err && response.statusCode === 200) {
      const contentType = response.headers['content-type'];
      const data = `data:${contentType};base64,${new Buffer(body).toString('base64')}`;
      log(uri);
      resolve(data);
    }
    reject(new Error(`failed download ${uri}`));
  });
});

const getUrl = memoize(uri => download(uri), 'GetUrl');

const createSVG = ({ gebouwen, percelen, terreinen, wegobjecten, wegsegmenten }) => {
  const coords = [];
  gebouwen.forEach(x => coords.push(...x));
  wegsegmenten.forEach(x => coords.push(...x));
  coords.push(...terreinen.map(x => x.center));
  coords.push(...terreinen.map(x => x.minimum));
  coords.push(...terreinen.map(x => x.maximum));
  coords.push(...wegobjecten.map(x => x.center));
  coords.push(...wegobjecten.map(x => x.minimum));
  coords.push(...wegobjecten.map(x => x.maximum));
  coords.push(...percelen);
  const list = coords.filter(notNull);
  const coordinates = {
    x: list.map(coord => coord[0]),
    y: list.map(coord => coord[1]),
  };
  const min = { x: Math.min(...coordinates.x), y: Math.min(...coordinates.y) };
  const max = { x: Math.max(...coordinates.x), y: Math.max(...coordinates.y) };
  const w = Math.ceil(max.x - min.x);
  const h = Math.ceil(max.y - min.y);
  const [W, H] = [w, h].map(o => o * Scale);
  const width = `width="${W}"`;
  const height = `height="${H}"`;
  const viewPort = `viewPort="0 0 ${W} ${H}"`;
  const ns = 'xmlns="http://www.w3.org/2000/svg"';
  const xlink = 'xmlns:xlink="http://www.w3.org/1999/xlink"';

  const svgDoc = new SVG({ width: W, height: H, css: css, children: [] });
  log(svgDoc.toString());

  const toRect = className => x => rect({ min, max, class: className })(x);
  const toCircle = className => x => circle({ min, max, r: 10, class: className })(x.center);

  const imgs = [];
  const terreinToImage = x => new Promise((resolve, reject) => {
    try {
      const [[left, top], [right, bottom]] = [x.minimum, x.maximum];
      const bbox = [left, top, right, bottom].join(',');
      const size = {
        width: Math.floor(right - left) * Scale,
        height: Math.floor(bottom - top) * Scale,
      };
      const url = WMS.getMap(size.width, size.height, EPSG, bbox).split('&').join('&amp;');
      const prom = getUrl(url, `data/images/${bbox}.png`);
      return prom.then(src => {
        const i = image(url, min, max, src)(x);
        imgs.push(i);
        // log(imgs.length);
        return i;
      }).catch(log);
    } catch (e) {
      reject(new Error(e));
    }
  });

  const center = o => o.center;

  Promise.all(terreinen.map(terreinToImage)).then(ee => {
    log(ee);
    log(666);
    const svg = `<svg ${width} ${height} ${viewPort} version="1.1" ${ns} ${xlink}>
${CSS}
${gebouwen.map(polygon({ min, max, class: 'gebouw' })).join('\n')}
${wegsegmenten.map(polyline(min, max, 'gray', 1)).join('\n')}
${wegobjecten.map(rect({ min, max })).join('\n')}

${terreinen.map(functions([toRect('terrein'), toCircle('terrein')])).join('\n\n')}
${`_${imgs.join('\n')}_`}
${wegobjecten.map(center).map(circle({ min, max, class: 'wegobject' })).join('\n')}
${percelen.map(circle({ min, max, class: 'perceel' })).join('\n')}
</svg>`;
    fs.writeFileSync('test2.svg', svg);
    log('SVG generated');
  }).catch(log);
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
.then(Resolve.Straat(createSVG));
