import { Flex, Heading, Text } from "@chakra-ui/react";
import { Chat } from "../types/Chat";
import { Avatar } from "./Avatar";

export type ListProps = {
  spacing?: string;
  chats?: Array<Chat>;
  picSize?: string;
  title?: string;
  onClickItem: (socketId: string) => void;
};
export const ActiveChats = ({
  spacing = "15px",
  picSize = "50px",
  title = "listTitle",
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
      {chats &&
        chats.map((i) => (
          <Flex
            cursor="pointer"
            _hover={{ opacity: "0.6" }}
            key={i.user.socketId}
            marginBottom={spacing}
            width="100%"
            alignItems="center"
            onClick={() => onClickItem(i.user.socketId)}
          >
            <Avatar color={i.user.color || "back"} picSize={picSize} />
            <Flex flexDirection="column">
              <Text color="gray.700">{i.user.name}</Text>
              {i.messages.length > 0 && (
                <Text fontSize="sm" color="gray.400">
                  {i.messages.length > 0 && i.messages[0].name}:
                  {i.messages.length > 0 && i.messages[0].text}
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
