// import * as inversify from 'inversify';

// console.log(inversify);

// test('test', () => {
//   expect(1).toBe(1);
// });

import supertest from 'supertest';
import http from 'http';

import createApp from '../app';

let app;
let serverReadyFn;
const serverReady = new Promise(res => {
  serverReadyFn = res;
});

createApp()
  .then(a => {
    app = supertest.agent(http.createServer(a.callback()));
  })
  .then(serverReadyFn);

test('App works', async () => {
  await serverReady;
  const res = await app.get('/testserver');

  expect(res.status).toEqual(200);
});

test('login works', async () => {
  const res = await app.post('/api/auth/login').send({
    email: 'test@test.com',
    password: 'password',
  });

  expect(res.status).toEqual(200);
});

test('error login works', async () => {
  const res = await app.post('/api/auth/login').send({
    email: 'test@test.com',
    password: 'NOTVALID',
  });

  expect(res.status).toEqual(401);
});
