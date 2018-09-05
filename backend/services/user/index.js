import bcrypt from 'bcryptjs';

export default class User {
  constructor({ UserRepository }, { LogicError, NotFoundError }) {
    this.LogicError = LogicError;
    this.UserRepository = UserRepository;
    this.NotFoundError = NotFoundError;
  }

  async addUser({ password: passwordOrigin, email, name }) {
    const userExists = await this.UserRepository.getUserByEmail({ email });
    if (userExists) {
      throw new this.LogicError('Already have such user');
    }
    const password = bcrypt.hashSync(passwordOrigin);
    return this.UserRepository.addUser({ password, name, email });
  }

  async getMyData({ userId }) {
    const user = await this.UserRepository.getUserById(userId);
    if (!user) {
      throw new this.NotFoundError(`No user with such id ${userId}`);
    }
    const { password, ...rest } = user;
    return rest;
  }
}
