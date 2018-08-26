import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('notification', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    // user_id integer,
    // video_id integer
    massageInfo: { type: Sequelize.STRING },
    postDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

// CREATE TABLE notifications (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	post_date datetime,
// 	user_id integer,
// 	massage_info text,
// 	video_id integer
// );
