import { ChatSission } from "./ChatSession";
import { Message, MessageStates, MessageType } from "./Message";
import { User } from "./User";

export class UserChat {
  private user: User;
  private msgs: Array<Message> = [];
  private sessions: Record<number, ChatSission> = {};

  public constructor(user: User) {
    this.user = user;
  }

  public createSession(to: User) {
    if (this.sessions[to.getId()]) return this.sessions[to.getId()];
    const session = new ChatSission(this.user, to);
    this.sessions[to.getId()] = session;
    return session;
  }

  public send(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStates.SENT;
    msg.type = MessageType.SEND;
  }
  public receive(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStates.RECEIVING;
    msg.type = MessageType.RECEIVED;
  }

  public readTo(lastId: number) {
    const unRead = this.msgs.filter(
      (m) => m.id < lastId && m.status === MessageStates.RECEIVED
    );
    unRead.forEach((m) => {
      m.status = MessageStates.READED;
    });
  }

  public unReadMessage(lastId: number) {
    return this.msgs.filter((m) => m.id > lastId);
  }
}
