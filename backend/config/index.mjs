import rc from 'rc';

const APP_NAME = 'ITTALENTS';

// using example
// ITTALENTS_port=9000 npm run start
const config = rc(APP_NAME, {
  port: 3000,
  db: {
    database: 'dbx_bd',
    username: '',
    password: '',
    params: {
      dialect: 'sqlite',
      storage: './db/test.db.sqlite',
      logging: false,
    },
  },
  dbForce: false,
  insertTestValues: false,
});

config.db.params.logging = config.db.params.logging === 'true';
config.dbForce = Boolean(config.dbForce);
config.insertTestValues = Boolean(config.dbForce);

export default config;
