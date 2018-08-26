export class NotFoundError extends Error {
  constructor() {
    super('Not Found');
    this.status = 404;
    this.expose = true;
  }
}

export class NotAuthorizedError extends Error {
  constructor() {
    super('Not Authorized');
    this.status = 401;
    this.expose = true;
  }
}

export class LogicError extends Error {
  constructor(message) {
    let textMsg = 'Error: LogicError\n';
    if (typeof message === 'object') {
      try {
        textMsg += JSON.stringify(message);
      } catch (e) {
        textMsg += 'recursive link';
      }
    } else {
      textMsg += message;
    }
    super(textMsg);
    this.status = 400;
    this.expose = true;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    let textMsg = 'Error: BadRequestError\n';
    if (typeof message === 'object') {
      try {
        textMsg += JSON.stringify(message);
      } catch (e) {
        // textMsg = 'BadRequestError';
      }
    } else {
      textMsg += message;
    }
    super(textMsg);
    this.status = 400;
    this.expose = true;
  }
}
