import "./styles/App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import Socket from "socket.io-client";
import useInterval from "./hooks/useInterval";
import toast from "react-hot-toast";
import { Login } from "./components/Login";
import { ChatUser } from "./types/ChatUser";
import { CurrentChat } from "./components/CurrentChat";
import { ActiveChats } from "./components/ActiveChats";
import { OnlineList } from "./components/OnlineList";
import { Chat, ChatFile, Message, MessageBuffer } from "./types/Chat";
import { getRandomColor } from "./utils/randomColor";
import { Flex } from "@chakra-ui/react";

const ENDPOINT = "http://localhost:3333";
//const ENDPOINT = "https://trabalho-sd-1.herokuapp.com/";
const connection = Socket(ENDPOINT);

const generalUser: ChatUser = {
  name: "Geral",
  socketId: "geral",
  color: "#805ad5",
  online: true,
};

function App() {
  const [userName, setUserName] = useState("");
  const [userColor] = useState(getRandomColor());

  const [onlineUsers, setOnlineUsers] = useState<Array<ChatUser>>([]);

  const [users] = useState<Array<ChatUser>>([generalUser]);
  const [chats] = useState<Array<Chat>>([
    {
      user: generalUser,
      messages: [],
    },
  ]);

  const [currentChat, setCurrentChat] = useState<Chat>({} as any);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messageBuffer, setMessageBuffer] = useState<MessageBuffer>({
    senderName: "",
    receivedMsg: "",
    senderSocketId: "",
  });

  function sendMsg(socketId: string, msg: string | File) {
    if (typeof msg === "string") {
      if (socketId === generalUser.socketId) {
        connection?.emit("sendMessageToAllUsers", {
          message: msg,
        });
      } else {
        connection?.emit("message", {
          receiverId: socketId,
          message: msg,
        });
      }
    } else {
      if (msg !== null) {
        if (socketId === generalUser.socketId) {
          connection.emit("sendFileToAllUsers", {
            file: msg,
            fileName: msg.name,
            fileType: msg.type,
          });
        } else {
          connection.emit("sendFile", {
            receiverId: socketId,
            file: msg,
            fileName: msg.name,
            fileType: msg.type,
          });
        }
      }
    }
  }

  function playAudio() {
    new Audio(require("./assets/notification.mp3")).play();
  }

  function register() {
    if (
      inputRef.current &&
      inputRef.current.value.length > 3 &&
      inputRef.current.value !== "Geral" &&
      inputRef.current.value !== "geral" &&
      inputRef.current.value !== "undefined" &&
      inputRef.current.value !== "null"
    ) {
      toast.loading("Verficando nome...");
      connection?.emit(
        "register",
        {
          name: inputRef.current.value,
        },
        (data: boolean) => {
          toast.dismiss();
          if (data === false && inputRef.current) {
            setUserName(inputRef.current.value);
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
    const chat = chats.find((c) => c.user.socketId === socketId);

    if (typeof chat !== "undefined") {
      setCurrentChat(chat);
      console.log("Chat selected:");
      console.log(chat);
    } else {
      const user = users.find((u) => u.socketId === socketId);
      if (!!user) {
        console.log("Chat created", user);
        chats.push({
          user,
          messages: [],
        });
        setCurrentChat(chats[chats.length - 1]);
      } else {
        console.log("Error in chat selection");
      }
    }
  }

  function onReceiveMsg(
    senderSocketId: string,
    senderName: string,
    receivedMsg: string | ChatFile
  ) {
    playAudio();
    const respectiveChat = chats.find(
      (c) => c.user.socketId === senderSocketId
    );

    let message: Message = {
      name: senderName,
      text: "",
      time: Date.now(),
      msgId: "",
      color: "",
    };

    if (typeof receivedMsg === "string") {
      message.text = receivedMsg;
      console.log("String arrived");
      console.log(receivedMsg);
    } else {
      message.text = receivedMsg.fileName;
      message.file = receivedMsg;
      console.log("FIle arrived");
    }

    let color = "";

    if (senderSocketId === generalUser.socketId) {
      const respectiveUser = users.find((u) => u.name === senderName);
      if (!!respectiveUser) {
        color = respectiveUser.color;
      }
    }

    if (typeof respectiveChat !== "undefined") {
      message.msgId = respectiveChat.messages.length.toString();
      message.color = color === "" ? respectiveChat.user.color : color;
      respectiveChat.messages.unshift(message);
    } else {
      const user = users.find((u) => u.socketId === senderSocketId);
      if (!!user) {
        message.color = color === "" ? user.color : color;
        message.msgId = "0";
        chats.push({
          messages: [message],
          user,
        });
      }
    }
  }
  const updateOnlineList = useCallback(() => {
    connection?.emit("online", (data: ChatUser[]) => {
      if (data.length > 0) {
        users.forEach((i) => (i.online = false));

        data.forEach((i) => {
          const exists = users.find((j) => j.socketId === i.socketId);

          if (!!exists) {
            exists.online = true;
          } else {
            users.push({
              color: getRandomColor(),
              name: i.name,
              socketId: i.socketId,
              online: true,
            });
          }
        });

        const newOnlineList = users.filter((c) => c.online);
        setOnlineUsers(newOnlineList);
      } else {
        setOnlineUsers([]);
      }
    });
  }, [users]);

  useEffect(() => {
    connection.on("connect", () => {
      console.log("Socket connected");
    });

    connection.on("disconnect", () => {
      console.log("Socket disconnected");
      setUserName("");
    });

    connection.on("message", (data) => {
      setMessageBuffer({
        senderSocketId: data.senderSocketId,
        receivedMsg: data.message,
        senderName: data.senderName,
      });
    });

    connection.on("messageAllUsers", (data) => {
      //console.log(data);
      setMessageBuffer({
        senderSocketId: generalUser.socketId,
        receivedMsg: data.message,
        senderName: data.senderName,
      });
    });

    connection.on("file", (data) => {
      const newBuffer: MessageBuffer = {
        file: {
          fileName: data.fileName,
          fileType: data.fileType,
          fileContent: data.file,
        },
        receivedMsg: data.fileName,
        senderName: data.senderName,
        senderSocketId: data.senderSocketId,
      };
      setMessageBuffer(newBuffer);
    });

    connection.on("fileFromGeneral", (data) => {
      const newBuffer: MessageBuffer = {
        file: {
          fileName: data.fileName,
          fileType: data.fileType,
          fileContent: data.file,
        },
        receivedMsg: data.fileName,
        senderName: data.senderName,
        senderSocketId: generalUser.socketId,
      };
      setMessageBuffer(newBuffer);
    });
  }, []);

  useEffect(() => {
    if (!messageBuffer.file && typeof messageBuffer.receivedMsg === "string") {
      onReceiveMsg(
        messageBuffer.senderSocketId,
        messageBuffer.senderName,
        messageBuffer.receivedMsg
      );
    } else {
      if (!!messageBuffer.file) {
        onReceiveMsg(
          messageBuffer.senderSocketId,
          messageBuffer.senderName,
          messageBuffer.file
        );
      }
    }
  }, [messageBuffer]);

  useInterval(updateOnlineList, 3000);

  if (userName === "") {
    return <Login connect={register} inputRef={inputRef} />;
  }

  return (
    <Flex align="center" justifyContent="space-between" w="100vw" h="100vh">
      <ActiveChats
        chats={chats}
        onClickItem={selectChat}
        title="Chats ativos"
      />
      <CurrentChat
        userColor={userColor}
        userName={userName}
        currentChat={currentChat}
        sendMsgToServer={sendMsg}
      />

      <OnlineList
        users={onlineUsers}
        picSize="30px"
        spacing="10px"
        title="Online agora"
        onClickItem={selectChat}
      />
    </Flex>
  );
}
export default App;
