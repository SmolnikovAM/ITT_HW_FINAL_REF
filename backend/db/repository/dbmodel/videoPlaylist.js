import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('videoPlaylist', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    // videoId: { type: Sequelize.INTEGER },
    // playlist_id: { type: Sequelize.INTEGER },
  });

// CREATE TABLE videos_playlists (
// 	video_id integer,
// 	playlist_id integer,
// 	id integer PRIMARY KEY AUTOINCREMENT
// );
