import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import Socket from "socket.io-client";
import useInterval from "./hooks/useInterval";
import toast from "react-hot-toast";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";
import { SocketClientProps } from "./types/SocketClient";

const ENDPOINT = "http://localhost:3333";
const socketConnection = Socket(ENDPOINT);

export type ChatProps = {
  messages: {
    text: string;
    time: number;
    name: string;
    msgId: string;
  }[];
};

function App() {
  const [connection] = useState(socketConnection);
  const [name, setName] = useState("");
  const [myColor] = useState(
    "#" +
      Math.floor(
        Math.random() * (Math.random() * (19999999 - 10000000) + 10000000)
      ).toString(16)
  );
  const [onlineClients, setOnlineClients] = useState<SocketClientProps[]>([]);
  const [clients] = useState<SocketClientProps[]>([]);

  const [currentChat, setCurrentChat] = useState<SocketClientProps>();
  const [activeChatsUsers] = useState<SocketClientProps[]>([]);
  const inputValue = useRef<HTMLInputElement>(null);

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
    const user = clients.find((c) => c.socketId === socketId);

    if (typeof user !== "undefined") {
      setCurrentChat(user);
    } else {
      console.log("Error in chat selection");
    }
  }

  const onReceiveMsg = useCallback(
    (senderSocketId: string, senderName: string, receivedMsg: string) => {
      // console.log(clients);

      const current = clients.find((c) => c.socketId === senderSocketId);

      if (typeof current !== "undefined") {
        current.chat?.messages.push({
          name: senderName,
          text: receivedMsg,
          time: Date.now(),
          msgId: (current.chat.messages.length + 1).toString(),
        });
        const isActive = activeChatsUsers.find(
          (i) => i.socketId === current?.socketId
        );
        if (!isActive) {
          activeChatsUsers.push(current);
        }
      }
    },
    []
  );

  useEffect(() => {
    connection.on("connect", () => {
      console.log("Socket connected");
    });

    connection.on("disconnect", () => {
      console.log("Socket disconnected");
      setName("");
    });

    connection.on("message", (data) => {
      onReceiveMsg(data.senderSocketId, data.senderName, data.message);
    });
  }, []);

  useInterval(() => {
    if (name !== "") {
      connection?.emit("online", (data: SocketClientProps[]) => {
        if (data.length > 0) {
          clients.forEach((i) => (i.online = false));
          //console.log(clients);

          data.forEach((i) => {
            const exists = clients.find((j) => j.socketId === i.socketId);

            if (!!exists) {
              exists.online = true;
            } else {
              clients.push({
                color:
                  "#" +
                  Math.floor(
                    Math.random() *
                      (Math.random() * (19999999 - 10000000) + 10000000)
                  ).toString(16),
                name: i.name,
                socketId: i.socketId,
                online: true,
                chat: {
                  messages: [],
                },
              });
            }
          });

          const newOnlineList = clients.filter((c) => c.online);
          setOnlineClients(newOnlineList);
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
      activeChats={activeChatsUsers}
    />
  );
}
export default App;
