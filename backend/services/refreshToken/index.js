import { NotFoundError } from '../../helpers/errors';

export default class RefreshToken {
  constructor({ RefreshTokenRepository }, config) {
    this.RefreshTokenRepository = RefreshTokenRepository;
    this.jwtSecret = config.jwtSecret;
  }

  // eslint-disable-next-line
  async find({ token, userId }) {
    if (token) {
      return this.RefreshTokenRepository.getUserIdByToken(token).dataValue;
    }
    if (userId) {
      return this.RefreshTokenRepository.getUserIdByToken(token).dataValue;
    }
    throw new NotFoundError();
  }

  // eslint-disable-next-line
  async create({ token, userId }) {
    await this.RefreshTokenRepository.getTokenByUserId(userId);
    await this.RefreshTokenRepository.getUserIdByToken(token);
  }

  // eslint-disable-next-line
  async remove({ token, userId }) {
    await this.RefreshTokenRepository.getTokenByUserId(userId);
    await this.RefreshTokenRepository.getUserIdByToken(token);
  }
}
