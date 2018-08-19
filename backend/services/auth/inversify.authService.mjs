import inversify from 'inversify';

import AuthService from '.';

export const LOCALTYPES = {
  AuthService: Symbol('AuthService'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), AuthService);

  inversify.decorate(inversify.inject(TYPES.Repository), AuthService, 0);
  inversify.decorate(inversify.inject(TYPES.Errors), AuthService, 1);

  container
    .bind(TYPES.AuthService)
    .to(AuthService)
    .inSingletonScope();
}
