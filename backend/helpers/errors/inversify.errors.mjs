import Errors from '.';

// const Errors = {};
// Object.keys(ErrorsModule).forEach(key => {
//   Errors[key] = Symbol(key);
// });

export const LOCALTYPES = {
  Errors: Symbol('Errors'),
};

export function register({ container, TYPES }) {
  container.bind(TYPES.Errors).toConstantValue(Errors);
}
