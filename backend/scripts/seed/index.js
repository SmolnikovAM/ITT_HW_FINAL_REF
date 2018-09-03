import bcrypt from 'bcryptjs';
import { container, TYPES } from '../../inversifyContainer';

async function seed() {
  global.console.log('start creating repository');
  await container.get(TYPES.Repository).done;
  global.console.log('start push User data');

  const { User } = container.get(TYPES.Repository);
  await User.create(
    {
      email: 'test@test.com',
      name: 'Test user 1',
      password: bcrypt.hashSync('password'),
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
      refreshTokens: [{ token: 'REFRESH TOKEN 1', status: 'ACTIVE' }],
    },
    {
      include: [User.Videos, User.RefreshTokens],
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

  global.console.log('end seed');
}
seed();
