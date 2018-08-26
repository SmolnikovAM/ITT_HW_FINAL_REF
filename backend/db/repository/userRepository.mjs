// import Errors from '../../helpers/errors';

export default class UserRepository {
  constructor(User) {
    this.User = User;
  }

  getUserBy(id) {
    return this.User.findOne({ where: { id } });
  }

  async getUserByEmail({ email }) {
    return this.User.findOne({ where: { email } });
  }
}
