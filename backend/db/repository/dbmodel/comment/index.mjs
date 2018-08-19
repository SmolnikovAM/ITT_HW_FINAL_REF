import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('comment', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: Sequelize.TEXT },
    userId: { type: Sequelize.INTEGER },
    videoId: { type: Sequelize.INTEGER },
    likesCount: { type: Sequelize.INTEGER },
    dislikesCount: { type: Sequelize.INTEGER },
  });

// CREATE TABLE comments (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	text blob,
// 	user_id integer,
// 	video_id integer,
// 	likes_count integer,
// 	dislikes_count integer,
// 	post_date datetime
// );
