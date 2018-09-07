import Router from 'koa-router';
// import Ajv from 'ajv';

import { container, TYPES } from '../../inversifyContainer';

// import addUserSchema from './addUserSchema';

// const {
//   BadRequestError,
//   LogicError,
//   NotAuthorizedError,
// NotFoundError,
// } = container.get(TYPES.Errors);

const router = new Router();
// const ajv = new Ajv({ allErrors: true });

const authCheck = (ctx, next) => {
  try {
    ctx.userId = ctx.state.user.id;
  } catch (e) {
    ctx.userId = null;
  }
  return next(ctx);
};

router.get('/info/:uuid', authCheck, async ctx => {
  const { userId } = ctx;
  const { uuid } = ctx.params;
  const VideoService = container.get(TYPES.VideoService);
  const video = await VideoService.getVideoByUuidForUser({ uuid, userId });
  ctx.body = video;
});

router.get('/play-video-file/:uuid', async ctx => {
  const { uuid } = ctx.params;
  const { userId } = ctx;
  const VideoService = container.get(TYPES.VideoService);
  const { video, file } = await VideoService.getVideoByFileUuidForUser({
    uuid,
    userId,
  });
  await VideoService.sendVideo(ctx, file, video);
});

router.put('/upload', async ctx => {
  // const VideoService = container.get(TYPES.VideoService);
  // ctx.body = `${VideoService.test()}`;
});

router.post('/update/:uuid', async ctx => {
  // const VideoService = container.get(TYPES.VideoService);
  // ctx.body = `${VideoService.test()}  ${ctx.params.uuid}`;
});

export default router;

// if (!ctx.state || !ctx.state.user) {
//   throw new NotAuthorizedError('You have to Authorize');
// }
// const { id: userId } = ctx.state.user;
// ctx.body = await UserService.getMyData({ userId });
