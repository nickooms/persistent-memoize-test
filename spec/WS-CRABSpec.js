import { doReq } from '../req';

// const unique = array => ([...new Set(array)]);

class Talen {
  static list = ({ SorteerVeld = 0 } = {}) => doReq('ListTalen', { SorteerVeld });
}

describe('WS-CRAB', () => {
  describe('Talen', () => {
    it('should find 3 Talen', done => Talen.list()
      .then(list => expect(list.length).toEqual(3)).then(done));
  });
});
