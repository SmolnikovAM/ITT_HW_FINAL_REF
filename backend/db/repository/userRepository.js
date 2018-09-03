// import Errors from '../../helpers/errors';

export default class UserRepository {
  constructor(User) {
    this.User = User;
  }

  async getUserById(id) {
    const user = await this.User.findOne({ where: { id } });
    return user.dataValues;
  }

  async getUserByEmail({ email }) {
    return this.User.findOne({ where: { email } });
  }
}
