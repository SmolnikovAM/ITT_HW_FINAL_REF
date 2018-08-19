export default class Auth {
  constructor({ userRepository }, Errors) {
    this.userRepository = userRepository;
    this.Errors = Errors;
  }

  async login({ password: pass, email }) {
    const { NotAuthorizedError, NotFoundError } = this.Errors;
    const user = await this.userRepository.getUserByEmail({ email });
    if (!user) throw new NotFoundError();
    if (pass !== user.password) throw new NotAuthorizedError();

    const { password, ...rest } = user;
    return rest;
  }
}
