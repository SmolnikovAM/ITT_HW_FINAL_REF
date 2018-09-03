import config from '.';

export const LOCALTYPES = {
  Config: Symbol('Config'),
};

export function register({ container, TYPES }) {
  container.bind(TYPES.Config).toConstantValue(config);
}
