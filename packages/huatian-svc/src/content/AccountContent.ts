import { UserRepository } from "../repo/UserRepository";

export class AccountContent {
  private static inst: AccountContent;
  private repo: UserRepository = UserRepository.getInstance();
  public static getInstance() {
    if (!AccountContent.inst) {
      AccountContent.inst = new AccountContent();
    }
    return AccountContent.inst;
  }

  public async verify(uname: string, upwd: string) {
    const user = this.repo.getUser(uname, upwd);
    return user;
  }
}
