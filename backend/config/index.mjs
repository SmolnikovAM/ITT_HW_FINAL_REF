import rc from 'rc';

const APP_NAME = 'ITTALENTS';

// using example
// ITTALENTS_port=9000 npm run start
const config = rc(APP_NAME, {
  port: 3000,
  db: [
    'dbx_bd',
    '',
    '',
    {
      dialect: 'sqlite',
      storage: './db/test.db.sqlite',
      logging: false,
    },
  ],
  dbForce: false,
  insertTestValues: false,
});

export default config;
