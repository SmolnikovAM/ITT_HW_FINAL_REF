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
import refreshTokenTableCreate from './repository/dbmodel/refreshToken';

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
import RefreshTokenRepository from './repository/refreshTokenRepository';

const MODULES = [
  {
    name: 'User',
    createTable: userTableCreate,
    RepositoryClass: UserRepository,
  },
  {
    name: 'Comment',
    createTable: commentTableCreate,
    RepositoryClass: CommentRepository,
  },
  {
    name: 'CommentUserLike',
    createTable: commentUserLikeTableCreate,
    RepositoryClass: CommentUserLikeRepository,
  },
  {
    name: 'Notification',
    createTable: notificationTableCreate,
    RepositoryClass: NotificationRepository,
  },
  {
    name: 'Playlist',
    createTable: playlistTableCreate,
    RepositoryClass: PlaylistRepository,
  },
  {
    name: 'RecentlySeen',
    createTable: recentlySeenTableCreate,
    RepositoryClass: RecentlyRepository,
  },
  {
    name: 'Subcribe',
    createTable: subcribeTableCreate,
    RepositoryClass: SubcribeRepository,
  },
  {
    name: 'Video',
    createTable: videoTableCreate,
    RepositoryClass: VideoRepository,
  },
  {
    name: 'VideoPlaylist',
    createTable: videoPlaylistTableCreate,
    RepositoryClass: VideoPlaylistRepository,
  },
  {
    name: 'UserVideoLike',
    createTable: userVideoLikeTableCreate,
    RepositoryClass: UserVideoLikeVideoRepository,
  },
  {
    name: 'RefreshToken',
    createTable: refreshTokenTableCreate,
    RepositoryClass: RefreshTokenRepository,
  },
];

export default class Repository {
  constructor(config) {
    this.config = config;
    const { database, username, password, params } = config.db;
    this.sequelize = new Sequielize(database, username, password, params);
    this.MODULES = MODULES;
    this.loadModels();
  }

  loadModels() {
    this.done = new Promise(res => {
      this.resDone = res;
    });
    let promiseChain = Promise.resolve();

    this.MODULES.forEach(moduleData => {
      const { name, createTable } = moduleData;
      // eslint-disable-next-line no-param-reassign
      moduleData.model = createTable(this.sequelize);
      this[name] = moduleData.model;
    });

    this.modelConnections();

    this.MODULES.forEach(moduleData => {
      const { name, RepositoryClass } = moduleData;
      promiseChain = promiseChain
        .then(() => this[name].sync({ force: this.config.dbForce }))
        .then(() => {
          this[`${name}Repository`] = new RepositoryClass(this[name]);
        });
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
      RefreshToken,
    } = this.MODULES.reduce((a, { name, model }) => {
      // eslint-disable-next-line no-param-reassign
      a[name] = model;
      return a;
    }, {});

    Video.belongsTo(User);
    User.Videos = User.hasMany(Video);

    RefreshToken.belongsTo(User);
    User.RefreshTokens = User.hasMany(RefreshToken);

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
}
