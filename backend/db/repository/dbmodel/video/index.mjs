import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('userVideoLike', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    playCount: { type: Sequelize.INTEGER },
    about: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING },
    status: { type: Sequelize.STRING },
    likesCount: { type: Sequelize.INTEGER },
    dislikesCount: { type: Sequelize.INTEGER },
    post_date: { type: Sequelize.DATE },
    tag: { type: Sequelize.STRING },
    uuid: { type: Sequelize.STRING },
    visibility: { type: Sequelize.STRING },
    lowQuality: { type: Sequelize.STRING },
    highQuality: { type: Sequelize.STRING },
    duration: { type: Sequelize.STRING },
  });

// CREATE TABLE videos (
// 	id integer PRIMARY KEY AUTOINCREMENT,
// 	user_id integer,
// 	name text,
// 	play_count integer,
// 	about text,
// 	image text,
// 	status text,
// 	likes_count integer,
// 	dislikes_count integer,
// 	post_date datetime,
// 	tag varchar,
// 	uuid varchar,
// 	visibility varchar,
// 	low_quality integer,
// 	high_quality integer,
// 	duration text
// );
