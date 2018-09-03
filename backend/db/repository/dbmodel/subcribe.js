import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('subcribe', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    // userId: { type: Sequelize.INTEGER },
    // subscribeUserId: { type: Sequelize.INTEGER },
  });

// CREATE TABLE subcribe (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	user_id integer,
// 	subscribe_user_id integer
// );
