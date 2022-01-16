import { ChatUser } from "./ChatUser";

export type Chat = {
  messages: Message[];
  user: ChatUser;
};

export type Message = {
  text: string | File;
  time: number;
  name: string;
  msgId: string;
  color: string;
};

export type MessageBuffer = {
  senderSocketId: string;
  receivedMsg: string | File;
  senderName: string;
};
