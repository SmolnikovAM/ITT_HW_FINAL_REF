function convert(message) {
  let textMsg = '';
  if (typeof message === 'object') {
    try {
      textMsg += JSON.stringify(message);
    } catch (e) {
      textMsg += 'recursive link in message';
    }
  } else {
    textMsg += message;
  }
  return textMsg;
}

export class NotFoundError extends Error {
  constructor(message) {
    const textMsg = `Error: Not Found\n${convert(message)}`;
    super(textMsg);
    this.status = 404;
    this.expose = true;
  }
}

export class AccessDeniedError extends Error {
  constructor(message) {
    const textMsg = `Error: Access denyed\n${convert(message)}`;
    super(textMsg);
    this.status = 403;
    this.expose = true;
  }
}

export class NotAuthorizedError extends Error {
  constructor(message) {
    const textMsg = `Error: Not Authorized\n${convert(message)}`;
    super(textMsg);
    this.status = 401;
    this.expose = true;
  }
}

export class LogicError extends Error {
  constructor(message) {
    const textMsg = `Error: LogicError\n${convert(message)}`;
    super(textMsg);
    this.status = 400;
    this.expose = true;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    const textMsg = `Error: BadRequestError\n${convert(message)}`;
    super(textMsg);
    this.status = 400;
    this.expose = true;
  }
}
