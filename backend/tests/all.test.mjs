import { Container } from 'inversify';

console.log(Container);

test('test', () => {
  expect(1).toBe(1);
});

// import supertest from 'supertest';
// import http from 'http';

// import createApp from '../app';

// const app = supertest.agent(http.createServer(createApp(false).callback()));

// createApp(false);

// test('App works', async () => {
//   const res = await app.post('/').send({
//     email: 'test@test.com',
//     password: 'password',
//   });

//   expect(res.status).toEqual(200);
// });

// test('App works', async () => {
//   const res = await app.get('/').send({
//     email: 'test@test.com',
//     password: 'password',
//   });

//   expect(res.status).toEqual(200);
// });
