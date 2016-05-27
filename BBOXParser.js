import BBOX from './BBOX';

const Signatures = {
  MinimumMaximum: 'minimum,maximum',
};

export default class BBOXParser {
  static [Signatures.MinimumMaximum]([minimum, maximum]) {
    const [[left, top], [right, bottom]] = [minimum, maximum];
    return new BBOX(left, top, right, bottom);
  }
}
