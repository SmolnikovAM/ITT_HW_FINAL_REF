import Sequielize from 'sequelize';

import userTableCreate from './repository/dbmodel/user';
import commentTableCreate from './repository/dbmodel/comment';
import commentUserLikeTableCreate from './repository/dbmodel/commentUserLike';
import notificationTableCreate from './repository/dbmodel/notification';
import playlistTableCreate from './repository/dbmodel/playlist';
import recentlySeenTableCreate from './repository/dbmodel/recentlySeen';
import subcribeTableCreate from './repository/dbmodel/subcribe';
import userVideoLikeTableCreate from './repository/dbmodel/userVideoLike';
import videoTableCreate from './repository/dbmodel/video';
import videoPlaylistTableCreate from './repository/dbmodel/videoPlaylist';

import UserRepository from './repository/userRepository';

export default class Repository {
  constructor(config, Errors) {
    this.config = config;
    this.sequelize = new Sequielize(...config.db);
    this.models = {};
    this.Errors = Errors;

    this.done = new Promise(res => {
      this.resDone = res;
    });

    this.models.UserModel = userTableCreate(this.sequelize);
    this.models.CommentModel = commentTableCreate(this.sequelize);
    this.models.CommentUserLikeModel = commentUserLikeTableCreate(
      this.sequelize
    );
    this.models.NotificationModel = notificationTableCreate(this.sequelize);
    this.models.PlaylistModel = playlistTableCreate(this.sequelize);
    this.models.RecentlyModel = recentlySeenTableCreate(this.sequelize);
    this.models.SubcribeModel = subcribeTableCreate(this.sequelize);
    this.models.VideoModel = videoTableCreate(this.sequelize);
    this.models.VideoPlaylistModel = videoPlaylistTableCreate(this.sequelize);
    this.models.userVideoLikeVideoModel = userVideoLikeTableCreate(
      this.sequelize
    );

    let promiseChain = Promise.resolve();
    Object.entries(this.models).forEach(([key, value]) => {
      this[key] = value;
      promiseChain = promiseChain.then(() =>
        value.sync({ force: this.config.dbForce })
      );
    });

    promiseChain.then(this.resDone);

    this.modelStart();
  }

  async modelStart() {
    this.userRepository = new UserRepository(
      this.models.UserModel,
      this.Errors
    );
  }
}
