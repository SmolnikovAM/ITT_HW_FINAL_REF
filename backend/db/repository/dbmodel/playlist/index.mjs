import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('playlist', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    private: { type: Sequelize.STRING, isIn: [['PUBLIC', 'PRIVATE']] },
  });

// CREATE TABLE playlists (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	user_id integer,
// 	name varchar,
// 	private text
// );
