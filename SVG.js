import Color from './Color';

const Scale = 4.5;
const polygonFill = Color.random().toHex();
const polygonStroke = Color.random().toHex();

const element = (name, attributes) => `<${name} ${attributes.join(' ')} />`;

const polygon = (min, strokeColor = polygonStroke, strokeWidth = 3, fill = polygonFill) => ps => {
  const points = ps.map(p => {
    const x = Math.floor(p[0] - min.x) * Scale;
    const y = Math.floor(p[1] - min.y) * Scale;
    return [x, y];
  }).join(' ');
  return element('polygon', [
    `points="${points}"`,
    `stroke="${strokeColor}"`,
    `stroke-width="${strokeWidth}"`,
    `fill="${fill}"`,
  ]);
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
  const x = Math.floor(p[0] - min.x) * Scale;
  const y = Math.floor(p[1] - min.y) * Scale;
  return element('circle', [
    `cx="${x}"`,
    `cy="${y}"`,
    `r="${Math.max(1, strokeWidth)}"`,
    `stroke="${strokeColor}"`,
    `stroke-width="${strokeWidth}"`,
    `fill="${fill}"`,
  ]);
};

export { Scale, polyline, polygon, circle };
