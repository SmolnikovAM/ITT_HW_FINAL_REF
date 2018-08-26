import * as Errors from '.';

// console.log(Errors);
export const LOCALTYPES = {
  Errors: Symbol('Errors'),
};

export function register({ container, TYPES }) {
  container.bind(TYPES.Errors).toConstantValue(Errors);
}
