import { Flex, Heading, Text } from "@chakra-ui/react";
import { SocketClientProps } from "../types/SocketClient";
import { Avatar } from "./Avatar";
import { ChatProps } from "../App";

export type ListProps = {
  spacing?: string;
  contacts?: Array<SocketClientProps>;
  chats?: Array<ChatProps>;
  picSize?: string;
  title?: string;
  lastMsg?: string;
  onClickItem: (socketId: string) => void;
};
export const List = ({
  spacing = "15px",
  picSize = "50px",
  title = "listTitle",
  lastMsg,
  contacts,
  onClickItem,
  chats,
}: ListProps) => {
  return (
    <Flex
      padding="20px"
      flexDirection="column"
      bg="#f5f5f5"
      h="100%"
      w="25%"
      overflowY="scroll"
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Heading
        marginInline="auto"
        color="purple.800"
        marginBottom="10px"
        size="md"
      >
        {title}
      </Heading>
      {contacts &&
        contacts.map((i) => (
          <Flex
            cursor="pointer"
            _hover={{ opacity: "0.6" }}
            key={i.socketId}
            marginBottom={spacing}
            width="100%"
            alignItems="center"
            onClick={() => onClickItem(i.socketId)}
          >
            <Avatar color={i.color || "back"} picSize={picSize} />
            <Flex flexDirection="column">
              <Text color="gray.700">{i.name}</Text>
              {lastMsg && (
                <Text fontSize="sm" color="gray.400">
                  Ultima mensagem
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
      {chats &&
        chats.map((i) => (
          <Flex
            cursor="pointer"
            _hover={{ opacity: "0.6" }}
            key={i.contact.socketId}
            marginBottom={spacing}
            width="100%"
            alignItems="center"
            onClick={() => onClickItem(i.contact.socketId)}
          >
            <Avatar color={i.contact.color || "back"} picSize={picSize} />
            <Flex flexDirection="column">
              <Text color="gray.700">{i.contact.name}</Text>
              {i.messages.length > 0 && (
                <Text fontSize="sm" color="gray.400">
                  {i.messages[i.messages.length - 1].name}:{" "}
                  {i.messages[i.messages.length - 1].text}
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};