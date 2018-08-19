export default class Seed {
  constructor(Model) {
    this.done = new Promise(res => {
      this.resDone = res;
    });
    this.Model = Model;
    this.pushValues();
    // ----------
  }

  async pushValues() {
    const { UserModel } = this.Model;
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
