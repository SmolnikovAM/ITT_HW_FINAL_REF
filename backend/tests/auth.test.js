import supertest from 'supertest';
import http from 'http';

import issueToken from './helpers/issueToken';

import createApp from '../app';
import { container, TYPES } from '../inversifyContainer';

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

  const resRefresshToken = await app.post('/api/auth/refresh').send({
    refreshToken: res.body.refreshToken,
  });

  expect(resRefresshToken.status).toEqual(200);
  expect(typeof resRefresshToken.body.token).toBe('string');
  expect(typeof resRefresshToken.body.refreshToken).toBe('string');
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
  await serverReady;
  const { RefreshToken } = container.get(TYPES.Repository);
  const { token } = await RefreshToken.findOne({ where: { id: 1 } });
  await RefreshToken.update({ status: 'ACTIVE' }, { where: { id: 1 } });

  const REFRESH_TOKEN = token;

  const res = await app.post('/api/auth/refresh').send({
    refreshToken: REFRESH_TOKEN,
  });

  expect(res.status).toEqual(200);
  expect(typeof res.body.token).toEqual('string');
  expect(typeof res.body.refreshToken).toEqual('string');
  expect(res.body.refreshToken).not.toEqual(REFRESH_TOKEN);
});

test('User get 400 on invalid request on refreshapi', async () => {
  const res = await app.post('/api/auth/refresh').send({
    refreshTokenNOVALID: 'something',
  });

  expect(res.status).toBe(400);
});

test('User get 404 on invalid refresh token', async () => {
  const REFRESH_TOKEN = 'REFRESH TOKEN NOT VALID';

  const res = await app.post('/api/auth/refresh').send({
    refreshToken: REFRESH_TOKEN,
  });

  expect(res.status).toBe(404);
});

test('User can use refresh token only once', async () => {
  await serverReady;
  const { RefreshToken } = container.get(TYPES.Repository);
  const { token } = await RefreshToken.findOne({ where: { id: 2 } });
  await RefreshToken.update({ status: 'ACTIVE' }, { where: { id: 2 } });
  const REFRESH_TOKEN = token;
  const res = await app.post('/api/auth/refresh').send({
    refreshToken: REFRESH_TOKEN,
  });

  const expected = {
    token: expect.any(String),
    refreshToken: expect.any(String),
  };

  expect(res.status).toEqual(200);
  expect(res.body).toMatchObject(expected);
  expect(res.body.refreshToken).not.toEqual(REFRESH_TOKEN);

  const resWithSameToken = await app.post('/api/auth/refresh').send({
    refreshToken: REFRESH_TOKEN,
  });

  expect(resWithSameToken.status).toBe(404);
  expect(resWithSameToken.body).toEqual(expect.not.objectContaining(expected));
});
test.skip('Refresh tokens become invalid on logout', async () => {});
test.skip('Multiple refresh tokens are valid', async () => {});
