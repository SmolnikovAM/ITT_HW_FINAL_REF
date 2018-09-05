import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';

// import { NotAuthorizedError } from '../../helpers/errors';

export default class Auth {
  constructor(
    { UserRepository, RefreshTokenRepository },
    config,
    { NotAuthorizedError }
  ) {
    this.UserRepository = UserRepository;
    this.RefreshTokenRepository = RefreshTokenRepository;
    this.jwtSecret = config.jwtSecret;
    this.NotAuthorizedError = NotAuthorizedError;
  }

  async findRefreshToken({ token, userId }) {
    if (token) {
      return this.RefreshTokenRepository.getTokenRowByToken(token);
    }
    if (userId) {
      return this.RefreshTokenRepository.getTokenRowByUserId(token);
    }
    return null;
  }

  // async createRefreshToken({ token, userId }) {
  // }

  async removeRefreshToken({ token }) {
    return this.RefreshTokenRepository.removeTokenRowByToken({ token });
  }

  async removeRefreshTokenForUser({ userId }) {
    return this.RefreshTokenRepository.removeTokenRowsByUserId({ userId });
  }

  async issueTokensForUserId({ userId, options = {} }) {
    const refreshToken = uuid();
    await this.RefreshTokenRepository.addTokenForUserId({
      token: refreshToken,
      userId,
    });
    return {
      token: jwt.sign(
        { id: userId },
        this.jwtSecret,
        options // { expiresIn: '600000ms', }
      ),
      refreshToken,
    };
  }

  async login({ password: pass, email }) {
    const user = await this.UserRepository.getUserByEmail({ email });
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new this.NotAuthorizedError();
    }
    const { password, ...rest } = user;
    const tokens = await this.issueTokensForUserId({ userId: user.id });
    tokens.user = rest;
    return tokens;
  }

  // async logout({ userId }) {
  //   const user = await this.UserRepository.getUserByEmail({ email });
  //   if (!user || !bcrypt.compareSync(pass, user.password)) {
  //     throw new NotAuthorizedError();
  //   }
  //   const { password, ...rest } = user;
  //   const tokens = await this.issueTokensForUserId({ userId: user.id });
  //   tokens.user = rest;
  //   return tokens;
  // }
}
