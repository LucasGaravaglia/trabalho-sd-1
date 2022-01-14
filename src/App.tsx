import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import Socket from "socket.io-client";
import useInterval from "./hooks/useInterval";
import toast from "react-hot-toast";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";
import { SocketClientProps } from "./types/SocketClient";

// const ENDPOINT = "http://localhost:3333";
const ENDPOINT = "https://trabalho-sd-1.herokuapp.com/";
const socketConnection = Socket(ENDPOINT);

export type ChatProps = {
  messages: {
    text: string;
    time: number;
    name: string;
    msgId: string;
    color?: string;
  }[];
};

const general = {
  name: "Geral",
  socketId: "geral",
  color: "#805ad5",
  online: true,
  chat: {
    messages: [],
  },
};

function App() {
  const [connection] = useState(socketConnection);
  const [soundNotification] = useState(new Audio("./assets/notification.wav"));
  const [name, setName] = useState("");
  const [myColor] = useState(
    "#" +
      Math.floor(
        Math.random() * (Math.random() * (19999999 - 10000000) + 10000000)
      ).toString(16)
  );
  const [onlineClients, setOnlineClients] = useState<SocketClientProps[]>([]);
  const [clients] = useState<SocketClientProps[]>([general]);

  const [currentChat, setCurrentChat] = useState<SocketClientProps>();
  const [activeChatsUsers] = useState<SocketClientProps[]>([general]);
  const inputValue = useRef<HTMLInputElement>(null);

  function sendMsg(socketId: string, msg: string) {
    if (socketId === general.socketId) {
      connection?.emit("sendMessageToAllUsers", {
        message: msg,
      });
    } else {
      connection?.emit("message", {
        receiverId: socketId,
        message: msg,
      });
    }
  }

  function playAudio() {
    new Audio(require("./assets/notification.mp3")).play();
  }

  function register() {
    toast.loading("Verficando nome...", {
      duration: 1000,
    });
    if (
      inputValue.current &&
      inputValue.current.value.length > 3 &&
      inputValue.current.value !== "Geral" &&
      inputValue.current.value !== "geral"
    ) {
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
    } else {
      toast.error("Nome inválido!!");
    }
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
      playAudio();
      const current = clients.find((c) => c.socketId === senderSocketId);

      if (typeof current !== "undefined") {
        current.chat?.messages.unshift({
          name: senderName,
          text: receivedMsg,
          time: Date.now(),
          msgId: (current.chat.messages.length + 1).toString(),
          color:
            senderSocketId === general.socketId
              ? clients.find((x) => x.name === senderName)?.color
              : current.color,
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

    connection.on("messageAllUsers", (data) => {
      console.log(data);
      onReceiveMsg(general.socketId, data.senderName, data.message);
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
