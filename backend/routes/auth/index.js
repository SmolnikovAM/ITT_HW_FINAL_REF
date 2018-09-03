import Router from 'koa-router';
import Ajv from 'ajv';

import { container, TYPES } from '../../inversifyContainer';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '../../helpers/errors';
import loginSchema from './loginSchema';

const ajv = new Ajv({ allErrors: true });

const router = new Router();

router.get('/mydata', async ctx => {
  if (!ctx.state || !ctx.state.user) {
    throw new NotAuthorizedError('You have to Authorize');
  }
  const { id: userId } = ctx.state.user;
  const { UserRepository } = container.get(TYPES.Repository);
  try {
    const { password, ...user } = await UserRepository.getUserById(userId);
    ctx.body = user;
  } catch (e) {
    throw new NotFoundError(`No user with such id ${userId}`);
  }
});

router.post('/login', async ctx => {
  if (!ajv.validate(loginSchema, ctx.request.body)) {
    throw new BadRequestError(ajv.errors);
  }
  const { email, password } = ctx.request.body;
  const authService = container.get(TYPES.AuthService);
  const { refreshTocken, token } = await authService.login({
    email,
    password,
  });

  ctx.body = { refreshTocken, token };
});

export default router;
