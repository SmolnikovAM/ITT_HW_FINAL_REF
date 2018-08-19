export default class Auth {
  constructor(UserModel, Errors) {
    this.UserModel = UserModel;
    this.Errors = Errors;
  }

  async login({ password, email }) {
    const user = await this.UserModel.findOne({ where: { password, email } });
    if (!user) throw this.Errors.NotAuthorizedError;
    return user;
  }
}
