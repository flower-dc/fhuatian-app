import { Message } from "@huatian/model";
import { UserRepository } from "../repo/UserRepository";
import { ChatIdService } from "../service/ChatIdService";

export class ChatContent {
  private static inst: ChatContent = new ChatContent();
  private repo = UserRepository.getInstance();

  static getInstance() {
    return ChatContent.inst;
  }
  async send(uid: number, msg: Message) {
    const sentMsg = { ...msg };
    const toReceiveMsg = { ...msg };
    sentMsg.id = await ChatIdService.getInstance().getId();
    toReceiveMsg.id = await ChatIdService.getInstance().getId();
    msg.from = uid;
    const from = this.repo.getUser(msg.from);
    const to = this.repo.getUser(msg.to);
    const session = from.chat().createSession(to);
    session.chat(sentMsg, toReceiveMsg);
    return sentMsg.id;
  }
  read(uid: number, lastId: number) {
    const user = this.repo.getUser(uid);
    return user.chat().unReadMessage(lastId);
  }
}
