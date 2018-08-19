import 'reflect-metadata';
import inversify from 'inversify';
// MODULES for DI
import * as configModule from './config/inversify.config';
import * as repositoryModule from './db/inversify.repository';
// import * as dbModule from './db/inversify.db';
// import * as userModelModule from './model/user/inversify.userModel';
// import * as modelModule from './model/inversify.model';
import * as seedModule from './scripts/seed/inversify.seed';
import * as ErrorsModule from './helpers/errors/inversify.errors';
import * as authService from './services/auth/inversify.authService';
//

const modules = [
  configModule,
  repositoryModule,
  // dbModule,
  // userModelModule,
  // modelModule,
  seedModule,
  ErrorsModule,
  authService,
];

const container = new inversify.Container();

const TYPES = {};
modules.forEach(({ LOCALTYPES }) => {
  Object.assign(TYPES, LOCALTYPES);
});

modules.forEach(m => {
  m.register({ container, TYPES });
});

export { TYPES, container };
