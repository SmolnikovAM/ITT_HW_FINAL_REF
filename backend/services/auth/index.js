import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuid from 'uuid/v4';

import { NotAuthorizedError } from '../../helpers/errors';

export default class Auth {
  constructor({ UserRepository }, config) {
    this.UserRepository = UserRepository;
    this.jwtSecret = config.jwtSecret;
  }

  async login({ password: pass, email }) {
    const user = await this.UserRepository.getUserByEmail({ email });
    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new NotAuthorizedError();
    }
    const { password, ...rest } = user;
    const refreshTocken = uuid();

    return {
      user: rest,
      token: jwt.sign(
        { id: user.id },
        this.jwtSecret
        // , { expiresIn: '600000ms', }
      ),
      refreshTocken,
    };
  }
}
