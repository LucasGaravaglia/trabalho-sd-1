import "./App.css";
import { useEffect, useState, useRef } from "react";
import Socket, { Socket as SocketProps } from "socket.io-client";
import useInterval from "./hooks/useInterval";
import toast from "react-hot-toast";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";
import { SocketClientProps } from "./types/SocketClient";

const ENDPOINT = "http://localhost:3333";

export type ChatProps = {
  messages: {
    text: string;
    time: number;
    name: string;
  }[];
  contact: SocketClientProps;
};

function App() {
  const [connection, setConnection] = useState<SocketProps>();
  const [name, setName] = useState("");
  const [myColor, setMyColor] = useState(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );
  const [onlineClients, setOnlineClients] = useState<SocketClientProps[]>([]);
  const [isConnected, setConnected] = useState(false);
  const inputValue = useRef<HTMLInputElement>(null);

  const [currentChat, setCurrentChat] = useState<ChatProps>();
  const [chats, setChats] = useState<ChatProps[]>([]);

  function selectChat(socketId: string) {
    const current = chats.find((c) => c.contact.socketId === socketId);

    if (!!current) {
      const newChat: ChatProps = {
        contact: onlineClients.find((c) => c.socketId === socketId) || {
          name: "undefined",
          socketId: "undefined",
        },
        messages: [],
      };
      chats.push(newChat);
      setCurrentChat(newChat);
    }
  }

  function connect() {
    if (inputValue.current && inputValue.current.value.length > 3) {
      toast.loading("Connectando...", {
        duration: 1000,
      });
      setName(inputValue.current.value);
      connection?.disconnect();
      setConnection(
        Socket(ENDPOINT, {
          query: {
            name: inputValue.current.value,
          },
        })
      );
    }
  }

  useEffect(() => {
    connection?.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    connection?.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }, [connection]);

  useInterval(
    () =>
      connection?.emit(
        "online",
        { socketId: connection.id },
        (data: SocketClientProps[]) => {
          if (data.length > 0) {
            const newClients = data.map((i) => {
              const exists = onlineClients.find(
                (j) => j.socketId === i.socketId
              );

              if (!!exists) {
                return exists;
              }

              return {
                color: "#" + Math.floor(Math.random() * 16777215).toString(16),
                name: i.name,
                socketId: i.socketId,
              };
            });

            setOnlineClients(newClients);
          }
        }
      ),
    3000
  );

  if (!isConnected) {
    return <Login connect={connect} inputRef={inputValue} />;
  }

  return (
    <Chat
      myColor={myColor}
      selectChat={selectChat}
      name={name}
      onlineClients={onlineClients}
    />
  );
}
export default App;
