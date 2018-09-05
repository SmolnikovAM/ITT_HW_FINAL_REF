import * as inversify from 'inversify';

import UserService from '.';

export const LOCALTYPES = {
  UserService: Symbol('UserService'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), UserService);

  inversify.decorate(inversify.inject(TYPES.Repository), UserService, 0);
  inversify.decorate(inversify.inject(TYPES.Errors), UserService, 1);

  container
    .bind(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();
}
