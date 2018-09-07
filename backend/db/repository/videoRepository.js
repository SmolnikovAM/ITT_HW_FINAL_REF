import Sequelize from 'sequelize';

const { Op } = Sequelize;

export default class videoRepository {
  constructor({ Video, VideoFile }) {
    this.Video = Video;
    this.VideoFile = VideoFile;
  }

  async getVideoIncludeFiles({ ...whereFields }) {
    return this.Video.findOne({
      where: {
        ...whereFields,
        status: { [Op.ne]: 'DELETED' },
      },
      include: [
        {
          model: this.VideoFile,
          as: 'videoFiles',
          where: { status: { [Op.ne]: 'TODELETE' } },
        },
      ],
    });
  }

  async getVideo({ ...whereFields }) {
    return this.Video.findOne({
      where: {
        ...whereFields,
        status: { [Op.ne]: 'DELETED' },
      },
    });
  }

  async getFile({ ...whereFields }) {
    return this.VideoFile.findOne({
      where: { ...whereFields, status: { [Op.ne]: 'TODELETE' } },
    });
  }
}
