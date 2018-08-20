export default class Seed {
  constructor({ models }) {
    this.done = new Promise(res => {
      this.resDone = res;
    });
    this.models = models;
    this.pushValues();
    // ----------
  }

  async pushValues() {
    const { User, Video } = this.models;
    const { dataValues: user } = await User.create(
      {
        email: 'test@test.com',
        name: 'Test user 1',
        password: 'password',
        image: 'https://via.placeholder.com/350x350',
        role: 'ADMIN',
        status: 'ACTIVE',
        provider: null,
        providerId: null,
        videos: [
          {
            name: 'video 1',
            about: 'good',
            image: 'https://via.placeholder.com/350x350',
            tag: 'sport',
            uuid: '123456',
            lowQuality:
              'https://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_10mb.mp4',
            highQuality:
              'https://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_10mb.mp4',
          },
          {
            name: 'video 2',
            about: 'good',
            image: 'https://via.placeholder.com/350x350',
            tag: 'sport',
            uuid: '1234567',
            lowQuality:
              'https://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_10mb.mp4',
            highQuality:
              'https://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_10mb.mp4',
          },
        ],
      },
      {
        include: [User.Videos],
      }
    );

    // const { dataValues: user } = await User.create({
    //   email: 'test@test.com',
    //   name: 'Test user 1',
    //   password: 'password',
    //   image: null,
    //   role: 'ADMIN',
    //   status: 'ACTIVE',
    //   provider: null,
    //   providerId: null,
    // });

    this.resDone();
  }
}
