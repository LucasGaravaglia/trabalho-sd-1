import { ChatProps } from "../App";

export type SocketClientProps = {
  name: string;
  socketId: string;
  color?: string;
  online?: boolean;
  chat?: ChatProps;
};
