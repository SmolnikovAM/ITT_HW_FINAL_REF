import supertest from 'supertest';
import http from 'http';

import issueToken from './helpers/issueToken';

import createApp from '../app';

let app;
let serverReadyFn;
const serverReady = new Promise(res => {
  serverReadyFn = res;
});

const authLine = `Bearer ${issueToken({ id: 1 })}`;

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
  expect(typeof res.body.refreshToken).toBe('string');
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

test('User get authorized data', async () => {
  await serverReady;
  const res = await app.get('/api/auth/mydata').set('Authorization', authLine);
  const expected = { password: expect.any(String) };

  expect(res.status).toEqual(200);
  expect(res.body).toEqual(expect.not.objectContaining(expected));
});

test('User receives 401 on expired token. Check good connection of middleware', async () => {
  await serverReady;
  const expiredToken = issueToken({ id: 1 }, { expiresIn: '1ms' });

  const res = await app
    .get('/api/auth/mydata')
    .set('Authorization', `Bearer ${expiredToken}`);

  expect(res.status).toEqual(401);
});

test('User can get new access token using refresh token', async () => {
  const REFRESH_TOKEN = 'REFRESH TOKEN 1';

  const res = await app.post('/api/auth/refresh').send({
    refreshToken: REFRESH_TOKEN,
  });

  expect(res.status).toEqual(200);
  expect(typeof res.body.token).toEqual('string');
  expect(typeof res.body.refreshToken).toEqual('string');
  expect(res.body.refreshToken).not.toEqual(REFRESH_TOKEN);
});

test.skip('User get 404 on invalid refresh token', async () => {});
test.skip('User can use refresh token only once', async () => {});
test.skip('Refresh tokens become invalid on logout', async () => {});
test.skip('Multiple refresh tokens are valid', async () => {});
