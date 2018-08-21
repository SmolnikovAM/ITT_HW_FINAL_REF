import Errors from '../../helpers/errors';

const { NotAuthorizedError, NotFoundError } = Errors;

export default class Auth {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
  }

  async login({ password: pass, email }) {
    const user = await this.userRepository.getUserByEmail({ email });
    if (!user) throw new NotFoundError();
    if (pass !== user.password) throw new NotAuthorizedError();

    const { password, ...rest } = user;
    return rest;
  }
}
