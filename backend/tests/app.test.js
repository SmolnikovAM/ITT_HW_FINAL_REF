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
  // app = supertest.agent(http.createServer(a.callback()));
  await serverReady;
  const res = await app.get('/testserver');
  expect(res.status).toEqual(200);
});
