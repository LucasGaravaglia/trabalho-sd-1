import { ChatUser } from "./ChatUser";

export type Chat = {
  messages: Message[];
  user: ChatUser;
};

export type Message = {
  text: string;
  time: number;
  name: string;
  msgId: string;
  color: string;
  file?: File;
};

export type MessageBuffer = {
  senderSocketId: string;
  receivedMsg: string | File;
  senderName: string;
};
