export class UserNotFoundException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'UserNotFoundException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotFoundException);
    }
  }
}

export class WrongPasswordException extends Error {
  constructor(message: string = '') {
    super(message);
    this.name = 'WrongPasswordException';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WrongPasswordException);
    }
  }
}
