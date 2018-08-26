import AuthService from './index';
import { NotAuthorizedError, NotFoundError } from '../../helpers/errors';

// import  from '../../helpers/errors';

// console.log(Errors);

// const { NotAuthorizedError, NotFoundError } = Errors;

const PASSWORD = 'password';
const EMAIL = 'test@test.com';

const Repository = {
  userRepository: {
    getUserByEmail({ email }) {
      if (email === EMAIL) return { password: PASSWORD, email };
      return null;
    },
  },
};

const authService = new AuthService(Repository);

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
    await authService.login({ password: 'password1', email: 'test@test.com' });
  } catch (e) {
    expect(e).toBeInstanceOf(NotAuthorizedError);
  }
});

test('no such user', async () => {
  expect.assertions(1);
  try {
    await authService.login({ password: 'password', email: 'test@test1.com' });
  } catch (e) {
    expect(e).toBeInstanceOf(NotFoundError);
  }
});
