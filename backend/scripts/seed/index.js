import bcrypt from 'bcryptjs';
import fs from 'fs';
import * as util from 'util';

import { container, TYPES } from '../../inversifyContainer';

function getStat(...args) {
  return util.promisify(fs.stat)(...args);
}

async function createFolders() {
  const { staticFolder, videoFolder, tmpFolder } = container.get(TYPES.Config);

  [staticFolder, videoFolder, tmpFolder].forEach(async path => {
    try {
      const pathDesription = await getStat(path);
      if (!pathDesription.isDirectory())
        throw new Error(`path is not folder: "${path}" `);
    } catch (err) {
      if (err.code === 'ENOENT') {
        fs.mkdirSync(path);
      } else {
        throw err;
      }
    }
  });
}

async function seed() {
  global.console.log('start creating repository');
  await container.get(TYPES.Repository).done;
  global.console.log('start push User data');

  const { User, Video } = container.get(TYPES.Repository);
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
          uuid: 'UUID01_PUBLIC',
          videoFiles: [
            { uuid: 'test_video_1_file_1', resolution: '240x240' },
            {
              uuid: 'test_video_1_file_2',
              resolution: '340x340',
              status: 'TODELETE',
            },
          ],
          //   'https://www.sample-videos.com/video/mp4/480/big_buck_bunny_480p_10mb.mp4',
        },
        {
          name: 'video 2',
          about: 'good',
          image: 'https://via.placeholder.com/350x350',
          tag: 'sport',
          uuid: 'UUID02_PRIVATE',
          access: 'PRIVATE',
          videoFiles: [
            { uuid: 'test_video_2_file_3', resolution: '240x240' },
            { uuid: 'test_video_2_file_4', resolution: '340x340' },
          ],
        },
      ],
      refreshTokens: [
        { token: 'REFRESH TOKEN 1', status: 'ACTIVE' },
        { token: 'REFRESH TOKEN 2', status: 'ACTIVE' },
      ],
    },
    {
      include: [
        {
          association: User.Videos,
          include: [Video.VideoFiles],
        },
        User.RefreshTokens,
      ],
    }
  );

  await User.create(
    {
      email: 'test2@test.com',
      name: 'Test user 2',
      password: bcrypt.hashSync('password'),
      image: 'https://via.placeholder.com/350x350',
      role: 'USER',
      status: 'ACTIVE',
      provider: null,
      providerId: null,
      videos: [
        {
          name: 'video 3',
          about: 'good',
          image: 'https://via.placeholder.com/350x350',
          tag: 'sport',
          uuid: 'UUID03',
          videoFiles: [{ uuid: 'test_video_3_file_5', resolution: '240x240' }],
        },
        {
          name: 'video 4',
          about: 'good',
          image: 'https://via.placeholder.com/350x350',
          tag: 'sport',
          uuid: 'UUID04',
          videoFiles: [{ uuid: 'test_video_4_file_6', resolution: '240x240' }],
        },
      ],
      refreshTokens: [
        { token: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT_1', status: 'ACTIVE' },
        { token: 'REFRESH_TOKEN_TO_DELETE_ON_LOGOUT_2', status: 'ACTIVE' },
      ],
    },
    {
      include: [
        {
          association: User.Videos,
          include: [Video.VideoFiles],
        },
        User.RefreshTokens,
      ],
    }
  );

  await User.create({
    email: 'test3@test.com',
    name: 'Test user 3',
    password: bcrypt.hashSync('password'),
    image: 'https://via.placeholder.com/350x350',
    role: 'USER',
    status: 'ACTIVE',
    provider: null,
    providerId: null,
  });

  global.console.log('end seed');
}

createFolders();
seed();
