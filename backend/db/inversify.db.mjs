import inversify from 'inversify';
import Sequelize from 'sequelize';

export const LOCALTYPES = {
  Sequelize: Symbol('Sequelize'),
};

export function register({ container, TYPES }) {
  inversify.decorate(inversify.injectable(), Sequelize);

  inversify.decorate(
    inversify.inject(TYPES.DataBaseConfig.param0),
    Sequelize,
    0
  );
  inversify.decorate(
    inversify.inject(TYPES.DataBaseConfig.param1),
    Sequelize,
    1
  );
  inversify.decorate(
    inversify.inject(TYPES.DataBaseConfig.param2),
    Sequelize,
    2
  );
  inversify.decorate(
    inversify.inject(TYPES.DataBaseConfig.param3),
    Sequelize,
    3
  );

  container
    .bind(TYPES.Sequelize)
    .to(Sequelize)
    .inSingletonScope();

  // container.bind(TYPES.Model).toConstantValue(() => Model());
  // const sequelize = createSequelize(container.get(TYPES.Config));
  // container.bind(TYPES.Sequelize).toConstantValue(sequelize);
}
