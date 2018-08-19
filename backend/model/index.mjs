export default class Model {
  constructor(Config, UserModel) {
    const models = { UserModel };
    this.done = new Promise(res => {
      this.resDone = res;
    });

    let promiseChain = Promise.resolve();
    Object.entries(models).forEach(([key, value]) => {
      this[key] = value;
      promiseChain = promiseChain.then(() =>
        value.sync({ force: Config.dbForce })
      );
    });

    promiseChain.then(() => this.resDone());
  }
}
