import Koa from 'koa';
import cors from '@koa/cors';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
// import db from './db';

import config from './config';

const app = new Koa();

const demoRouter = new Router();

demoRouter.get('/', ctx => {
  ctx.body = 'hello world';
});

app.use(cors());
app.use(demoRouter.allowedMethods());
app.use(demoRouter.routes());

console.log(config.port);

app.listen(config.port, (...srg) => console.log(srg));
