// import Errors from '../../helpers/errors';

export default class UserRepository {
  constructor(RefreshToken) {
    this.RefreshToken = RefreshToken;
  }

  async getTokenByUserId(userId) {
    const token = await this.RefreshToken.findOne({
      where: { userId, status: 'ACTIVE' },
    });
    return token.dataValues;
  }

  async getUserIdByToken(token) {
    const tokenRow = await this.RefreshToken.findOne({
      where: { token, status: 'ACTIVE' },
    });
    return tokenRow.dataValues;
  }

  async createTokenByUserId({ token, userId }) {
    const tokenRow = await this.RefreshToken.create({ token, userId });
    return tokenRow.dataValues;
  }

  async removeTokenByUserId({ token }) {
    const tokenRow = await this.RefreshToken.update({
      set: { status: 'INACTIVE' },
      where: { token },
    });
    return tokenRow.dataValues;
  }
}
