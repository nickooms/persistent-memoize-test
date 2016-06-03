import request from 'request';
import { parse } from './parse';

const method = 'POST';
const url = 'http://crab.agiv.be/Examples/Home/ExecOperation';

const getParams = params => Object.keys(params).map(key => ({ Name: key, Value: params[key] }));

const req = (operation, parameters) => {
  const parametersJson = JSON.stringify(getParams(parameters));
  const form = { operation, parametersJson };
  return { method, url, form };
};

const doReq = (operation, parameters) => new Promise((resolve, reject) => {
  request(req(operation, parameters), (error, response, body) => {
    if (error) console.log(error);
    if (error) reject(new Error('request failed:', error));
    resolve(parse(body));
  });
});

export { doReq };
