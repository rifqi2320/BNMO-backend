import jwt from "jsonwebtoken";

class JWTLib {
  secret: string;
  expiresIn: string;
  constructor() {
    this.secret = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRE;
  }
  sign(payload: Object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }
  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }
}

export default new JWTLib();
