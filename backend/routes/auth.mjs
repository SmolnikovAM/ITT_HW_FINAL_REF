import Router from 'koa-router';

import { container, TYPES } from '../inversifyContainer';

const router = new Router();

router.get('/:id', async ctx => {
  const { id } = ctx.params;
  const User = container.get(TYPES.UserModel);
  const userId = await User.findOne({ where: { id } });
  ctx.body = JSON.stringify(userId);
});

router.post('/login', async ctx => {
  const { email, password } = ctx.request.body;
  const authService = container.get(TYPES.AuthService);
  try {
    await authService.login({ email, password });
    ctx.body = 'super';
  } catch (e) {
    ctx.body = 'bad';
  }
});

export default router;
