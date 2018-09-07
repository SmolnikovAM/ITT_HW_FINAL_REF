import supertest from 'supertest';
import http from 'http';
import uuid from 'uuid/v4';

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

beforeEach(async done => {
  await serverReady;
  done();
});

test('Create new user', async () => {
  const EMAIL = 'TEST_EMAIL_FOR_CREATION_USER@mail.com';
  const { User, RefreshToken } = container.get(TYPES.Repository);
  const user = await User.findOne({ where: { email: EMAIL } });
  if (user) {
    await RefreshToken.destroy({ where: { userId: user.id } });
    await User.destroy({ where: { id: user.id } });
  }

  const resCreateUser = await app.post('/api/user/add').send({
    email: EMAIL,
    password1: 'password',
    password2: 'password',
    name: 'Test user name',
  });

  expect(resCreateUser.status).toEqual(200);

  const resLogin = await app.post('/api/auth/login').send({
    email: EMAIL,
    password: 'password',
  });

  expect(resLogin.status).toEqual(200);
  expect(resLogin.body).toEqual(
    expect.objectContaining({
      token: expect.any(String),
      refreshToken: expect.any(String),
    })
  );
});

test('User get authorized data', async () => {
  const res = await app.get('/api/user/mydata').set('Authorization', authLine);
  const expected = { password: expect.any(String) };

  expect(res.status).toEqual(200);
  expect(res.body).toEqual(expect.not.objectContaining(expected));
});

test('User receives 401 on expired token. Check good connection of middleware', async () => {
  const expiredToken = issueToken({ id: 1 }, { expiresIn: '1ms' });

  const res = await app
    .get('/api/user/mydata')
    .set('Authorization', `Bearer ${expiredToken}`);

  expect(res.status).toEqual(401);
});

test('User cannot create new account if he already logged. Expect 400', async () => {
  const EMAIL = `${uuid()}@test.com`;
  const resCreateUser = await app
    .post('/api/user/add')
    .set('Authorization', authLine)
    .send({
      email: EMAIL,
      password1: 'password',
      password2: 'password',
      name: 'Test user name',
    });

  expect(resCreateUser.status).toEqual(400);
});

test('User cannot create new account if email alredy in use. Expect 400 ', async () => {
  const EMAIL = `test@test.com`;
  const resCreateUser = await app
    .post('/api/user/add')
    .set('Authorization', authLine)
    .send({
      email: EMAIL,
      password1: 'password',
      password2: 'password',
      name: 'Test user name',
    });

  expect(resCreateUser.status).toEqual(400);
});

test('User cannot create new account with not equal passwords. Expect 400 ', async () => {
  const EMAIL = `${uuid()}@test.com`;
  const resCreateUser = await app
    .post('/api/user/add')
    .set('Authorization', authLine)
    .send({
      email: EMAIL,
      password1: 'password',
      password2: 'NOTEQUALPASSWORD',
      name: 'Test user name',
    });

  expect(resCreateUser.status).toEqual(400);
});

test('User cannot create new account with not valid body format. Expect 400 ', async () => {
  const EMAIL = `${uuid()}@test.com`;
  const resCreateUser = await app
    .post('/api/user/add')
    .set('Authorization', authLine)
    .send({
      email: EMAIL,
      passwordNOTVALIDFORMAT: 'password',
      password2: 'NOTEQUALPASSWORD',
      name: 'Test user name',
    });

  expect(resCreateUser.status).toEqual(400);
  // console.log(resCreateUser.body);
});
