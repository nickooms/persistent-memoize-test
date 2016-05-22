// import request from 'request';
// import { parse } from '../parse';
import { doReq } from '../req';

/* const doReq = (operation, parameters) => new Promise((resolve, reject) => {
  request(req(operation, parameters), (error, response, body) => {
    if (error) reject(new Error('request failed:', error));
    resolve(parse(body));
  });
});*/

describe('WS-CRAB', () => {
  beforeEach(() => {});

  describe('Talen', () => {
    it('should get 3 Talen', done => {
      doReq('ListTalen', { SorteerVeld: 0 })
      .then(talen => expect(talen.length).toEqual(3))
      .then(done);
      /* request(req('ListTalen', { SorteerVeld: 0 }), (error, response, body) => {
        if (error) throw new Error('POST failed:', error);
        const talen = parse(body);
        expect(talen.length).toEqual(3);
        return done();
      });*/
    });
  });
});
