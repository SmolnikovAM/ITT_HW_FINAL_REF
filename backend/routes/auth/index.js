import Router from 'koa-router';
import Ajv from 'ajv';

import { container, TYPES } from '../../inversifyContainer';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
} from '../../helpers/errors';

import loginSchema from './loginSchema';
import refreshSchema from './refreshSchema';

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
  const { refreshToken, token } = await authService.login({
    email,
    password,
  });

  ctx.body = { refreshToken, token };
});

router.post('/refresh', async ctx => {
  if (!ajv.validate(refreshSchema, ctx.request.body)) {
    throw new BadRequestError(ajv.errors);
  }
  const { refreshToken } = ctx.request.body;
  const authService = container.get(TYPES.AuthService);
  const tokenItem = await authService.findRefreshToken({ token: refreshToken });
  if (!tokenItem) {
    throw new NotFoundError('Token not found');
  }
  const { userId, token } = tokenItem;
  await authService.removeRefreshToken({ token });
  ctx.body = await authService.issueTokensForUserId({
    userId,
  });
});

router.post('/logout', async ctx => {
  if (!ctx.state || !ctx.state.user) {
    throw new NotAuthorizedError();
  }
  const { id: userId } = ctx.state.user;
  const authService = container.get(TYPES.AuthService);
  await authService.removeRefreshTokenForUser({ userId });
  ctx.body = 'Logout success';
});

export default router;
