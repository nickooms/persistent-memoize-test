import Color from './Color';

/* const namespaces = [
  { prefix: 'svg', uri: 'http://www.w3.org/2000/svg' },
  { prefix: 'xlink', uri: 'http://www.w3.org/1999/xlink' },
];*/

/* const svg = ({ size, viewPort, content }) => {
  const { width, height } = size;
  const [svg, xlink] = namespaces;
  return `<svg ${width} ${height} ${viewPort} version="1.1" ${SVG} ${XLINK}>${content}</svg>`;
};*/

const Scale = 4.5;
const polygonFill = Color.random().toHex();
const polygonStroke = Color.random().toHex();

const element = (name, attributes) => `<${name} ${attributes.join(' ')} />`;

const polygon = (min, max, strokeColor = polygonStroke, strokeWidth = 3, fill = polygonFill) => ps => {
  const points = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(max.y - p[1]) * Scale;
    return [x, y];
  }).join(' ');
  return element('polygon', [
    `points="${points}"`,
    `stroke="${strokeColor}"`,
    `stroke-width="${strokeWidth}"`,
    `fill="${fill}"`,
  ]);
};

const polyline = (min, max, strokeColor = 'black', strokeWidth = 3/* , fill = 'red'*/) => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(max.y - p[1]) * Scale;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polyline points="${pss.join(' ')}" ${stroke} ${strokeW} />`;
};

const circle = (min, max, strokeColor = 'black', strokeWidth = 3, fill = 'red') => p => {
  const x = Math.floor(p[0] - min.x) * Scale;
  const y = Math.floor(max.y - p[1]) * Scale;
  return element('circle', [
    `cx="${x}"`,
    `cy="${y}"`,
    `r="${Math.max(1, strokeWidth)}"`,
    `stroke="${strokeColor}"`,
    `stroke-width="${strokeWidth}"`,
    `fill="${fill}"`,
  ]);
};

const rect = (
  min,
  max,
  fill = 'blue',
  stroke = 'pink',
  strokeWidth = 2,
  fillOpacity = 0.2,
  strokeOpacity = 0.8
) => bbox => {
  const x = Math.floor(bbox.minimum[0] - min.x) * Scale;
  const y = Math.floor(max.y - bbox.maximum[1]) * Scale;
  const w = Math.floor(bbox.maximum[0] - bbox.minimum[0]) * Scale;
  const h = Math.floor(bbox.maximum[1] - bbox.minimum[1]) * Scale;
  const style = [
    `fill:${fill}`,
    `stroke:${stroke}`,
    `stroke-width:${strokeWidth}`,
    `fill-opacity:${fillOpacity}`,
    `stroke-opacity:${strokeOpacity}`,
  ].join(';');
  return element('rect', [
    `x="${x}"`,
    `y="${y}"`,
    `width="${w}"`,
    `height="${h}"`,
    `style="${style}"`,
  ]);
};

const image = (url, min, max) => bbox => {
  const x = Math.floor(bbox.minimum[0] - min.x) * Scale;
  const y = Math.floor(max.y - bbox.maximum[1]) * Scale;
  const w = Math.floor(bbox.maximum[0] - bbox.minimum[0]) * Scale;
  const h = Math.floor(bbox.maximum[1] - bbox.minimum[1]) * Scale;
  return element('image', [
    `x="${x}"`,
    `y="${y}"`,
    `width="${w}"`,
    `height="${h}"`,
    `xlink:href="${url}"`,
  ]);
};

export { Scale, polyline, polygon, circle, rect, image };
