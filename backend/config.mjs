import rc from 'rc';

const APP_NAME = 'ITTALENTS';

// using example
// ITTALENTS_port=9000 npm run start
export default rc(APP_NAME, {
  port: 3000,
  db: [
    'dbx_bd',
    '',
    '',
    {
      dialect: 'sqlite',
      storage: './test.db.sqlite',
      logging: false,
    },
  ],
});
