import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('notification', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    commentId: { type: Sequelize.INTEGER },
    userId: { type: Sequelize.INTEGER },
    likeSign: { type: Sequelize.INTEGER, isIn: [[-1, 0, 1]] },
  });

// CREATE TABLE notifications (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	post_date datetime,
// 	user_id integer,
// 	massage_info text,
// 	video_id integer
// );
