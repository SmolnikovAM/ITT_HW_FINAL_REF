import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('commentUserLike', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    commentId: { type: Sequelize.INTEGER },
    userId: { type: Sequelize.INTEGER },
    likeSign: { type: Sequelize.INTEGER, isIn: [[-1, 0, 1]] },
  });

// CREATE TABLE comments_users_likes (
// 	comment_id integer,
// 	user_id integer,
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	like_sign integer
// );
