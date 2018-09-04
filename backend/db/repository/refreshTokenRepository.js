import uuid from 'uuid/v4';

// import Errors from '../../helpers/errors';

export default class UserRepository {
  constructor(RefreshToken) {
    this.RefreshToken = RefreshToken;
  }

  async getTokenRowByUserId(userId) {
    const tokenRow = await this.RefreshToken.findOne({
      where: { userId, status: 'ACTIVE' },
    });
    return tokenRow;
  }

  async getTokenRowByToken(token) {
    const tokenRow = await this.RefreshToken.findOne({
      where: { token, status: 'ACTIVE' },
    });
    return tokenRow;
  }

  addTokenForUserId({ userId, token }) {
    return this.RefreshToken.create({ token, userId });
  }

  removeTokenRowByToken({ token }) {
    return this.RefreshToken.update(
      { status: 'INACTIVE' },
      {
        where: { token },
      }
    );
  }
}
