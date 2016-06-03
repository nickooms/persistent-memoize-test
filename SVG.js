const Scale = 4.5;

class SVG {
  constructor({ width, height, viewPort = null, css, children = [] }) {
    this.width = width;
    this.height = height;
    this.viewPort = viewPort || `0 0 ${width} ${height}`;
    this.css = css;
    this.children = children;
  }

  toString() {
    const ns = 'xmlns="http://www.w3.org/2000/svg"';
    const xlink = 'xmlns:xlink="http://www.w3.org/1999/xlink"';
    const width = `width="${this.width}"`;
    const height = `height="${this.height}"`;
    const children = this.children.map(child => child.toString()).join('\n');
    return `<svg ${width} ${height} viewPort="${this.viewPort}" version="1.1" ${ns} ${xlink}>
${this.css.toString()}
${children}
</svg>`;
  }
}

const element = (name, attributes) => `<${name} ${attributes.join(' ')} />`;

const polygon = ({ min, max, class: className }) => ps => {
  const points = ps.map(point => {
    const x = Math.floor(point[0] - min.x) * Scale;
    const y = Math.floor(max.y - point[1]) * Scale;
    return [x, y];
  }).join(' ');
  const attributes = [
    `points="${points}"`,
  ];
  if (className) attributes.push(`class="${className}"`);
  return element('polygon', attributes);
};

const polyline = (min, max, strokeColor = 'black', strokeWidth = 3) => ps => {
  const pss = ps.map(point => {
    const x = Math.floor(point[0] - min.x) * Scale;
    const y = Math.floor(max.y - point[1]) * Scale;
    return [x, y];
  });
  const stroke = `stroke="${strokeColor}"`;
  const strokeW = `stroke-width="${strokeWidth}"`;
  return `  <polyline points="${pss.join(' ')}" ${stroke} ${strokeW} />`;
};

const circle = ({ min, max, r = 1, class: className }) => p => {
  const cx = Math.floor(p[0] - min.x) * Scale;
  const cy = Math.floor(max.y - p[1]) * Scale;
  const attributes = [
    `cx="${cx}"`,
    `cy="${cy}"`,
    `r="${r}"`,
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

const image = (url, min, max, src) => bbox => {
  const x = Math.floor(bbox.minimum[0] - min.x) * Scale;
  const y = Math.floor(max.y - bbox.maximum[1]) * Scale;
  const width = Math.floor(bbox.maximum[0] - bbox.minimum[0]) * Scale;
  const height = Math.floor(bbox.maximum[1] - bbox.minimum[1]) * Scale;
  return /* return promise.then(data => */element('image', [
    `x="${x}"`,
    `y="${y}"`,
    `width="${width}"`,
    `height="${height}"`,
    `xlink:href="${src}"`,
  ]);
};

export { Scale, SVG, polyline, polygon, circle, rect, image };
