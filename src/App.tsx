import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Flex, Textarea, Button, Text, Box, Heading } from "@chakra-ui/react";
const v = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Flex align="center" justifyContent="space-between" w="100vw" h="100vh">
          <List title="Chats ativos" />
          <Flex
            flexDirection="column"
            justifyContent="flex-end"
            h="100%"
            w="50%"
            padding="10px"
            bg="#f5f5f5"
            borderInline="2px solid #ebebeb"
          >
            <Flex
              flexDirection="column"
              overflowY="scroll"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              paddingBottom="30px"
            >
              <Flex maxWidth="50vw" marginBottom="20px">
                <Avatar color="black" />
                <Flex maxWidth="80%" flexDirection="column">
                  <Text>Fulano</Text>

                  <Flex padding="10px" bg="white">
                    <Text>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Quas, facere? Autem asperiores repellendus sapiente
                      consequuntur ipsam molestias explicabo similique provident
                      iure voluptates, quod mollitia sequi eaque dolores, odit
                      blanditiis? Saepe.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              <Flex
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
                  <Text>Fulano</Text>

                  <Flex padding="10px" bg="#e9eaf6">
                    <Text>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Quas, facere? Autem asperiores repellendus sapiente
                      consequuntur ipsam molestias explicabo similique provident
                      iure voluptates, quod mollitia sequi eaque dolores, odit
                      blanditiis? Saepe.
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Textarea
              backgroundColor="white"
              colorScheme="purple"
              focusBorderColor="purple"
            />
            <Flex
              padding="5px"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                <Avatar picSize="30px" color="purple" />
                <Text>Levi Arcanjo</Text>
              </Flex>
              <Button colorScheme="purple">Enviar</Button>
            </Flex>
          </Flex>

          <List picSize="30px" spacing="10px" title="Online agora" />
        </Flex>
      </div>
    </ChakraProvider>
  );
}

export default App;

const Avatar = ({ picSize = "20px", color = "purple" }) => {
  return (
    <Box
      w={picSize}
      h={picSize}
      mr="10px"
      borderRadius="50%"
      bg={color}
      boxShadow="rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;"
    />
  );
};

type ListProps = {
  spacing?: string;
  items?: {
    color?: string;
    name: string;
  }[];
  picSize?: string;
  title?: string;
  lastMsg?: string;
};
const List = ({
  spacing = "15px",
  picSize = "50px",
  title = "listTitle",
  lastMsg,
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
      {v.map((i) => (
        <Flex
          cursor="pointer"
          _hover={{ opacity: "0.6" }}
          key={i}
          marginBottom={spacing}
          width="100%"
          alignItems="center"
        >
          <Avatar
            color={"#" + Math.floor(Math.random() * 16777215).toString(16)}
            picSize={picSize}
          />
          <Flex flexDirection="column">
            <Text color="gray.700">Levi Arcanjo</Text>
            {lastMsg && (
              <Text fontSize="sm" color="gray.400">
                Ultima mensagem
              </Text>
            )}
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
