export default class UserRepository {
  constructor(RefreshToken) {
    this.RefreshToken = RefreshToken;
  }

  async getTokenRowsByUserId(userId) {
    const tokenRow = await this.RefreshToken.find({
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

  removeTokenRowsByUserId({ userId }) {
    return this.RefreshToken.update(
      { status: 'INACTIVE' },
      {
        where: { userId },
      }
    );
  }
}
