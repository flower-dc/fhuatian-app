import { User } from "@huatian/model";

export class UserRepository {
  private users: Record<number, User> = {};
  public static inst = new UserRepository();

  public static getInstance() {
    return UserRepository.inst;
  }

  public getUser(uid: number): User;
  public getUser(uid: string, pwd: string): User;
  public getUser(identity: number /**身份 */ | string, pwd?: string): User {
    if (typeof identity === "number") {
      const uid = identity;
      if (this.users[uid]) {
        return this.users[uid];
      }
      const newUser = new User(uid);
      this.users[uid] = newUser;
      return newUser;
    } else {
      const user = identity;
      const usermap = {
        zangsan: 1,
        lisi: 2,
        wangwu: 3,
      };

      return this.getUser(usermap[user] || 1);
    }
  }
}
