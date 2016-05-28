import Color from './Color';

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

const polyline = (min, max, strokeColor = 'black', strokeWidth = 3) => ps => {
  const pss = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(max.y - p[1]) * Scale;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polyline points="${pss.join(' ')}" ${stroke} ${strokeW} />`;
};

const circle = ({ min, max, class: className }) => p => {
  const x = Math.floor(p[0] - min.x) * Scale;
  const y = Math.floor(max.y - p[1]) * Scale;
  const attributes = [
    `cx="${x}"`,
    `cy="${y}"`,
    `r="${1}"`,
  ];
  if (className) attributes.push(`class="${className}"`);
  return element('circle', attributes);
};

const rect = ({ min, max, class: className }) => bbox => {
  const x = Math.floor(bbox.minimum[0] - min.x) * Scale;
  const y = Math.floor(max.y - bbox.maximum[1]) * Scale;
  const w = Math.floor(bbox.maximum[0] - bbox.minimum[0]) * Scale;
  const h = Math.floor(bbox.maximum[1] - bbox.minimum[1]) * Scale;
  const attributes = [
    `x="${x}"`,
    `y="${y}"`,
    `width="${w}"`,
    `height="${h}"`,
  ];
  if (className) attributes.push(`class="${className}"`);
  return element('rect', attributes);
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
