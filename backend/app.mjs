import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { container, TYPES } from './inversifyContainer';

import authRouter from './routes/auth';

const Config = container.get(TYPES.Config);
async function start() {
  await container.get(TYPES.Repository).done;
  if (Config.insertTestValues) {
    await container.get(TYPES.SeedTestValues).done;
  }
}

start();

const app = new Koa();

const mainRouter = new Router();
const apiRouter = new Router();

app.use(cors());
app.use(bodyParser());
apiRouter.use('/auth', authRouter.routes(), authRouter.allowedMethods());
mainRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
app.use(mainRouter.allowedMethods());
app.use(mainRouter.routes());

app.listen(Config.port, () =>
  console.log(`start application on port ${Config.port}`)
);
