import Router from 'koa-router';
import Ajv from 'ajv';

import { container, TYPES } from '../../inversifyContainer';

import addUserSchema from './addUserSchema';

const {
  BadRequestError,
  LogicError,
  NotAuthorizedError,
  // NotFoundError,
} = container.get(TYPES.Errors);

const router = new Router();
const ajv = new Ajv({ allErrors: true });

router.get('/mydata', async ctx => {
  if (!ctx.state || !ctx.state.user) {
    throw new NotAuthorizedError('You have to Authorize');
  }
  const { id: userId } = ctx.state.user;
  const UserService = container.get(TYPES.UserService);

  ctx.body = await UserService.getMyData({ userId });
});

router.post('/add', async ctx => {
  if (ctx.state && ctx.state.user) {
    throw new LogicError('Authorized user cannot create user');
  }
  if (!ajv.validate(addUserSchema, ctx.request.body)) {
    throw new BadRequestError(ajv.errors);
  }
  const { password1, password2, email, name } = ctx.request.body;
  if (password1 !== password2) {
    throw new LogicError('Passwords are not equal');
  }
  const UserService = container.get(TYPES.UserService);
  await UserService.addUser({ password: password1, email, name });
  ctx.body = 'user added';
});

export default router;
