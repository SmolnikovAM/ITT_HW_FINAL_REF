import Sequelize from 'sequelize';

export default sequelize =>
  sequelize.define('videoFile', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    uuid: { type: Sequelize.STRING },
    resolution: { type: Sequelize.STRING },
    status: {
      type: Sequelize.STRING,
      isIn: [['TEMP', 'ACIVE', 'TODELETE']],
      defaultValue: 'ACIVE',
    },
    size: { type: Sequelize.INTEGER },
  });
