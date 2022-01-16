import { Flex, Text, Box, Input, Button } from "@chakra-ui/react";

import { Avatar } from "./Avatar";
import { Chat } from "../types/Chat";

import { useRef, useState } from "react";
import { FaPaperclip } from "react-icons/fa";

export type CurrentChatProps = {
  userName: string;
  userColor: string;
  currentChat: Chat;
  sendMsgToServer: (socketId: string, msg: string | File) => void;
};

export const CurrentChat = ({
  userName = "Your name here",
  userColor = "purple",
  currentChat,
  sendMsgToServer,
}: CurrentChatProps) => {
  const [msg, setMsg] = useState<string | File>("");
  const inputRef = useRef<HTMLInputElement>(null);

  function sendMsg() {
    if (typeof msg === "string") {
      if (msg.length > 0 && !msg.startsWith("\n") && !msg.startsWith(" ")) {
        sendMsgToServer(currentChat?.user.socketId, msg);
        console.log("new msg sent:", msg);
        currentChat.messages.unshift({
          color: userColor,
          msgId: currentChat.messages.length.toString(),
          name: userName,
          text: msg,
          time: Date.now(),
        });
        setMsg("");
      } else {
        console.log("Invalid message", msg);
      }
    } else {
      sendMsgToServer(currentChat?.user.socketId, msg);
      currentChat.messages.unshift({
        color: userColor,
        msgId: currentChat.messages.length.toString(),
        name: userName,
        text: msg,
        time: Date.now(),
      });
    }
  }

  return (
    <div className="App">
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        h="100vh"
        w="50vw"
        padding="10px"
        bg="#f5f5f5"
        borderInline="2px solid #ebebeb"
      >
        {currentChat.user && (
          <>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <Avatar picSize="30px" color={currentChat?.user.color} />
                <Text>{currentChat?.user.name}</Text>
              </Flex>
              <Text>{currentChat.user.online ? "Online" : "offline"}</Text>
            </Flex>
            <Flex
              flexDirection="column-reverse"
              overflowY="scroll"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              h="100%"
              paddingY="30px"
            >
              {currentChat.messages &&
                currentChat.messages.map((i) => {
                  return i.name === userName ? (
                    <Flex
                      key={i.time.toString() + i.name}
                      flexDirection="row-reverse"
                      maxWidth="50vw"
                      marginBottom="20px"
                    >
                      <Avatar color={userColor} />
                      <Flex
                        paddingRight="5px"
                        maxWidth="80%"
                        flexDirection="column"
                        alignItems="flex-end"
                      >
                        <Text>{i.name}</Text>

                        <Flex padding="10px" bg="#e9eaf6">
                          <Text>{i.text}</Text>
                        </Flex>
                        <Text fontSize="10px">
                          {new Date(i.time).toLocaleTimeString()}
                        </Text>
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex
                      key={i.time.toString() + i.name}
                      maxWidth="50vw"
                      marginBottom="20px"
                    >
                      <Avatar color={i.color || currentChat.user.color} />
                      <Flex maxWidth="80%" flexDirection="column">
                        <Text>{i.name}</Text>

                        <Flex padding="10px" bg="white">
                          <Text>{i.text}</Text>
                        </Flex>
                        <Text fontSize="10px">
                          {new Date(i.time).toLocaleTimeString()}
                        </Text>
                      </Flex>
                    </Flex>
                  );
                })}
            </Flex>
            {typeof msg === "string" && (
              <Input
                h="70px"
                backgroundColor="white"
                colorScheme="purple"
                focusBorderColor="purple"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMsg();
                  }
                  return false;
                }}
              />
            )}
            <Flex
              padding="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <Avatar picSize="30px" color={userColor} />
                <Text>{userName}</Text>
              </Flex>

              <Input
                display="none"
                onChange={(e) => {
                  console.log("File selected");
                  if (e.target.files !== null) {
                    setMsg(e.target.files[0]);
                  }
                }}
                ref={inputRef}
                type="file"
                colorScheme="purple"
              />
              <Flex alignItems="center">
                <Box
                  onClick={() => inputRef.current?.click()}
                  cursor="pointer"
                  _hover={{ opacity: "0.6" }}
                >
                  <FaPaperclip color="gray" size={30} />
                </Box>
                <Button
                  marginLeft="10px"
                  onClick={() => sendMsg()}
                  colorScheme="purple"
                >
                  Enviar
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </div>
  );
};
