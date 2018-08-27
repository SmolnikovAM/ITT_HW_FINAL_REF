import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
// import fs from 'fs';
import { container, TYPES } from './inversifyContainer';

import authRouter from './routes/auth';

const config = container.get(TYPES.Config);

async function createApp() {
  await container.get(TYPES.Repository).done;

  const app = new Koa();
  const mainRouter = new Router();
  const apiRouter = new Router();

  mainRouter.get('/testserver', ctx => {
    ctx.body = 'ok';
  });

  app.use(cors());
  app.use(bodyParser());
  apiRouter.use('/auth', authRouter.routes(), authRouter.allowedMethods());
  mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
  app.use(mainRouter.allowedMethods());
  app.use(mainRouter.routes());

  return app;
}

async function startServer() {
  (await createApp()).listen(config.port, () =>
    global.console.log(`start server on port: ${config.port}`)
  );
}

if (config.autostart) {
  startServer();
}

// fs.writeFileSync('./log.txt', `config.test - ${JSON.stringify(config)}\n`, {
//   flag: 'a',
// });

export default createApp;
