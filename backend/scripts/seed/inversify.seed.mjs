import inversify from 'inversify';
import Seed from '.';

export const LOCALTYPES = {
  SeedTestValues: Symbol('SeedTestValues'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), Seed);
  inversify.decorate(inversify.inject(TYPES.Repository), Seed, 0);

  container
    .bind(TYPES.SeedTestValues)
    .to(Seed)
    .inSingletonScope();
}

// export function register({ container, TYPES }) {
//   inversify.decorate(inversify.injectable(), Model);

//   inversify.decorate(inversify.inject(TYPES.Config), Model, 0);
//   inversify.decorate(inversify.inject(TYPES.UserModel), Model, 1);

//   container
//     .bind(TYPES.Model)
//     .to(Model)
//     .inSingletonScope();
// }
