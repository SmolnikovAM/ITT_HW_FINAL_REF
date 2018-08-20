export default class UserRepository {
  constructor(User, Errors) {
    this.User = User;
    this.Errors = Errors;
  }

  getUserBy(id) {
    return this.User.findOne({ where: { id } });
  }

  async getUserByEmail({ email }) {
    return this.User.findOne({ where: { email } });
  }
}
