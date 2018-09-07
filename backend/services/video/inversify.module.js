import * as inversify from 'inversify';

import VideoService from '.';

export const LOCALTYPES = {
  VideoService: Symbol('VideoService'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), VideoService);

  inversify.decorate(inversify.inject(TYPES.Repository), VideoService, 0);
  inversify.decorate(inversify.inject(TYPES.Errors), VideoService, 1);
  inversify.decorate(inversify.inject(TYPES.Config), VideoService, 2);

  container
    .bind(TYPES.VideoService)
    .to(VideoService)
    .inSingletonScope();
}
