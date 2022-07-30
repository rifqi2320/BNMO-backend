class BNMOError extends Error {
  httpCode: number;
  constructor(message: string, httpCode: number) {
    super(message);
    this.httpCode = httpCode;
  }
}

class LoginError extends BNMOError {
  constructor() {
    super("Invalid username or password", 401);
  }
}

class UnauthenticatedError extends BNMOError {
  constructor() {
    super("Unauthenticated", 401);
  }
}

class PermissionDeniedError extends BNMOError {
  constructor() {
    super("Permission Denied", 403);
  }
}

class UserNotVerifiedError extends BNMOError {
  constructor() {
    super("User not verified", 401);
  }
}

class TokenExpiredError extends BNMOError {
  constructor() {
    super("Session expired", 401);
  }
}

class BalanceNotEnoughError extends BNMOError {
  constructor() {
    super("Balance not enough", 400);
  }
}

class BadRequestError extends BNMOError {
  constructor(message: string = "") {
    if (message) {
      super("Bad Request : " + message, 400);
    } else {
      super("Bad Request", 400);
    }
  }
}

class CurrencyNotFoundError extends BNMOError {
  constructor() {
    super("Currency not found", 404);
  }
}

class APIError extends BNMOError {
  constructor() {
    super("API Error", 500);
  }
}

export default {
  BNMOError,
  LoginError,
  UnauthenticatedError,
  PermissionDeniedError,
  TokenExpiredError,
  BadRequestError,
  UserNotVerifiedError,
  BalanceNotEnoughError,
  CurrencyNotFoundError,
  APIError,
};
