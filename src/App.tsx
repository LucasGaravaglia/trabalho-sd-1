import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
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
    msgId: string;
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

  function sendMsg(socketId: string, msg: string) {
    connection?.emit("message", {
      receiverId: socketId,
      message: msg,
    });
  }

  function register() {
    toast.loading("Verficando nome...", {
      duration: 1000,
    });
    if (inputValue.current && inputValue.current.value.length > 3)
      connection?.emit(
        "register",
        {
          name: inputValue.current.value,
        },
        (data: boolean) => {
          if (data === false && inputValue.current) {
            setName(inputValue.current.value);
          } else {
            toast.error("Erro!! Nome já existente");
          }
        }
      );
  }

  function selectChat(socketId: string) {
    const current = chats.find((c) => c.contact.socketId === socketId);

    if (typeof current === "undefined") {
      const newChat: ChatProps = {
        contact: onlineClients.find((c) => c.socketId === socketId) || {
          name: "undefined",
          socketId: "undefined",
        },
        messages: [],
      };
      chats.push(newChat);
      setCurrentChat(newChat);
      console.log(currentChat);
    } else {
      console.log("Chat existente");
      setCurrentChat(current);
    }
  }

  function onReceiveMsg(
    senderSocketId: string,
    senderName: string,
    receivedMsg: string
  ) {
    console.log(onlineClients);
    const current = chats.find((c) => c.contact.socketId === senderSocketId);

    if (typeof current === "undefined") {
      const newChat: ChatProps = {
        contact: onlineClients.find((c) => c.socketId == senderSocketId) || {
          name: "undefined",
          socketId: "undefined",
        },
        messages: [
          {
            name: senderName,
            text: receivedMsg,
            time: Date.now(),
            msgId: "0",
          },
        ],
      };
      if (newChat.contact.name !== "undefined") {
        chats.push(newChat);
      }
    } else {
      current.messages.push({
        name: senderName,
        text: receivedMsg,
        time: Date.now(),
        msgId: (current.messages.length + 1).toString(),
      });
    }
  }

  useEffect(() => {
    const socketConnection = Socket(ENDPOINT);

    socketConnection.on("connect", () => {
      console.log("Socket connected");
      setConnected(true);
    });

    socketConnection.on("disconnect", () => {
      console.log("Socket disconnected");
      setName("");
    });

    socketConnection.on("message", (data) => {
      //onReceiveMsg(data.senderSocketId, data.name, data.message);
      console.log(data);
    });

    setConnection(socketConnection);
  }, []);

  useInterval(() => {
    if (name !== "") {
      connection?.emit("online", (data: SocketClientProps[]) => {
        if (data.length > 0) {
          const newClients = data.map((i) => {
            const exists = onlineClients.find((j) => j.socketId === i.socketId);

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
      });
    }
  }, 3000);

  if (name === "") {
    return <Login connect={register} inputRef={inputValue} />;
  }

  return (
    <Chat
      myColor={myColor}
      selectChat={selectChat}
      name={name}
      onlineClients={onlineClients}
      currentChat={currentChat}
      sendMsgToServer={sendMsg}
      activeChats={chats.filter((c) => c.messages.length > 0)}
    />
  );
}
export default App;
