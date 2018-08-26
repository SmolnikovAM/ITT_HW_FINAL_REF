import Sequielize from 'sequelize';

// import Errors from '../helpers/errors';

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
import CommentRepository from './repository/commentRepository';
import CommentUserLikeRepository from './repository/commentUserLikeRepository';
import NotificationRepository from './repository/notificationRepository';
import PlaylistRepository from './repository/playlistRepository';
import RecentlyRepository from './repository/recentlyRepository';
import SubcribeRepository from './repository/subcribeRepository';
import VideoRepository from './repository/videoRepository';
import VideoPlaylistRepository from './repository/videoPlaylistRepository';
import UserVideoLikeVideoRepository from './repository/userVideoLikeVideoRepository';

export default class Repository {
  constructor(config) {
    this.config = config;
    const { database, username, password, params } = config.db;
    this.sequelize = new Sequielize(database, username, password, params);

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
    const {
      User,
      Comment,
      CommentUserLike,
      Notification,
      Playlist,
      Recently,
      Subcribe,
      Video,
      VideoPlaylist,
      UserVideoLikeVideo,
    } = this.models;
    this.userRepository = new UserRepository(User);
    this.commentRepository = new CommentRepository(Comment);
    this.commentUserLikeRepository = new CommentUserLikeRepository(
      CommentUserLike
    );
    this.notificationRepository = new NotificationRepository(Notification);
    this.playlistRepository = new PlaylistRepository(Playlist);
    this.recentlyRepository = new RecentlyRepository(Recently);
    this.subcribeRepository = new SubcribeRepository(Subcribe);
    this.videoRepository = new VideoRepository(Video);
    this.videoPlaylistRepository = new VideoPlaylistRepository(VideoPlaylist);
    this.userVideoLikeVideoRepository = new UserVideoLikeVideoRepository(
      UserVideoLikeVideo
    );
  }
}
