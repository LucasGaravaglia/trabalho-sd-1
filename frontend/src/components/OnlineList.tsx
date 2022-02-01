import { Flex, Heading, Text } from "@chakra-ui/react";
import { ChatUser } from "../types/ChatUser";
import { Avatar } from "./Avatar";

export type OnlineListProps = {
  spacing?: string;
  users?: Array<ChatUser>;
  picSize?: string;
  title?: string;
  onClickItem: (socketId: string) => void;
};
export const OnlineList = ({
  spacing = "15px",
  picSize = "50px",
  title = "listTitle",
  users,
  onClickItem,
}: OnlineListProps) => {
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
      {users &&
        users.map((i) => (
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
            </Flex>
          </Flex>
        ))}
    </Flex>
  );
};
