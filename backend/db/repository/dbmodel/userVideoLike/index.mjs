import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('userVideoLike', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    videoId: { type: Sequelize.INTEGER },
    userId: { type: Sequelize.INTEGER },
    likeSign: { type: Sequelize.INTEGER, isIn: [[-1, 0, 1]] },
  });

// CREATE TABLE users_videos_likes (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	user_id integer,
// 	videos_id integer,
// 	like_sign integer
// );
