import inversify from 'inversify';
import Repository from '.';

export const LOCALTYPES = {
  Repository: Symbol('Repository'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), Repository);

  inversify.decorate(inversify.inject(TYPES.Config), Repository, 0);
  inversify.decorate(inversify.inject(TYPES.Errors), Repository, 1);

  container
    .bind(TYPES.Repository)
    .to(Repository)
    .inSingletonScope();
}
