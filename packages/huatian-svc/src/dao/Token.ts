import crypto from "crypto";

interface TokenObject {
  uid: number;
  expires: number;
  token: string;
}

export class Token {
  static inst: Token = new Token();

  static getInstance() {
    return Token.inst;
  }
  private cache: Record<string, TokenObject> = {};

  private create(uid: number) {
    const token = Math.random() + "-" + Date.now();
    const expires = +new Date() + 3600 * 24;
    const sha = crypto.createHash("sha1");
    sha.update(token);
    const hash = sha.digest("hex");
    const tokenObj = {
      uid,
      expires,
      token: hash,
    };
    this.cacheSet(hash, tokenObj);
    return tokenObj;
  }
  private cacheSet(token: string, tokenObj: TokenObject) {
    this.cache[token] = tokenObj;
  }

  private cacheGet(token: string): TokenObject {
    return this.cache[token] || null;
  }
  public refreshCreate(uid: number) {
    return this.create(uid);
  }
  public getToken(hash: string) {
    const token = this.cacheGet(hash);
    if (!token) return null;
    if (token.expires > +new Date()) return token;
    return null;
  }
}
