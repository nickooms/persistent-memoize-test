import Resolve from './Resolve';
import { Scale, polyline, polygon, circle, rect, image } from './SVG';
import Taal from './Taal';
import Gewest from './Gewest';
import Gemeente from './Gemeente';
import Straat from './Straat';
import fs from 'fs';
import { log } from './log';
import WMS from './WMS';
// import BBOX from './BBOX';
const EPSG = 'EPSG:31370';

const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Frans Oomsplein';// 'Markt';

const notNull = x => x;

const functionsWithObject = functions => object => functions.map(fn => fn(object)).join('\n');

const createSVG = ({ gebouwen, percelen, terreinen, wegobjecten, wegsegmenten }) => {
  // console.log(terreinen);
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
  const x = list.map(coord => coord[0]);
  const y = list.map(coord => coord[1]);
  const min = { x: Math.min(...x), y: Math.min(...y) };
  const max = { x: Math.max(...x), y: Math.max(...y) };
  const w = Math.ceil(max.x - min.x);
  const h = Math.ceil(max.y - min.y);
  const [W, H] = [w, h].map(o => o * Scale);
  const width = `width="${W}"`;
  const height = `height="${H}"`;
  const viewPort = `viewPort="0 0 ${W} ${H}"`;
  const ns = 'xmlns="http://www.w3.org/2000/svg"';
  const xlink = 'xmlns:xlink="http://www.w3.org/1999/xlink"';

  const terreinToRect = terrein => rect(min, max, 'green', 'black')(terrein);

  const terreinToImage = terrein => {
    const [[left, top], [right, bottom]] = [terrein.minimum, terrein.maximum];
    const bbox = [left, top, right, bottom].join(',');
    const size = {
      width: Math.floor(right - left) * Scale,
      height: Math.floor(bottom - top) * Scale,
    };
    const url = WMS.getMap(size.width, size.height, EPSG, bbox).split('&').join('&amp;');
    return image(url, min, max)(terrein);
  };

  const svg = `<svg ${width} ${height} ${viewPort} version="1.1" ${ns} ${xlink}>
${gebouwen.filter(notNull).map(polygon(min, max, 'black', 1)).join('\n')}
${wegsegmenten.filter(notNull).map(polyline(min, max, 'gray', 1)).join('\n')}
${wegobjecten.filter(notNull).map(rect(min, max)).join('\n')}

${terreinen.filter(notNull).map(functionsWithObject([terreinToRect, terreinToImage])).join('\n\n')}

${wegobjecten.filter(notNull).map(o => o.center).map(circle(min, max, 'red', 10, 'red', 10)).join('\n')}
${terreinen.filter(notNull).map(o => o.center).map(circle(min, max, 'green', 5, 'green', 5)).join('\n')}
${percelen.filter(notNull).map(circle(min, max, 'purple', 3, 'purple')).join('\n')}
</svg>`;
  fs.writeFileSync('test2.svg', svg);
  log('SVG generated');
  // log(WMS.getMap(500, 500, 'EPSG:31370', WMS.bbox([min.x, min.y, max.x, max.y])));
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
