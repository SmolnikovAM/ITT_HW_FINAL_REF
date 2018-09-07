import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('video', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    // userId: { type: Sequelize.INTEGER },
    name: { type: Sequelize.STRING },
    playCount: { type: Sequelize.INTEGER, defaultValue: 0 },
    about: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING },
    status: {
      type: Sequelize.STRING,
      isIn: [['ACTIVE', 'BLOCK', 'PENDING', 'UPLOAD', 'CONVERTING', 'DELETED']],
      defaultValue: 'UPLOAD',
    },
    likesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
    dislikesCount: { type: Sequelize.INTEGER, defaultValue: 0 },
    postDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    tag: { type: Sequelize.STRING },
    uuid: { type: Sequelize.STRING },
    access: {
      type: Sequelize.STRING,
      isIn: [['PUBLIC', 'PRIVATE']],
      defaultValue: 'PUBLIC',
    },
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
