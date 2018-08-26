import rc from 'rc';
import parseSettings from 'parse-strings-in-object';
const APP_NAME = 'ITTALENTS';

// using example
// ITTALENTS_port=9000 npm run start
const config = parseSettings(
  rc(APP_NAME, {
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
    test: false,
  })
);

export default config;
