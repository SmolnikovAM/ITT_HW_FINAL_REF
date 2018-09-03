import Router from 'koa-router';
import Ajv from 'ajv';

import { container, TYPES } from '../../inversifyContainer';
import { BadRequestError } from '../../helpers/errors';
import loginSchema from './loginSchema';

const ajv = new Ajv({ allErrors: true });

const router = new Router();

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  const User = container.get(TYPES.UserModel);
  const userId = await User.findOne({ where: { id } });
  ctx.body = JSON.stringify(userId);
});

router.post('/login', async ctx => {
  if (!ajv.validate(loginSchema, ctx.request.body)) {
    throw new BadRequestError(ajv.errors);
  }
  console.log(ctx.state.user);
  const { email, password } = ctx.request.body;
  const authService = container.get(TYPES.AuthService);
  const { refreshTocken, token } = await authService.login({
    email,
    password,
  });

  ctx.body = { refreshTocken, token };
});

export default router;
