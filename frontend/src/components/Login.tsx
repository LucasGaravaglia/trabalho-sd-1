import { Flex, Heading, Button, Input } from "@chakra-ui/react";

export type LoginProps = {
  inputRef: React.RefObject<HTMLInputElement>;
  connect: () => void;
};
export const Login = ({ connect, inputRef }: LoginProps) => {
  return (
    <Flex
      bg="#FFF"
      alignItems="center"
      justifyContent="center"
      w="100vw"
      h="100vh"
    >
      <Flex
        w="400px"
        h={"300px"}
        bg="#FFF"
        boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px;"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-evenly"
        textAlign="center"
      >
        <Flex flexDirection="column">
          <Heading size="md" color="#555555">
            Bem vindo!
          </Heading>
          <Heading size="sm" color="#555555">
            Insira seu nome para continuar
          </Heading>
        </Flex>
        <Input
          width="80%"
          h="60px"
          focusBorderColor="purple"
          placeholder="Seu nome aqui..."
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              connect();
            }
          }}
        />
        <Button onClick={connect} colorScheme="purple">
          Entrar
        </Button>
      </Flex>
    </Flex>
  );
};
