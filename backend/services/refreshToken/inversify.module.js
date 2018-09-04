import * as inversify from 'inversify';

import RefreshToken from '.';

export const LOCALTYPES = {
  RefreshTokenService: Symbol('RefreshTokenService'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), RefreshToken);

  inversify.decorate(inversify.inject(TYPES.Repository), RefreshToken, 0);
  inversify.decorate(inversify.inject(TYPES.Config), RefreshToken, 1);

  container
    .bind(TYPES.RefreshTokenService)
    .to(RefreshToken)
    .inSingletonScope();
}
