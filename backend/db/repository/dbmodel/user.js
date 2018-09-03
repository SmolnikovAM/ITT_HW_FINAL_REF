import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('user', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: Sequelize.STRING },
    name: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING },
    role: {
      type: Sequelize.STRING,
      isIn: [['ADMIN', 'USER']],
      defaultValue: 'USER',
    },
    status: {
      type: Sequelize.STRING,
      isIn: [['ACTIVE', 'BLOCK']],
      defaultValue: 'ACTIVE',
    },
    provider: { type: Sequelize.STRING },
    providerUUID: { type: Sequelize.STRING },
  });

// CREATE TABLE users (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	username varchar,
// 	name varchar,
// 	password varchar,
// 	image blob,
// 	role text,
// 	status varchar,
// 	provider text
// );
