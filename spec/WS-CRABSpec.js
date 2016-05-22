import request from 'request';
import { parse } from '../parse';

const method = 'POST';
const url = 'http://crab.agiv.be/Examples/Home/ExecOperation';

const getParams = params => Object.keys(params).map(key => ({ Name: key, Value: params[key] }));

const req = (operation, parameters) => {
  const parametersJson = JSON.stringify(getParams(parameters));
  const form = { operation, parametersJson };
  return { method, url, form };
};

describe('WS-CRAB', () => {
  beforeEach(() => {});

  describe('Talen', () => {
    it('should get 3 Talen', done => {
      request(req('ListTalen', { SorteerVeld: 0 }), (error, response, body) => {
        if (error) throw new Error('POST failed:', error);
        const talen = parse(body);
        expect(talen.length).toEqual(3);
        return done();
      });
    });
  });
});
