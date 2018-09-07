import supertest from 'supertest';
import http from 'http';
// import uuid from 'uuid/v4';

import issueToken from './helpers/issueToken';

import createApp from '../app';
// import { container, TYPES } from '../inversifyContainer';

let app;
let serverReadyFn;
const serverReady = new Promise(res => {
  serverReadyFn = res;
});

// const authLine = `Bearer ${issueToken({ id: 1 })}`;

createApp()
  .then(a => {
    app = supertest.agent(http.createServer(a.callback()));
  })
  .then(serverReadyFn);

beforeEach(async done => {
  await serverReady;
  done();
});

const expectedVideoInformation = expect.objectContaining({
  name: expect.anything(String),
  about: expect.anything(String),
  image: expect.anything(String),
  tag: expect.anything(String),
  uuid: expect.anything(String),
  videoFiles: expect.arrayContaining([
    expect.objectContaining({
      uuid: expect.anything(String),
      resolution: expect.anything(String),
      status: expect.stringMatching(/^((?!TODELETE).)*$/),
      // not.toBe('TODELETE'),
    }),
  ]),
});

test('Not authorized user can get public video inforamtion', async () => {
  const res = await app.get(`/api/video/info/UUID01_PUBLIC`);
  expect(res.status).toBe(200);
  expect(res.body).toEqual(expectedVideoInformation);
});

test('User get information about public video', async () => {
  const res = await app
    .get(`/api/video/info/UUID01_PUBLIC`) // video of 1 user
    .set('Authorization', `Bearer ${issueToken({ id: 2 })}`);

  expect(res.status).toBe(200);
  expect(res.body).toEqual(expectedVideoInformation);
});

test('User cannot get information with private video of another user', async () => {
  const res = await app
    .get(`/api/video/info/UUID02_PRIVATE`) // video of 1 user
    .set('Authorization', `Bearer ${issueToken({ id: 2 })}`);

  expect(res.status).toBe(403);
});

test('Not authorized user cannot get private video', async () => {
  const res = await app.get(`/api/video/info/UUID02_PRIVATE`); // video of 1 user
  expect(res.status).toBe(403);
});

test('Owner get information about his private video', async () => {
  const res = await app
    .get(`/api/video/info/UUID02_PRIVATE`) // video of 1 user
    .set('Authorization', `Bearer ${issueToken({ id: 1 })}`);

  expect(res.status).toBe(200);
  expect(res.body).toEqual(expectedVideoInformation);
});

test('No authorized user can get public video file', async () => {
  const res = await app.get('/api/video/play-video-file/test_video_1_file_1');
  expect(res.status).toBe(200);
  expect(res.body).toEqual(Buffer.from('1234567890'));
});

test.skip('User can get public video file', async () => {});
test.skip('User cannot get private video file of another user', async () => {});
test.skip('No authorized user cannot get private video file', async () => {});
test.skip('Player can get part of video', async () => {});
test.skip('User can upload video file', async () => {});
test.skip('User gets notification after convertion of video', async () => {});
test.skip('User can modify information about video', async () => {});
test.skip('User can delete video. Access denyy to anybody/', async () => {});
test.skip('User can change status of video. public -> private.', async () => {});
test.skip('User can change status of video. private -> public.', async () => {});
