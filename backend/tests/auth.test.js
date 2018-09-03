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

test('User can succesfully login', async () => {
  await serverReady;
  const res = await app.post('/api/auth/login').send({
    email: 'test@test.com',
    password: 'password',
  });

  expect(res.status).toEqual(200);
  expect(typeof res.body.token).toBe('string');
});

test('Error login works. Bad password.', async () => {
  await serverReady;
  const res = await app.post('/api/auth/login').send({
    email: 'test@test.com',
    password: 'NOTVALID',
  });

  expect(res.status).toEqual(401);
});

//   test('User gets 403 on invalid credentials', async t => {
test('Error login works.  No user.', async () => {
  await serverReady;
  const res = await app.post('/api/auth/login').send({
    email: 'notvalid@notvalid.com',
    password: 'NOTVALID',
  });

  expect(res.status).toEqual(401);
});

test('User receives 401 on expired token', async () => {});
//   test('User can get new access token using refresh token', async () => {})
//   test('User get 404 on invalid refresh token', async () => {})
//   test('User can use refresh token only once', async () => {})
//   test('Refresh tokens become invalid on logout', async () => {})
//   test('Multiple refresh tokens are valid', async () => {})
