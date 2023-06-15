import { extend } from 'umi-request';
const request = extend({
  credential: 'omit',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export default request;
