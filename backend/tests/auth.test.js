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
  expect(res.body).toEqual(
    expect.objectContaining({
      token: expect.any(String),
      refreshToken: expect.any(String),
    })
  );

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

test('Unauthorized user want to logout. throw 401', async () => {
  await serverReady;

  const res = await app.post('/api/auth/logout');

  expect(res.status).toBe(401);
});

test('Refresh tokens become invalid on logout', async () => {
  await serverReady;

  const { RefreshToken } = container.get(TYPES.Repository);
  await RefreshToken.update({ status: 'ACTIVE' }, { where: { userId: 2 } });

  const [refreshToken1, refreshToken2] = await RefreshToken.findAll({
    where: { userId: 2, status: 'ACTIVE' },
  });

  const res = await app
    .post('/api/auth/logout')
    .set('Authorization', `Bearer ${issueToken({ id: 2 })}`);

  expect(res.status).toBe(200);

  const resRefresh1 = await app
    .post('/api/auth/refresh')
    .send({ refreshToken: refreshToken1.token });
  expect(resRefresh1.status).toBe(404);

  const resRefresh2 = await app
    .post('/api/auth/refresh')
    .send({ refreshToken: refreshToken2.token });
  expect(resRefresh2.status).toBe(404);
});

test('Multiple refresh tokens are valid', async () => {
  await serverReady;

  const resLogin1 = await app.post('/api/auth/login').send({
    email: 'test3@test.com',
    password: 'password',
  });

  expect(resLogin1.status).toBe(200);

  const resLogin2 = await app.post('/api/auth/login').send({
    email: 'test3@test.com',
    password: 'password',
  });
  expect(resLogin2.status).toBe(200);

  const expected = {
    token: expect.any(String),
    refreshToken: expect.any(String),
  };

  const resRefresh1 = await app
    .post('/api/auth/refresh')
    .send({ refreshToken: resLogin1.body.refreshToken });
  expect(resRefresh1.status).toBe(200);
  expect(resRefresh1.body).toMatchObject(expected);

  const resRefresh2 = await app
    .post('/api/auth/refresh')
    .send({ refreshToken: resLogin2.body.refreshToken });
  expect(resRefresh2.status).toBe(200);
  expect(resRefresh2.body).toMatchObject(expected);
});
