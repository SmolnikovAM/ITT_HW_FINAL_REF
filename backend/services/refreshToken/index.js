export default class RefreshToken {
  constructor({ RefreshTokenRepository }, config) {
    this.RefreshTokenRepository = RefreshTokenRepository;
    this.jwtSecret = config.jwtSecret;
  }

  // eslint-disable-next-line
  find({ token, userId }) {}
  // eslint-disable-next-line
  create({ token, userId }) {}
  // eslint-disable-next-line
  remove({ token, userId }) {}
}
