import { Box } from "@chakra-ui/react";

export const Avatar = ({ picSize = "20px", color = "purple" }) => {
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
