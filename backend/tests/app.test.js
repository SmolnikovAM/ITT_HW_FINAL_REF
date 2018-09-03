import supertest from 'supertest';
import http from 'http';

import createApp from '../app';
import { container, TYPES } from '../inversifyContainer';

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

test('Check test enviroment', async () => {
  await serverReady;

  const config = container.get(TYPES.Config);

  expect(config.test).toEqual(true);
  expect(config.autostart).toEqual(false);
});
