export default class UserRepository {
  constructor(UserModel, Errors) {
    this.UserModel = UserModel;
    this.Errors = Errors;
  }

  getUserBy(id) {
    return this.UserModel.findOne({ where: { id } });
  }

  async getUserByEmail({ email }) {
    return this.UserModel.findOne({ where: { email } });
  }
}
