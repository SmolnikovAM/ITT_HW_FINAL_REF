import jwt from 'jsonwebtoken';

export default (data, options = {}) => jwt.sign(data, 'TEST', options);
