export default {
  type: 'object',
  required: ['password', 'email'],
  items: { password: { type: 'string' }, email: { type: 'string' } },
};
