import AuthService from './index';

const Repository = {
  userRepository: {
    getUserByEmail({ email }) {
      return { password: 'password', email };
    },
  },
};

const authService = new AuthService(Repository);

test('login defined', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toEqual({ email: 'test@test.com' });
});

test('password are equal', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toEqual({ email: 'test@test.com' });
});

test('login result does not have password field', async () => {
  expect(
    await authService.login({ password: 'password', email: 'test@test.com' })
  ).toEqual({ email: 'test@test.com' });
});
