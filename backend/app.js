import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import jwtMiddleware from 'koa-jwt';
import koaStaticMiddleware from 'koa-static';

// import fs from 'fs';
import { container, TYPES } from './inversifyContainer';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import videoRouter from './routes/video';

const config = container.get(TYPES.Config);

async function createApp() {
  await container.get(TYPES.Repository).done;

  const app = new Koa();
  const mainRouter = new Router();
  const apiRouter = new Router();

  app.use(cors());
  app.use(bodyParser());

  // app.use((ctx, next) => {
  //   return next().catch(err => {
  //     if (401 == err.status) {
  //       ctx.status = 401;
  //       console.log(err);
  //       ctx.body =
  //         'Protected resource, use Authorization header to get access\n';
  //     } else {
  //       throw err;
  //     }
  //   });
  // });

  mainRouter.use(
    jwtMiddleware({
      secret: config.jwtSecret,
      passthrough: true,
    })
  );

  apiRouter.use('/auth', authRouter.routes(), authRouter.allowedMethods());
  apiRouter.use('/user', userRouter.routes(), userRouter.allowedMethods());
  apiRouter.use('/video', videoRouter.routes(), videoRouter.allowedMethods());

  mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

  mainRouter.get('/testserver', ctx => {
    ctx.body = 'ok';
  });

  app.use(mainRouter.allowedMethods());
  app.use(mainRouter.routes());

  app.use(koaStaticMiddleware(config.staticFolder));

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
