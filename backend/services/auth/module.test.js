import bcrypt from 'bcryptjs';

import AuthService from './index';
import { NotAuthorizedError } from '../../helpers/errors';

const PASSWORD = 'password';
const EMAIL = 'test@test.com';
const jwtSecret = 'secret';

const Repository = {
  UserRepository: {
    getUserByEmail({ email }) {
      if (email === EMAIL)
        return { password: bcrypt.hashSync(PASSWORD), email };
      return null;
    },
  },
  RefreshTokenRepository: {
    addTokenForUserId() {
      return Promise.resolve();
    },
  },
};

const authService = new AuthService(
  Repository,
  { jwtSecret },
  { NotAuthorizedError }
);

test('Unit. AuthService.login. Function login', async () => {
  expect(authService.login).toBeDefined();
});

test('Unit. AuthService.login. Password are equal', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toBeDefined();
});

test('Unit. AuthService.login. After ogin user does not have password field', async () => {
  const { user } = await authService.login({
    password: 'password',
    email: 'test@test.com',
  });

  const expected = { password: expect.any(String) };

  expect(user).toEqual(expect.not.objectContaining(expected));
});

test('error with wrong password', async () => {
  expect.assertions(1);
  try {
    await authService.login({ password: 'INVALID', email: 'test@test.com' });
  } catch (e) {
    expect(e).toBeInstanceOf(NotAuthorizedError);
  }
});

test('no such user', async () => {
  expect.assertions(1);
  try {
    await authService.login({ password: 'password', email: 'test@test1.com' });
  } catch (e) {
    expect(e).toBeInstanceOf(NotAuthorizedError);
  }
});
