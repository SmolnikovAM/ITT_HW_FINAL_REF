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
    const { database, username, password, params } = config.db;
    this.sequelize = new Sequielize(database, username, password, params);
    this.Errors = Errors;

    this.loadModels();
    this.modelConnections();
    this.startRepositories();
  }

  loadModels() {
    const User = userTableCreate(this.sequelize);
    const Comment = commentTableCreate(this.sequelize);
    const CommentUserLike = commentUserLikeTableCreate(this.sequelize);
    const Notification = notificationTableCreate(this.sequelize);
    const Playlist = playlistTableCreate(this.sequelize);
    const RecentlySeen = recentlySeenTableCreate(this.sequelize);
    const Subcribe = subcribeTableCreate(this.sequelize);
    const Video = videoTableCreate(this.sequelize);
    const VideoPlaylist = videoPlaylistTableCreate(this.sequelize);
    const UserVideoLike = userVideoLikeTableCreate(this.sequelize);
    this.models = {
      User,
      Comment,
      CommentUserLike,
      Notification,
      Playlist,
      RecentlySeen,
      Subcribe,
      Video,
      VideoPlaylist,
      UserVideoLike,
    };

    this.done = new Promise(res => {
      this.resDone = res;
    });
    let promiseChain = Promise.resolve();
    Object.entries(this.models).forEach(([key, value]) => {
      this[key] = value;
      promiseChain = promiseChain.then(() =>
        value.sync({ force: this.config.dbForce })
      );
    });
    promiseChain.then(this.resDone);
  }

  modelConnections() {
    const {
      User,
      Comment,
      CommentUserLike,
      Notification,
      Playlist,
      RecentlySeen,
      Subcribe,
      Video,
      VideoPlaylist,
      UserVideoLike,
    } = this.models;

    Video.belongsTo(User);
    User.Videos = User.hasMany(Video);

    Playlist.belongsTo(User);
    User.Playlists = User.hasMany(Playlist);

    VideoPlaylist.belongsTo(Playlist);
    Playlist.hasMany(VideoPlaylist);
    VideoPlaylist.belongsTo(Video);
    Video.hasMany(VideoPlaylist);

    CommentUserLike.belongsTo(User);
    CommentUserLike.belongsTo(Comment);

    Comment.belongsTo(User);
    User.hasMany(Comment);
    Comment.belongsTo(Video);
    Video.hasMany(Comment);

    RecentlySeen.belongsTo(User);
    User.hasMany(RecentlySeen);
    RecentlySeen.belongsTo(Video);
    Video.hasMany(RecentlySeen);

    UserVideoLike.belongsTo(Video);
    Video.hasMany(UserVideoLike);
    UserVideoLike.belongsTo(User);
    User.hasMany(UserVideoLike);

    Notification.belongsTo(User);
    Video.hasMany(Notification);
    Notification.belongsTo(Video);
    Video.hasMany(Notification);

    Subcribe.belongsTo(User);
    User.hasMany(Subcribe);
    Subcribe.belongsTo(User, { as: 'subscribeUser' });
    User.hasMany(Subcribe, { as: 'subscribeUser' });
  }

  startRepositories() {
    this.userRepository = new UserRepository(this.models.User, this.Errors);
    // Comment,
    // CommentUserLike,
    // Notification,
    // Playlist,
    // Recently,
    // Subcribe,
    // Video,
    // VideoPlaylist,
    // UserVideoLikeVideo,
  }
}
