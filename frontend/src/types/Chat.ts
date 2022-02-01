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
  file?: ChatFile;
};

export type MessageBuffer = {
  senderSocketId: string;
  receivedMsg: string | File;
  senderName: string;
  file?: ChatFile;
};

export type ChatFile = {
  fileName: string;
  fileType: string;
  fileContent: File;
};
