import path from 'path';
import fs from 'fs';

export default class VideoService {
  constructor(
    { VideoRepository },
    { NotFoundError, AccessDeniedError },
    { videoFolder }
  ) {
    this.description = 'CRUD for videos';
    this.VideoRepository = VideoRepository;
    this.NotFoundError = NotFoundError;
    this.AccessDeniedError = AccessDeniedError;
    this.videoFolder = videoFolder;
  }

  test() {
    return this.description;
  }

  async getVideoByUuidForUser({ uuid, userId }) {
    const videoRow = await this.VideoRepository.getVideoIncludeFiles({ uuid });
    if (!videoRow) throw new this.NotFoundError();

    const video = videoRow.dataValues;

    if (video.access !== 'PRIVATE') return video;
    if (video.userId !== userId) throw new this.AccessDeniedError();
    return video;
  }

  async getVideoByFileUuidForUser({ uuid, userId }) {
    const file = await this.VideoRepository.getFile({ uuid });
    if (!file) throw new this.NotFoundError('No such video');

    const video = await this.VideoRepository.getVideo({
      id: file.videoId,
    });

    if (!video) throw new this.NotFoundError('No such video');

    const dataToReturn = { video, file };

    if (video.access !== 'PRIVATE') return dataToReturn;
    if (video.userId !== userId) throw new this.AccessDeniedError();
    return dataToReturn;
  }

  async sendVideo(ctx, file, video) {
    const pathToFile = path.resolve(
      path.join(this.videoFolder, `${file.uuid}.mp4`)
    );
    ctx.body = fs.readFileSync(pathToFile);
  }
}
