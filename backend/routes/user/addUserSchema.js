export default {
  type: 'object',
  required: ['password1', 'password2', 'email'],
  items: {
    password1: { type: 'string' },
    password2: { type: 'string' },
    email: { type: 'string' },
  },
};
