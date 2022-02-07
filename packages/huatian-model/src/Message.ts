export enum MessageStates {
  SEDING = 0,
  SENT,
  RECEIVING,
  RECEIVED,
  READED,
  ERROR,
}

export enum MessageType {
  SEND,
  RECEIVED,
  SYSTEM,
  NOTIFY,
}

export type Message = TextMessage | ImageUrl;

export interface MessageData {
  id: number;
  status: MessageStates;
  type: MessageType;
  from: number;
  to: number;
}

export interface TextMessage extends MessageData {
  msg: string;
}

export interface ImageUrl extends MessageData {
  url: string;
}
