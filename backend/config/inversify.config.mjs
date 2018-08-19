import config from '.';

export const LOCALTYPES = {
  Config: Symbol('Config'),
  DataBaseConfig: {
    param0: Symbol(1), // 'dbx_bd',
    param1: Symbol(2), // ''
    param2: Symbol(3), // ''
    param3: Symbol(4), // 'dialect{      dialect: 'sqlite',        storage: './db/test.db.sqlite',        logging: true,      },
  },
};

export function register({ container, TYPES }) {
  container.bind(TYPES.Config).toConstantValue(config);
  container.bind(TYPES.DataBaseConfig.param0).toConstantValue(config.db[0]);
  container.bind(TYPES.DataBaseConfig.param1).toConstantValue(config.db[1]);
  container.bind(TYPES.DataBaseConfig.param2).toConstantValue(config.db[2]);
  container.bind(TYPES.DataBaseConfig.param3).toConstantValue(config.db[3]);
}
