import bcrypt from 'bcryptjs';

import AuthService from './index';
import { NotAuthorizedError } from '../../helpers/errors';

const PASSWORD = 'password';
const EMAIL = 'test@test.com';
const jwtSecret = 'secret';

const Repository = {
  userRepository: {
    getUserByEmail({ email }) {
      if (email === EMAIL)
        return { password: bcrypt.hashSync(PASSWORD), email };
      return null;
    },
  },
};

const authService = new AuthService(Repository, { jwtSecret });

test('login defined', async () => {
  expect(authService.login).toBeDefined();
});

test('password are equal', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toBeDefined();
});

test('after login user does not have password field', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toEqual({ email: 'test@test.com' });
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
