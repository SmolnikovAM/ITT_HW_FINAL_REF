// import Errors from '../../helpers/errors';

export default class UserRepository {
  constructor(RefreshToken) {
    this.RefreshToken = RefreshToken;
  }

  async getTokenByUserId(userId) {
    const token = await this.User.findOne({ where: { userId } });
    return token.dataValues;
  }

  async getUserIdByToken(token) {
    const tokenRow = await this.User.findOne({ where: { token } });
    return tokenRow.dataValues;
  }
}
