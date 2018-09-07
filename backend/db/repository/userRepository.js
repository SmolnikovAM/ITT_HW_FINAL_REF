export default class UserRepository {
  constructor({ User }) {
    this.User = User;
  }

  async getUserById(id) {
    const user = await this.User.findOne({ where: { id } });
    return user.dataValues;
  }

  async getUserByEmail({ email }) {
    return this.User.findOne({ where: { email } });
  }

  async addUser({ password, name, email }) {
    return this.User.create({ password, name, email });
  }
}
