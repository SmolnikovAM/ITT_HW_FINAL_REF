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
    const { UserModel } = this.models;
    await UserModel.create({
      email: 'test@test.com',
      name: 'Test user 1',
      password: 'password',
      image: null,
      role: 'ADMIN',
      status: 'ACTIVE',
      provider: null,
      providerId: null,
    });
    this.resDone();
  }
}
