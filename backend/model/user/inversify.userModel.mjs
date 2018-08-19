import userCreate from '.';

export const LOCALTYPES = {
  UserModel: Symbol('UserModel'),
};

export function register({ container, TYPES }) {
  const user = userCreate(container.get(TYPES.Sequelize));
  container.bind(TYPES.UserModel).toConstantValue(user);
}
