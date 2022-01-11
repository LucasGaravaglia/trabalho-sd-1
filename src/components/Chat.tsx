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
};

export const Chat = ({
  onlineClients,
  name = "Your name here",
  selectChat,
  myColor = "purple",
  currentChat,
}: ChatComponentProps) => {
  const [msg, setMsg] = useState("");

  function sendMsg() {
    if (msg.length > 0) {
      console.log(msg);
      setMsg("");
    }
  }

  return (
    <div className="App">
      <Flex align="center" justifyContent="space-between" w="100vw" h="100vh">
        <List onClickItem={() => console.log("hey")} title="Chats ativos" />
        <Flex
          flexDirection="column"
          justifyContent="flex-end"
          h="100%"
          w="50%"
          padding="10px"
          bg="#f5f5f5"
          borderInline="2px solid #ebebeb"
        >
          <Flex alignItems="center">
            <Avatar picSize="30px" color="black" />
            <Text>Contato</Text>
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
                    key={i.time}
                    flexDirection="row-reverse"
                    maxWidth="50vw"
                    marginBottom="20px"
                  >
                    <Avatar color="black" />
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
                    </Flex>
                  </Flex>
                ) : (
                  <Flex key={i.time} maxWidth="50vw" marginBottom="20px">
                    <Avatar color="black" />
                    <Flex maxWidth="80%" flexDirection="column">
                      <Text>{i.name}</Text>

                      <Flex padding="10px" bg="white">
                        <Text>{i.name}</Text>
                      </Flex>
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
        </Flex>

        <List
          items={onlineClients}
          picSize="30px"
          spacing="10px"
          title="Online agora"
          onClickItem={selectChat}
        />
      </Flex>
    </div>
  );
};
