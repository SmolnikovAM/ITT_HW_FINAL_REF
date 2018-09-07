export default class UserRepository {
  constructor({ VideoFile }) {
    this.VideoFile = VideoFile;
  }

  getFilesByVideoId({ id }) {
    return this.VideoFile.findAll({ where: { id } });
  }
}
