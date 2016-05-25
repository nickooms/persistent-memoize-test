export default class Color {
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
    .map(channel => channel.toString(16))
    .map(hexChannel => '0'.repeat(2 - hexChannel.length) + hexChannel)
    .join('')}`;
};
