import { Flex, Text, Textarea, Button } from "@chakra-ui/react";
import { List } from "./OnlineList";
import { Avatar } from "./Avatar";
import { SocketClientProps } from "../types/SocketClient";
import { ChatProps } from "../App";
import { useRef, useState } from "react";

export type ChatComponentProps = {
  onlineClients: Array<SocketClientProps>;
  name?: string;
  selectChat: (socketId: string) => void;
  myColor?: string;
  currentChat?: ChatProps;
  sendMsgToServer: (socketId: string, msg: string) => void;
  activeChats?: ChatProps[];
};

export const Chat = ({
  onlineClients,
  name = "Your name here",
  selectChat,
  myColor = "purple",
  currentChat,
  sendMsgToServer,
  activeChats,
}: ChatComponentProps) => {
  const [msg, setMsg] = useState("");

  function sendMsg() {
    if (msg.length > 0 && currentChat) {
      sendMsgToServer(currentChat?.contact.socketId, msg);
      console.log("new msg sent", msg);
      currentChat?.messages.push({
        name: name,
        text: msg,
        time: Date.now(),
      });
      setMsg("");
    }
  }

  return (
    <div className="App">
      <Flex align="center" justifyContent="space-between" w="100vw" h="100vh">
        <List
          chats={activeChats}
          onClickItem={selectChat}
          title="Chats ativos"
        />

        <Flex
          flexDirection="column"
          justifyContent="flex-end"
          h="100%"
          w="50%"
          padding="10px"
          bg="#f5f5f5"
          borderInline="2px solid #ebebeb"
        >
          {currentChat && (
            <>
              <Flex alignItems="center">
                <Avatar picSize="30px" color={currentChat?.contact.color} />
                <Text>{currentChat?.contact.name}</Text>
              </Flex>
              <Flex
                flexDirection="column"
                overflowY="scroll"
                css={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                h="100%"
                paddingY="30px"
              >
                {currentChat &&
                  currentChat.messages.map((i) => {
                    return i.name === name ? (
                      <Flex
                        key={Date.now() + i.time}
                        flexDirection="row-reverse"
                        maxWidth="50vw"
                        marginBottom="20px"
                      >
                        <Avatar color={myColor} />
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
                        key={Date.now() + i.time}
                        maxWidth="50vw"
                        marginBottom="20px"
                      >
                        <Avatar color={currentChat.contact.color} />
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
              <Textarea
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
              <Flex
                padding="5px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Flex alignItems="center">
                  <Avatar picSize="30px" color={myColor} />
                  <Text>{name}</Text>
                </Flex>
                <Button onClick={() => sendMsg()} colorScheme="purple">
                  Enviar
                </Button>
              </Flex>
            </>
          )}
        </Flex>

        <List
          contacts={onlineClients}
          picSize="30px"
          spacing="10px"
          title="Online agora"
          onClickItem={selectChat}
        />
      </Flex>
    </div>
  );
};
