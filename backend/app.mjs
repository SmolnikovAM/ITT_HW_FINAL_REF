import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { container, TYPES } from './inversifyContainer';

import authRouter from './routes/auth';

const config = container.get(TYPES.Config);

async function createApp(start) {
  await container.get(TYPES.Repository).done;

  const app = new Koa();
  const mainRouter = new Router();
  const apiRouter = new Router();

  mainRouter.get('/', ctx => {
    ctx.body = 'ok';
  });

  app.use(cors());
  app.use(bodyParser());
  apiRouter.use('/auth', authRouter.routes(), authRouter.allowedMethods());
  mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
  app.use(mainRouter.allowedMethods());
  app.use(mainRouter.routes());

  if (start) {
    app.listen(config.port, () =>
      global.console.log(`start server on port: ${config.port}`)
    );
  }

  return app;
}

if (!config.test) {
  createApp(true);
}

export default createApp;
