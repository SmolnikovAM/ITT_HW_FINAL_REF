import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('refreshToken', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    token: { type: Sequelize.TEXT },
    status: {
      type: Sequelize.STRING,
      isIn: [['ACTIVE', 'INACTIVE']],
      defaultValue: 'ACTIVE',
    },
    // videoId: { type: Sequelize.INTEGER },
    // playlist_id: { type: Sequelize.INTEGER },
  });
