import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('recentlySeen', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    // userId: { type: Sequelize.INTEGER },
    // videoId: { type: Sequelize.INTEGER },
    seenDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

// CREATE TABLE recently_seen (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	user_id integer,
// 	video_id integer,
// 	seen_date datetime
// );
