import inversify from 'inversify';

import Model from '.';

export const LOCALTYPES = {
  Model: Symbol('Model'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), Model);

  inversify.decorate(inversify.inject(TYPES.Config), Model, 0);
  inversify.decorate(inversify.inject(TYPES.UserModel), Model, 1);

  container
    .bind(TYPES.Model)
    .to(Model)
    .inSingletonScope();
}
