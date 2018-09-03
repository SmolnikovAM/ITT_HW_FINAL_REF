import 'reflect-metadata';
import * as inversify from 'inversify';

// MODULES for DI
import * as configModule from './config/inversify.module';
import * as repositoryModule from './db/inversify.module';
// import * as dbModule from './db/inversify.db';
// import * as userModelModule from './model/user/inversify.userModel';
// import * as modelModule from './model/inversify.model';
// import * as seedModule from './scripts/seed/inversify.seed';
import * as ErrorsModule from './helpers/errors/inversify.module';
import * as authService from './services/auth/inversify.module';
//

const modules = [
  configModule,
  repositoryModule,
  // dbModule,
  // userModelModule,
  // modelModule,
  // seedModule,
  ErrorsModule,
  authService,
];

const { Container } = inversify;

const container = new Container();

const TYPES = {};
modules.forEach(({ LOCALTYPES }) => {
  Object.assign(TYPES, LOCALTYPES);
});

modules.forEach(m => {
  m.register({ container, TYPES });
});

export { TYPES, container };
